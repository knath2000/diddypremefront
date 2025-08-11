import { ref, readonly } from 'vue'
import type { Ref } from 'vue'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
  action?: {
    label: string
    handler: () => void
  }
}

interface NotificationState {
  notifications: Ref<Notification[]>
}

const notificationState: NotificationState = {
  notifications: ref([])
}

export const useNotifications = () => {
  const notifications = notificationState.notifications

  const showNotification = (options: Omit<Notification, 'id'>) => {
    const notification: Notification = {
      id: `notification-${Date.now()}-${Math.random()}`,
      duration: 5000,
      ...options
    }

    notifications.value.push(notification)

    // Auto-remove after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, notification.duration)
    }

    return notification.id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n: Notification) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const showSuccess = (message: string, options?: Partial<Notification>) => {
    return showNotification({
      type: 'success',
      message,
      ...options
    })
  }

  const showError = (message: string, options?: Partial<Notification>) => {
    return showNotification({
      type: 'error',
      message,
      duration: 0, // Don't auto-dismiss errors
      ...options
    })
  }

  const showWarning = (message: string, options?: Partial<Notification>) => {
    return showNotification({
      type: 'warning',
      message,
      ...options
    })
  }

  const showInfo = (message: string, options?: Partial<Notification>) => {
    return showNotification({
      type: 'info',
      message,
      ...options
    })
  }

  return {
    notifications: readonly(notifications),
    showNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}