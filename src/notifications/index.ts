import { Platform } from 'react-native';
import notifee, {
  AndroidImportance,
  EventType,
  Event,
  InitialNotification,
} from '@notifee/react-native';

import {
  FirebaseMessagingTypes,
  getMessaging,
  requestPermission,
  registerDeviceForRemoteMessages,
  getToken,
  onTokenRefresh,
  onMessage,
} from '@react-native-firebase/messaging';

export type DataMap = Record<string, string>;
import { toAppNotification, addOne } from './store';

function normalizeData(input: any): DataMap {
  const out: DataMap = {};
  if (!input) return out;
  Object.entries(input).forEach(([k, v]) => {
    if (typeof v === 'string') out[String(k)] = v;
    else if (v == null) out[String(k)] = '';
    else out[String(k)] = String(typeof v === 'object' ? JSON.stringify(v) : v);
  });
  return out;
}

export async function initNotifications() {
  const msg = getMessaging();

  if (Platform.OS === 'ios') {
    await requestPermission(msg); 
  } else {
    await notifee.requestPermission(); 
  }

  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'General',
      importance: AndroidImportance.HIGH,
      vibration: true,
      sound: 'default',
    });
  }
}

export async function registerFcm(onTokenCb: (t: string) => Promise<void> | void) {
  const msg = getMessaging();

  await registerDeviceForRemoteMessages(msg);
  const token = await getToken(msg);
  if (token) {
    console.log('FCM token:', token);
    await onTokenCb(token);
  }

  onTokenRefresh(msg, async (t: string) => {
    console.log('FCM token refreshed:', t);
    await onTokenCb(t);
  });
}

export async function showLocal(title: string, body: string, data: DataMap = {}) {
  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher',
      pressAction: { id: 'default' },
    },
    ios: {
      sound: 'default',
      foregroundPresentationOptions: { alert: true, badge: true, sound: true },
    },
  });
}

export function bindHandlers(onDeepLink: (data: DataMap) => void) {
  const msg = getMessaging();

  onMessage(msg, async (remote: FirebaseMessagingTypes.RemoteMessage) => {
    const appN = toAppNotification(remote);
    await addOne(appN);
    const data = normalizeData(remote.data);
    const title = appN.title;
    const body  = appN.body;
    await showLocal(title, body, data);
  });

  notifee.onForegroundEvent(({ type, detail }: Event) => {
    if (type === EventType.PRESS) {
      const data = normalizeData(detail.notification?.data);
      onDeepLink(data);
    }
  });

  notifee.getInitialNotification().then((initial: InitialNotification | null) => {
    const data = normalizeData(initial?.notification?.data);
    if (Object.keys(data).length) onDeepLink(data);
  });
}

export async function handleBackgroundMessage(remote: FirebaseMessagingTypes.RemoteMessage) {
  const appN = toAppNotification(remote);
  await addOne(appN);

  const data = normalizeData(remote.data);
  const title = appN.title;
  const body  = appN.body;

  await notifee.displayNotification({
    title,
    body,
    data,
    android: { channelId: 'default', smallIcon: 'ic_launcher', pressAction: { id: 'default' } },
    ios: { sound: 'default' },
  });
}
