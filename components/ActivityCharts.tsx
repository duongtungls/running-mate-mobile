import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Heart,
  TrendingUp,
  Zap,
  Mountain,
  Target,
  Thermometer,
} from 'lucide-react-native';
import { Activity } from '@/types/activity';

interface ActivityChartsProps {
  activity: Activity;
  hasElevation: boolean;
}

const ActivityCharts = memo(
  ({ activity, hasElevation }: ActivityChartsProps) => {
    const renderChart = (
      title: string,
      icon: React.ReactNode,
      value: string,
      unit: string,
      color: string,
      yAxisLabels: string[],
      dataPoints: number[],
    ) => (
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          {icon}
          <Text style={styles.chartTitle}>{title}</Text>
          <View style={styles.chartStats}>
            <Text style={styles.chartStatValue}>{value}</Text>
            <Text style={styles.chartStatUnit}>{unit}</Text>
          </View>
        </View>
        <View style={styles.garminChart}>
          <View style={styles.chartYAxis}>
            {yAxisLabels.map((label, index) => (
              <Text key={index} style={styles.yAxisLabel}>
                {label}
              </Text>
            ))}
          </View>
          <View style={styles.chartArea}>
            <View style={styles.chartGrid}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>
            <View style={styles.chartLineContainer}>
              {dataPoints.map((height, index, array) => (
                <View
                  key={index}
                  style={[
                    styles.chartPoint,
                    {
                      bottom: `${height * 80}%`,
                      left: `${(index / (array.length - 1)) * 100}%`,
                    },
                  ]}
                >
                  <View style={[styles.chartDot, { backgroundColor: color }]} />
                  {index < array.length - 1 && (
                    <View
                      style={[
                        styles.chartSegment,
                        {
                          backgroundColor: color,
                          height: Math.abs(array[index + 1] - height) * 80 + 4,
                          transform: [
                            {
                              rotate:
                                array[index + 1] > height ? '-45deg' : '45deg',
                            },
                          ],
                        },
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );

    return (
      <View style={styles.chartsGrid}>
        {/* Pace Chart */}
        {renderChart(
          'Pace',
          <TrendingUp size={18} color="#10b981" />,
          '4:52',
          '/km',
          '#10b981',
          ['5:20', '5:00', '4:40', '4:20'],
          [
            0.8, 0.6, 0.9, 0.4, 0.7, 0.5, 0.8, 0.3, 0.6, 0.9, 0.7, 0.5, 0.8,
            0.6, 0.9, 0.4, 0.7, 0.8, 0.5, 0.6,
          ],
        )}

        {/* Heart Rate Chart */}
        {activity.average_heartrate &&
          renderChart(
            'Heart Rate',
            <Heart size={18} color="#ef4444" />,
            Math.round(activity.average_heartrate).toString(),
            'bpm',
            '#ef4444',
            [
              Math.round(activity.average_heartrate * 1.2).toString(),
              Math.round(activity.average_heartrate * 1.1).toString(),
              Math.round(activity.average_heartrate).toString(),
              Math.round(activity.average_heartrate * 0.8).toString(),
            ],
            [
              0.6, 0.7, 0.8, 0.9, 0.85, 0.9, 0.95, 0.8, 0.7, 0.6, 0.75, 0.85,
              0.9, 0.8, 0.7, 0.8, 0.9, 0.85, 0.75, 0.6,
            ],
          )}

        {/* Elevation Chart */}
        {hasElevation &&
          renderChart(
            'Elevation',
            <Mountain size={18} color="#8b5cf6" />,
            Math.round(activity.total_elevation_gain!).toString(),
            'm',
            '#8b5cf6',
            [
              Math.round(activity.total_elevation_gain!).toString(),
              Math.round(activity.total_elevation_gain! * 0.7).toString(),
              Math.round(activity.total_elevation_gain! * 0.4).toString(),
              '0',
            ],
            [
              0.2, 0.3, 0.5, 0.7, 0.9, 1.0, 0.8, 0.6, 0.4, 0.3, 0.4, 0.6, 0.8,
              0.9, 0.7, 0.5, 0.3, 0.2, 0.1, 0.0,
            ],
          )}

        {/* Power Chart */}
        {activity.average_watts &&
          renderChart(
            'Power',
            <Zap size={18} color="#f59e0b" />,
            Math.round(activity.average_watts).toString(),
            'W',
            '#f59e0b',
            [
              Math.round(activity.average_watts * 1.3).toString(),
              Math.round(activity.average_watts * 1.1).toString(),
              Math.round(activity.average_watts * 0.9).toString(),
              Math.round(activity.average_watts * 0.7).toString(),
            ],
            [
              0.7, 0.8, 0.6, 0.9, 0.75, 0.85, 0.7, 0.6, 0.8, 0.9, 0.8, 0.7, 0.9,
              0.75, 0.6, 0.8, 0.85, 0.9, 0.7, 0.6,
            ],
          )}

        {/* Cadence Chart */}
        {activity.average_cadence &&
          renderChart(
            'Cadence',
            <Target size={18} color="#06b6d4" />,
            Math.round(activity.average_cadence * 2).toString(),
            'spm',
            '#06b6d4',
            [
              Math.round(activity.average_cadence * 2.2).toString(),
              Math.round(activity.average_cadence * 2.1).toString(),
              Math.round(activity.average_cadence * 2.0).toString(),
              Math.round(activity.average_cadence * 1.8).toString(),
            ],
            [
              0.8, 0.85, 0.9, 0.88, 0.92, 0.87, 0.9, 0.85, 0.88, 0.9, 0.87,
              0.89, 0.91, 0.88, 0.86, 0.9, 0.92, 0.89, 0.87, 0.85,
            ],
          )}

        {/* Temperature Chart */}
        {activity.average_temp &&
          renderChart(
            'Temperature',
            <Thermometer size={18} color="#f97316" />,
            Math.round(activity.average_temp).toString(),
            '°C',
            '#f97316',
            [
              Math.round(activity.average_temp + 5).toString(),
              Math.round(activity.average_temp + 2).toString(),
              Math.round(activity.average_temp).toString(),
              Math.round(activity.average_temp - 3).toString(),
            ],
            [
              0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.85, 0.8, 0.75, 0.7, 0.75,
              0.8, 0.85, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65,
            ],
          )}
      </View>
    );
  },
);

ActivityCharts.displayName = 'ActivityCharts';

const styles = StyleSheet.create({
  chartsGrid: {
    gap: 16,
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#fff',
    flex: 1,
    marginLeft: 8,
  },
  chartStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  chartStatValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#fff',
  },
  chartStatUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  garminChart: {
    height: 140,
    flexDirection: 'row',
  },
  chartYAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingRight: 8,
  },
  yAxisLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
    marginTop: 10,
    marginBottom: 10,
  },
  chartGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingVertical: 0,
  },
  gridLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  chartLineContainer: {
    flex: 1,
    position: 'relative',
  },
  chartPoint: {
    position: 'absolute',
    width: 4,
    alignItems: 'center',
  },
  chartDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  chartSegment: {
    width: 2,
    position: 'absolute',
    bottom: 0,
    opacity: 0.8,
  },
});

export default ActivityCharts;
