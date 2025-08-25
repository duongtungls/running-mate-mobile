import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  ArrowLeft,
  Bell,
  BellRing,
  Trophy,
  Calendar,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  X,
  Settings,
  Filter,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import GradientBackground from '../components/GradientBackground';
import { useTheme } from '../contexts/ThemeContext';
import {
  useNotifications,
  type NotificationType,
} from '../contexts/NotificationContext';
import { createRgbaColor, opacity } from '../constants/designTokens';

export default function NotificationsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');

  const getNotificationIcon = (type: NotificationType) => {
    const iconProps = { size: 20, color: '#fff' };

    switch (type) {
      case 'achievement':
        return <Trophy {...iconProps} />;
      case 'reminder':
        return <Calendar {...iconProps} />;
      case 'social':
        return <Users {...iconProps} />;
      case 'goal':
        return <Target {...iconProps} />;
      case 'system':
        return <Settings {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'achievement':
        return '#10b981';
      case 'reminder':
        return '#3b82f6';
      case 'social':
        return '#8b5cf6';
      case 'goal':
        return '#f59e0b';
      case 'system':
        return '#6b7280';
      default:
        return theme.primary;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh - in real app this would fetch new notifications
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const filterOptions: { key: NotificationType | 'all'; label: string }[] =
    [
      { key: 'all', label: 'All' },
      { key: 'achievement', label: 'Achievements' },
      { key: 'reminder', label: 'Reminders' },
      { key: 'social', label: 'Social' },
      { key: 'goal', label: 'Goals' },
      { key: 'system', label: 'System' },
    ];

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: createRgbaColor(theme.foreground, opacity[1]),
              },
            ]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.foreground} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: theme.foreground }]}>
                Notifications
              </Text>
              {unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: '#ef4444' }]}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.subtitle,
                { color: createRgbaColor(theme.foreground, opacity[8]) },
              ]}
            >
              Stay updated with your running progress
            </Text>
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity
              style={[
                styles.markAllButton,
                { backgroundColor: createRgbaColor(theme.primary, 0.1) },
              ]}
              onPress={markAllAsRead}
            >
              <CheckCircle size={16} color={theme.primary} />
              <Text style={[styles.markAllText, { color: theme.primary }]}>
                Mark all
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    filter === option.key
                      ? theme.primary
                      : createRgbaColor(theme.foreground, opacity[1]),
                },
              ]}
              onPress={() => setFilter(option.key)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color:
                      filter === option.key
                        ? '#fff'
                        : createRgbaColor(theme.foreground, opacity[8]),
                  },
                ]}
              >
                {option.label}
              </Text>
              {option.key !== 'all' && (
                <View style={styles.filterCount}>
                  <Text
                    style={[
                      styles.filterCountText,
                      {
                        color:
                          filter === option.key
                            ? '#fff'
                            : createRgbaColor(theme.foreground, opacity[6]),
                      },
                    ]}
                  >
                    {notifications.filter((n) => n.type === option.key).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Notifications List */}
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <BellRing
                size={48}
                color={createRgbaColor(theme.foreground, opacity[4])}
              />
              <Text
                style={[
                  styles.emptyStateText,
                  { color: createRgbaColor(theme.foreground, opacity[6]) },
                ]}
              >
                No notifications
              </Text>
              <Text
                style={[
                  styles.emptyStateSubtext,
                  { color: createRgbaColor(theme.foreground, opacity[4]) },
                ]}
              >
                You&apos;re all caught up! Check back later for updates.
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {filteredNotifications.map((notification, index) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    {
                      backgroundColor: notification.read
                        ? createRgbaColor(theme.foreground, opacity[1])
                        : createRgbaColor(theme.foreground, 0.05),
                      borderLeftColor: getNotificationColor(notification.type),
                    },
                  ]}
                  onPress={() =>
                    !notification.read && markAsRead(notification.id)
                  }
                >
                  <View
                    style={[
                      styles.notificationIcon,
                      {
                        backgroundColor: getNotificationColor(
                          notification.type,
                        ),
                      },
                    ]}
                  >
                    {getNotificationIcon(notification.type)}
                  </View>

                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text
                        style={[
                          styles.notificationTitle,
                          {
                            color: theme.foreground,
                            fontWeight: notification.read ? '600' : '700',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {notification.title}
                      </Text>
                      <Text
                        style={[
                          styles.timestamp,
                          {
                            color: createRgbaColor(
                              theme.foreground,
                              opacity[6],
                            ),
                          },
                        ]}
                      >
                        {formatTimestamp(notification.timestamp)}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.notificationMessage,
                        {
                          color: createRgbaColor(theme.foreground, opacity[8]),
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {notification.message}
                    </Text>

                    {notification.actionRequired && (
                      <View style={styles.actionRequired}>
                        <Text
                          style={[styles.actionText, { color: theme.primary }]}
                        >
                          Action required
                        </Text>
                      </View>
                    )}

                    {!notification.read && (
                      <View
                        style={[
                          styles.unreadDot,
                          { backgroundColor: theme.primary },
                        ]}
                      />
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteNotification(notification.id)}
                  >
                    <X
                      size={16}
                      color={createRgbaColor(theme.foreground, opacity[6])}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 4,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  markAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  filterContainer: {
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  filterCount: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 4,
  },
  filterCountText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyStateText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  notificationsList: {
    padding: 20,
    paddingTop: 10,
    gap: 2,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'flex-start',
    gap: 12,
    position: 'relative',
    marginBottom: 8,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  notificationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    flex: 1,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  notificationMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  actionRequired: {
    alignSelf: 'flex-start',
  },
  actionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deleteButton: {
    padding: 4,
  },
});
