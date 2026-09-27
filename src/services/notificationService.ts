import { AppNotification, NotificationType } from '../types';

export function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  relatedId?: string
): AppNotification {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    userId,
    type,
    title,
    message,
    read: false,
    createdAt: new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
    relatedId,
  };
}

export function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case 'session_request': return '📩';
    case 'session_accepted': return '✅';
    case 'session_completed': return '🎉';
    case 'badge_earned': return '🏅';
    case 'review_received': return '⭐';
    case 'moderation_warning': return '⚠️';
    case 'appeal_update': return '📋';
    default: return '🔔';
  }
}
