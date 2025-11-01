import api from './client';

export type SignUpDto = {
  firstname: string; lastname: string; email: string; password: string;
};
export type SignInDto = { email: string; password: string };

export async function signUp(dto: SignUpDto) {
  const { data } = await api.post('/auth/signup', dto);
  return data;
}

export async function signIn(dto: SignInDto) {
  const { data } = await api.post('/auth/login', dto);
  return data;
}

export async function me() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function logout() {
  await api.post('/auth/logout');
}
