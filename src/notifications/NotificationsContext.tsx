import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AppNotification } from './store';
import { loadAll, addOne, markRead, markAllRead, clearAll } from './store';

type Ctx = {
  items: AppNotification[];
  unread: number;
  refresh: () => Promise<void>;
  add: (n: AppNotification) => Promise<void>;
  setRead: (id: string, read?: boolean) => Promise<void>;
  setAllRead: () => Promise<void>;
  reset: () => Promise<void>;
};

const NotificationsContext = createContext<Ctx | null>(null);
export function useNotifications() {
  const v = useContext(NotificationsContext);
  if (!v) throw new Error('NotificationsProvider missing');
  return v;
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<AppNotification[]>([]);

  const refresh = async () => setItems(await loadAll());
  const add = async (n: AppNotification) => { await addOne(n); await refresh(); };
  const setRead = async (id: string, read = true) => { await markRead(id, read); await refresh(); };
  const setAllRead = async () => { await markAllRead(); await refresh(); };
  const reset = async () => { await clearAll(); await refresh(); };

  useEffect(() => { refresh(); }, []);
  const unread = useMemo(() => items.filter(x => !x.read).length, [items]);

  return (
    <NotificationsContext.Provider value={{ items, unread, refresh, add, setRead, setAllRead, reset }}>
      {children}
    </NotificationsContext.Provider>
  );
}
