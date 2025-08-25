import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export type NotificationType =
  | 'achievement'
  | 'reminder'
  | 'social'
  | 'system'
  | 'goal';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, 'id' | 'timestamp'>,
  ) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider',
    );
  }
  return context;
};

// Mock initial notifications
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'New Personal Best!',
    message:
      'Congratulations! You just set a new 5K PR of 22:45. Keep up the great work!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    data: { distance: '5K', time: '22:45', improvement: '45 seconds' },
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Workout Reminder',
    message:
      'Your interval training session is scheduled for 6:00 PM today. Get ready to crush it!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    actionRequired: true,
    data: { workoutType: 'Intervals', time: '18:00', location: 'Track Field' },
  },
  {
    id: '3',
    type: 'goal',
    title: 'Weekly Goal Achievement',
    message:
      'Amazing! You completed your 25km weekly running goal. Time to set a new challenge!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    read: false,
    data: { goalType: 'weekly', distance: '25km', completion: 100 },
  },
  {
    id: '4',
    type: 'system',
    title: 'App Update Available',
    message:
      'A new version of Running Mate is available with improved tracking features!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    read: false,
    data: {
      version: '2.1.0',
      features: ['Better GPS tracking', 'New workout types'],
    },
  },
  {
    id: '5',
    type: 'social',
    title: 'New Follower',
    message:
      'Sarah Johnson started following your running journey. Check out her profile!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    read: true,
    data: {
      userId: 'sarah_j',
      profileImage:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
  },
  {
    id: '6',
    type: 'reminder',
    title: 'Rest Day Reminder',
    message:
      "Don't forget that recovery is just as important as training. Enjoy your rest day!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    read: true,
    data: { reminderType: 'rest', importance: 'high' },
  },
  {
    id: '7',
    type: 'achievement',
    title: 'Consistency Streak!',
    message:
      "You've completed 7 days in a row of training. Keep the momentum going!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    data: { streakType: 'daily', count: 7, reward: 'badge' },
  },
];

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (
    notificationData: Omit<Notification, 'id' | 'timestamp'>,
  ) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Auto-mark as read after 10 seconds for non-critical notifications
    if (
      !notificationData.actionRequired &&
      notificationData.type !== 'achievement'
    ) {
      setTimeout(() => {
        markAsRead(newNotification.id);
      }, 10000);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Simulate periodic notifications for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      const demoNotifications = [
        {
          type: 'goal' as NotificationType,
          title: 'Goal Progress Update',
          message: "You're making great progress on your weekly running goal!",
          read: false,
          data: { progress: 75, target: '25km' },
        },
        {
          type: 'reminder' as NotificationType,
          title: 'Hydration Reminder',
          message: "Don't forget to stay hydrated during your runs!",
          read: false,
          data: { reminderType: 'hydration' },
        },
        {
          type: 'achievement' as NotificationType,
          title: 'Distance Milestone!',
          message:
            "Congratulations! You've reached 100km total distance this month!",
          read: false,
          data: { milestone: '100km', period: 'month' },
        },
      ];

      const randomNotification =
        demoNotifications[Math.floor(Math.random() * demoNotifications.length)];

      // Only add if we don't have too many unread notifications
      if (unreadCount < 5) {
        addNotification(randomNotification);
      }
    }, 60000); // Add a demo notification every minute

    return () => clearInterval(interval);
  }, [unreadCount]);

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
