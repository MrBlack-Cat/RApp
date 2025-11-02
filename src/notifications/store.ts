import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

const STORAGE_KEY = 'app.notifications.v1';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  data: Record<string, string>;
  receivedAt: number;
  read: boolean;
};

export async function loadAll(): Promise<AppNotification[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as AppNotification[]; } catch { return []; }
}

async function saveAll(list: AppNotification[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function addOne(n: AppNotification) {
  const list = await loadAll();
  list.unshift(n);
  await saveAll(list);
}

export async function markRead(id: string, read = true) {
  const list = await loadAll();
  const i = list.findIndex(x => x.id === id);
  if (i >= 0) {
    list[i].read = read;
    await saveAll(list);
  }
}

export async function markAllRead() {
  const list = await loadAll();
  list.forEach(x => (x.read = true));
  await saveAll(list);
}

export async function clearAll() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

function toStr(v: unknown, fallback = ''): string {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'string') return v;
  try { return JSON.stringify(v); } catch { return String(v); }
}

export function toAppNotification(msg: FirebaseMessagingTypes.RemoteMessage): AppNotification {
  const t1 = (msg.notification as any)?.title;
  const b1 = (msg.notification as any)?.body;
  const t2 = (msg.data as any)?.title;
  const b2 = (msg.data as any)?.body;

  const title = toStr(t1 ?? t2 ?? 'Notification');
  const body  = toStr(b1 ?? b2 ?? '');

  const data = Object.fromEntries(
    Object.entries(msg.data || {}).map(([k, v]) => [k, toStr(v)])
  ) as Record<string, string>;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    body,
    data,
    receivedAt: Date.now(),
    read: false,
  };
}
