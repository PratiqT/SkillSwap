import React from 'react';
import { AppNotification } from '../types';
import { getNotificationIcon } from '../services/notificationService';
import { X, Bell, Check } from 'lucide-react';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClose,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 sm:pt-20 bg-transparent" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-white dark:bg-[#0D1B2A] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-slide-up transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-[#122337]">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-sky-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-1.5 text-[10px] bg-sky-600 dark:bg-teal-500 text-white px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
              )}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-[10px] font-bold text-sky-600 dark:text-teal-400 hover:text-sky-700 dark:hover:text-teal-300 cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/10">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
              <Bell className="w-6 h-6 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif.id}
                type="button"
                onClick={() => onMarkRead(notif.id)}
                className={`w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-start space-x-3 ${
                  !notif.read ? 'bg-sky-50/30 dark:bg-sky-950/30' : ''
                }`}
              >
                <span className="text-lg shrink-0 mt-0.5">{getNotificationIcon(notif.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{notif.title}</span>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-teal-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{notif.createdAt}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
