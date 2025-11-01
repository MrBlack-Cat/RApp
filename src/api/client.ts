import axios, {
  AxiosHeaders,
  InternalAxiosRequestConfig,
  AxiosRequestConfig
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'https://ilkinibadov.com/api/v1';

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

function setAuthHeader(
  config: InternalAxiosRequestConfig,
  token: string
): InternalAxiosRequestConfig {
  if (config.headers instanceof AxiosHeaders) {
    config.headers.set('Authorization', `Bearer ${token}`);
  } else if (config.headers) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  } else {
    config.headers = new AxiosHeaders({ Authorization: `Bearer ${token}` });
  }
  return config;
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const access = await AsyncStorage.getItem('accessToken');
  if (access) return setAuthHeader(config, access);
    const currency = await AsyncStorage.getItem('currency'); 
  if (currency) {
    config.params = { ...(config.params || {}), currency };
  }
  return config;
});

let isRefreshing = false;
let queue: Array<(t: string | null) => void> = [];

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const config = (error?.config || {}) as RetryConfig;
    const status = error?.response?.status;

    if (status === 401 && !config._retry) {
      config._retry = true;

      if (isRefreshing) {
        const token = await new Promise<string | null>((res) => queue.push(res));
        if (token) {
          return api(setAuthHeader(config, token));
        }
        return Promise.reject(error);
      }

      isRefreshing = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('no refresh token');

        const r = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const newAccess = r.data?.accessToken as string;

        await AsyncStorage.setItem('accessToken', newAccess);
        queue.forEach((cb) => cb(newAccess));
        queue = [];

        return api(setAuthHeader(config, newAccess));
      } catch (e) {
        queue.forEach((cb) => cb(null));
        queue = [];
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
