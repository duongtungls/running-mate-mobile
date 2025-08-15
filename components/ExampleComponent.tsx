import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Using the new aliases instead of relative imports!
import GradientBackground from '@/components/GradientBackground';
import { COLORS, SPACING, FONT_SIZES } from '@/constants';
import { formatDistance, formatDuration } from '@/utils';
import { MobileUser } from '@/types';

interface Activity {
  name: string;
  distance: number;
  duration: number;
}

interface ExampleComponentProps {
  user: MobileUser;
  activity?: Activity;
}

export default function ExampleComponent({
  user,
  activity,
}: ExampleComponentProps) {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {user.name || 'Runner'}!</Text>

        {activity && (
          <View style={styles.activityCard}>
            <Text style={styles.activityName}>{activity.name}</Text>
            <Text style={styles.activityStats}>
              Distance: {formatDistance(activity.distance)}
            </Text>
            <Text style={styles.activityStats}>
              Duration: {formatDuration(activity.duration)}
            </Text>
          </View>
        )}

        <Text style={styles.subtitle}>
          This component demonstrates clean imports using path aliases!
        </Text>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  activityStats: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
});
