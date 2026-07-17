import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AppNotification } from '../models/notification';
import { NotificationService } from '../services/notificationService';

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    const data = await NotificationService.getAll();
    setNotifications(data);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markAsRead = async (id: string) => {
    await NotificationService.markAsRead(id);
    await load();
  };

  const markAllAsRead = async () => {
    await NotificationService.markAllAsRead();
    await load();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = useMemo(
    () => ({ notifications, unreadCount, isLoading, markAsRead, markAllAsRead, refresh: load }),
    [notifications, isLoading]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
}
