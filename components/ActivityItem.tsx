import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  MapPin,
  Clock,
  TrendingUp,
  Heart,
  Mountain,
} from 'lucide-react-native';

interface ActivityData {
  id: string;
  name: string;
  type: string;
  sport_type?: string;
  start_date_local: string;
  distance: number;
  moving_time: number;
  average_speed: number;
  total_elevation_gain?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  calories?: number;
  description?: string;
}

interface ActivityItemProps {
  activity: ActivityData;
  compact?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  compact = false,
}) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const formatPaceOrSpeed = (
    metersPerSecond: number,
    sportType?: string,
  ): string => {
    if (
      sportType?.toLowerCase() === 'ride' ||
      sportType?.toLowerCase() === 'cycling'
    ) {
      // For cycling, show speed in km/h
      const kmPerHour = metersPerSecond * 3.6;
      return `${kmPerHour.toFixed(1)} km/h`;
    } else {
      // For running and other activities, show pace per km
      const minutesPerKm = 1000 / metersPerSecond / 60;
      const minutes = Math.floor(minutesPerKm);
      const seconds = Math.round((minutesPerKm - minutes) * 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    }
  };

  if (compact) {
    return (
      <View style={styles.compactCard}>
        <View style={styles.compactHeader}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {activity.name}
          </Text>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.compactStats}>
          <View style={styles.statItem}>
            <MapPin size={12} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>
              {(activity.distance / 1000).toFixed(1)} km
            </Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={12} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>
              {formatDuration(activity.moving_time)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <TrendingUp size={12} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.statLabel}>Pace</Text>
            <Text style={styles.statValue}>
              {formatPaceOrSpeed(activity.average_speed, activity.sport_type)}
            </Text>
          </View>
        </View>

        <Text style={styles.compactDate}>
          {formatDate(activity.start_date_local)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{activity.name}</Text>
          <Text style={styles.date}>
            {formatDate(activity.start_date_local)}
          </Text>
        </View>
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>

      {/* First row - 3 columns */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <MapPin size={16} color="#60a5fa" />
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>
            {(activity.distance / 1000).toFixed(1)} km
          </Text>
        </View>
        <View style={styles.statItem}>
          <Clock size={16} color="#34d399" />
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>
            {formatDuration(activity.moving_time)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <TrendingUp size={16} color="#a78bfa" />
          <Text style={styles.statLabel}>
            {activity.sport_type?.toLowerCase() === 'ride' ? 'Speed' : 'Pace'}
          </Text>
          <Text style={styles.statValue}>
            {formatPaceOrSpeed(activity.average_speed, activity.sport_type)}
          </Text>
        </View>
      </View>

      {/* Second row - 3 columns */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Mountain size={16} color="#fb923c" />
          <Text style={styles.statLabel}>Elevation</Text>
          <Text style={styles.statValue}>
            {activity.total_elevation_gain?.toFixed(0) || 0}m
          </Text>
        </View>
        {activity.average_heartrate ? (
          <View style={styles.statItem}>
            <Heart size={16} color="#f87171" />
            <Text style={styles.statLabel}>Avg HR</Text>
            <Text style={styles.statValue}>
              {activity.average_heartrate} bpm
            </Text>
          </View>
        ) : (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Max HR</Text>
            <Text style={styles.statValue}>
              {activity.max_heartrate || 'N/A'}
            </Text>
          </View>
        )}
        {activity.calories && activity.calories > 0 ? (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statValue}>{activity.calories}</Text>
          </View>
        ) : (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Type</Text>
            <Text style={styles.statValue}>
              {activity.sport_type || activity.type}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      {activity.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.description} numberOfLines={3}>
            {activity.description}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  compactCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    flex: 1,
  },
  viewButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewButtonText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  compactStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  compactDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  viewDetailsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  viewDetailsButtonText: {
    fontSize: 12,
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  descriptionContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 12,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
});

export default ActivityItem;
