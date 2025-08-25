import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  CheckCircle,
  Play,
  Edit,
  Trash2,
  Target,
  Clock,
  TrendingUp,
  Zap,
  Calendar,
  List,
  MapPin,
  Filter,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import GradientBackground from '../../../components/GradientBackground';
import { useTheme } from '../../../contexts/ThemeContext';
import { createRgbaColor, opacity } from '../../../constants/designTokens';

// Mock workout data (similar to web app)
const mockRuns = [
  {
    id: 1,
    title: 'Morning Easy Run',
    type: 'Easy Run',
    date: '2024-01-15',
    time: '07:00',
    duration: '45 min',
    distance: '6.2 km',
    location: 'Central Park',
    completed: true,
    pace: '7:15 /km',
    calories: 420,
    heartRate: 145,
    elevation: 45,
    notes: 'Felt great today! Perfect weather for running.',
    color: '#10b981',
  },
  {
    id: 2,
    title: 'Interval Training',
    type: 'Intervals',
    date: '2024-01-16',
    time: '18:30',
    duration: '35 min',
    distance: '5.0 km',
    location: 'Track Field',
    completed: false,
    color: '#ef4444',
  },
  {
    id: 3,
    title: 'Long Run',
    type: 'Long Run',
    date: '2024-01-17',
    time: '08:00',
    duration: '90 min',
    distance: '15.0 km',
    location: 'Riverside Trail',
    completed: false,
    color: '#3b82f6',
  },
  {
    id: 4,
    title: 'Recovery Jog',
    type: 'Recovery',
    date: '2024-01-18',
    time: '07:30',
    duration: '30 min',
    distance: '4.0 km',
    location: 'Neighborhood',
    completed: true,
    pace: '8:30 /km',
    calories: 280,
    heartRate: 125,
    elevation: 20,
    notes: 'Easy recovery run, legs felt good.',
    color: '#8b5cf6',
  },
  {
    id: 5,
    title: 'Tempo Run',
    type: 'Tempo',
    date: '2024-01-19',
    time: '17:00',
    duration: '50 min',
    distance: '8.0 km',
    location: 'City Loop',
    completed: false,
    color: '#f97316',
  },
  {
    id: 6,
    title: 'Hill Repeats',
    type: 'Hill Training',
    date: '2024-01-20',
    time: '09:00',
    duration: '40 min',
    distance: '5.5 km',
    location: 'Hill Park',
    completed: false,
    color: '#eab308',
  },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function ScheduleScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = [];

  // Previous month's trailing days
  const prevMonth = new Date(currentYear, currentMonth - 1, 0);
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      date: prevMonth.getDate() - i,
      isCurrentMonth: false,
      fullDate: new Date(
        currentYear,
        currentMonth - 1,
        prevMonth.getDate() - i,
      ),
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      date: day,
      isCurrentMonth: true,
      fullDate: new Date(currentYear, currentMonth, day),
    });
  }

  // Next month's leading days
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      date: day,
      isCurrentMonth: false,
      fullDate: new Date(currentYear, currentMonth + 1, day),
    });
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getRunsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return mockRuns.filter((run) => run.date === dateString);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getFilteredRuns = () => {
    return mockRuns
      .filter(
        (run) =>
          run.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          run.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          run.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

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
            <Text style={[styles.title, { color: theme.foreground }]}>
              Training Schedule
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: createRgbaColor(theme.foreground, opacity[8]) },
              ]}
            >
              Plan and track your running workouts
            </Text>
          </View>

          <View style={styles.headerActions}>
            <View style={styles.viewToggle}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor:
                      viewMode === 'calendar'
                        ? theme.primary
                        : createRgbaColor(theme.foreground, opacity[1]),
                  },
                ]}
                onPress={() => setViewMode('calendar')}
              >
                <Calendar
                  size={16}
                  color={viewMode === 'calendar' ? '#fff' : theme.foreground}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor:
                      viewMode === 'list'
                        ? theme.primary
                        : createRgbaColor(theme.foreground, opacity[1]),
                  },
                ]}
                onPress={() => setViewMode('list')}
              >
                <List
                  size={16}
                  color={viewMode === 'list' ? '#fff' : theme.foreground}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search Bar (always visible) */}
          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor: createRgbaColor(theme.foreground, opacity[1]),
              },
            ]}
          >
            <Search
              size={20}
              color={createRgbaColor(theme.foreground, opacity[6])}
            />
            <TouchableOpacity
              style={styles.searchInput}
              onPress={() => {
                /* Implement search input modal */
              }}
            >
              <Text
                style={[
                  styles.searchPlaceholder,
                  { color: createRgbaColor(theme.foreground, opacity[6]) },
                ]}
              >
                {searchTerm || 'Search workouts...'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                {
                  backgroundColor: createRgbaColor(
                    theme.foreground,
                    opacity[1],
                  ),
                },
              ]}
            >
              <Filter size={18} color={theme.foreground} />
            </TouchableOpacity>
          </View>

          {viewMode === 'calendar' ? (
            <>
              {/* Calendar Header */}
              <View
                style={[
                  styles.calendarCard,
                  {
                    backgroundColor: createRgbaColor(
                      theme.foreground,
                      opacity[1],
                    ),
                  },
                ]}
              >
                <View style={styles.calendarHeader}>
                  <Text
                    style={[styles.monthTitle, { color: theme.foreground }]}
                  >
                    {months[currentMonth]} {currentYear}
                  </Text>
                  <View style={styles.navigationButtons}>
                    <TouchableOpacity
                      style={[
                        styles.navButton,
                        {
                          backgroundColor: createRgbaColor(
                            theme.foreground,
                            opacity[1],
                          ),
                        },
                      ]}
                      onPress={() => navigateMonth('prev')}
                    >
                      <ChevronLeft size={20} color={theme.foreground} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.navButton,
                        { backgroundColor: theme.primary },
                      ]}
                      onPress={() => setCurrentDate(new Date())}
                    >
                      <Text style={styles.todayText}>Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.navButton,
                        {
                          backgroundColor: createRgbaColor(
                            theme.foreground,
                            opacity[1],
                          ),
                        },
                      ]}
                      onPress={() => navigateMonth('next')}
                    >
                      <ChevronRight size={20} color={theme.foreground} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Calendar Grid */}
                <View style={styles.calendarGrid}>
                  {/* Day headers */}
                  {daysOfWeek.map((day) => (
                    <View key={day} style={styles.dayHeader}>
                      <Text
                        style={[
                          styles.dayHeaderText,
                          {
                            color: createRgbaColor(
                              theme.foreground,
                              opacity[6],
                            ),
                          },
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  ))}

                  {/* Calendar days */}
                  {calendarDays.map((day, index) => {
                    const runs = getRunsForDate(day.fullDate);
                    const isCurrentDay = isToday(day.fullDate);

                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.calendarDay,
                          {
                            borderColor: createRgbaColor(
                              theme.foreground,
                              opacity[1],
                            ),
                          },
                          !day.isCurrentMonth && {
                            backgroundColor: createRgbaColor(
                              theme.foreground,
                              0.02,
                            ),
                          },
                          isCurrentDay && {
                            backgroundColor: createRgbaColor(
                              theme.primary,
                              0.1,
                            ),
                            borderColor: theme.primary,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayNumber,
                            {
                              color: day.isCurrentMonth
                                ? theme.foreground
                                : createRgbaColor(theme.foreground, opacity[4]),
                            },
                            isCurrentDay && {
                              color: theme.primary,
                              fontWeight: 'bold',
                            },
                          ]}
                        >
                          {day.date}
                        </Text>

                        <View style={styles.runsContainer}>
                          {runs.slice(0, 3).map((run) => (
                            <TouchableOpacity
                              key={run.id}
                              style={[
                                styles.runDot,
                                { backgroundColor: run.color },
                                run.completed && styles.completedRun,
                              ]}
                              onPress={() => setSelectedRun(run)}
                            >
                              {run.completed && (
                                <CheckCircle size={8} color="#fff" />
                              )}
                            </TouchableOpacity>
                          ))}
                          {runs.length > 3 && (
                            <Text
                              style={[
                                styles.moreRuns,
                                {
                                  color: createRgbaColor(
                                    theme.foreground,
                                    opacity[6],
                                  ),
                                },
                              ]}
                            >
                              +{runs.length - 3}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Legend */}
              <View
                style={[
                  styles.legendCard,
                  {
                    backgroundColor: createRgbaColor(
                      theme.foreground,
                      opacity[1],
                    ),
                  },
                ]}
              >
                <Text style={[styles.legendTitle, { color: theme.foreground }]}>
                  Run Types
                </Text>
                <View style={styles.legendGrid}>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: '#10b981' }]}
                    />
                    <Text
                      style={[
                        styles.legendText,
                        {
                          color: createRgbaColor(theme.foreground, opacity[8]),
                        },
                      ]}
                    >
                      Easy Run
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: '#ef4444' }]}
                    />
                    <Text
                      style={[
                        styles.legendText,
                        {
                          color: createRgbaColor(theme.foreground, opacity[8]),
                        },
                      ]}
                    >
                      Intervals
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: '#3b82f6' }]}
                    />
                    <Text
                      style={[
                        styles.legendText,
                        {
                          color: createRgbaColor(theme.foreground, opacity[8]),
                        },
                      ]}
                    >
                      Long Run
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: '#8b5cf6' }]}
                    />
                    <Text
                      style={[
                        styles.legendText,
                        {
                          color: createRgbaColor(theme.foreground, opacity[8]),
                        },
                      ]}
                    >
                      Recovery
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: '#f97316' }]}
                    />
                    <Text
                      style={[
                        styles.legendText,
                        {
                          color: createRgbaColor(theme.foreground, opacity[8]),
                        },
                      ]}
                    >
                      Tempo
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: '#eab308' }]}
                    />
                    <Text
                      style={[
                        styles.legendText,
                        {
                          color: createRgbaColor(theme.foreground, opacity[8]),
                        },
                      ]}
                    >
                      Hills
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            /* List View */
            <View style={styles.listContainer}>
              {getFilteredRuns().map((run, index) => (
                <TouchableOpacity
                  key={run.id}
                  style={[
                    styles.workoutCard,
                    {
                      backgroundColor: createRgbaColor(
                        theme.foreground,
                        opacity[1],
                      ),
                    },
                  ]}
                  onPress={() => setSelectedRun(run)}
                >
                  <View
                    style={[
                      styles.workoutStatusIndicator,
                      { backgroundColor: run.color },
                    ]}
                  />

                  <View style={styles.workoutCardContent}>
                    <View style={styles.workoutHeader}>
                      <View style={styles.workoutMainInfo}>
                        <Text
                          style={[
                            styles.workoutTitle,
                            { color: theme.foreground },
                          ]}
                        >
                          {run.title}
                        </Text>
                        <View style={styles.workoutBadges}>
                          <View
                            style={[
                              styles.typeBadgeSmall,
                              { backgroundColor: run.color },
                            ]}
                          >
                            <Text style={styles.typeBadgeSmallText}>
                              {run.type}
                            </Text>
                          </View>
                          {run.completed && (
                            <View
                              style={[
                                styles.statusBadgeSmall,
                                {
                                  backgroundColor: createRgbaColor(
                                    '#10b981',
                                    0.2,
                                  ),
                                },
                              ]}
                            >
                              <CheckCircle size={10} color="#10b981" />
                              <Text
                                style={[
                                  styles.statusBadgeSmallText,
                                  { color: '#10b981' },
                                ]}
                              >
                                Done
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <View style={styles.workoutActions}>
                        {!run.completed ? (
                          <TouchableOpacity
                            style={[
                              styles.startButton,
                              { backgroundColor: run.color },
                            ]}
                            onPress={() => {
                              /* Start workout */
                            }}
                          >
                            <Play size={12} color="#fff" />
                          </TouchableOpacity>
                        ) : (
                          <View
                            style={[
                              styles.completedIndicator,
                              { backgroundColor: '#10b981' },
                            ]}
                          >
                            <CheckCircle size={12} color="#fff" />
                          </View>
                        )}
                      </View>
                    </View>

                    <View style={styles.workoutDetails}>
                      <View style={styles.workoutMeta}>
                        <View style={styles.metaItem}>
                          <Calendar
                            size={12}
                            color={createRgbaColor(
                              theme.foreground,
                              opacity[6],
                            )}
                          />
                          <Text
                            style={[
                              styles.metaText,
                              {
                                color: createRgbaColor(
                                  theme.foreground,
                                  opacity[6],
                                ),
                              },
                            ]}
                          >
                            {formatDate(run.date)} at {run.time}
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <MapPin
                            size={12}
                            color={createRgbaColor(
                              theme.foreground,
                              opacity[6],
                            )}
                          />
                          <Text
                            style={[
                              styles.metaText,
                              {
                                color: createRgbaColor(
                                  theme.foreground,
                                  opacity[6],
                                ),
                              },
                            ]}
                          >
                            {run.location}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.workoutStats}>
                        <View style={styles.statItem}>
                          <Target
                            size={14}
                            color={createRgbaColor(
                              theme.foreground,
                              opacity[8],
                            )}
                          />
                          <Text
                            style={[
                              styles.statText,
                              {
                                color: createRgbaColor(
                                  theme.foreground,
                                  opacity[8],
                                ),
                              },
                            ]}
                          >
                            {run.distance}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Clock
                            size={14}
                            color={createRgbaColor(
                              theme.foreground,
                              opacity[8],
                            )}
                          />
                          <Text
                            style={[
                              styles.statText,
                              {
                                color: createRgbaColor(
                                  theme.foreground,
                                  opacity[8],
                                ),
                              },
                            ]}
                          >
                            {run.duration}
                          </Text>
                        </View>
                        {run.completed && run.pace && (
                          <View style={styles.statItem}>
                            <TrendingUp
                              size={14}
                              color={createRgbaColor(
                                theme.foreground,
                                opacity[8],
                              )}
                            />
                            <Text
                              style={[
                                styles.statText,
                                {
                                  color: createRgbaColor(
                                    theme.foreground,
                                    opacity[8],
                                  ),
                                },
                              ]}
                            >
                              {run.pace}
                            </Text>
                          </View>
                        )}
                        {run.completed && run.calories && (
                          <View style={styles.statItem}>
                            <Zap
                              size={14}
                              color={createRgbaColor(
                                theme.foreground,
                                opacity[8],
                              )}
                            />
                            <Text
                              style={[
                                styles.statText,
                                {
                                  color: createRgbaColor(
                                    theme.foreground,
                                    opacity[8],
                                  ),
                                },
                              ]}
                            >
                              {run.calories} cal
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {getFilteredRuns().length === 0 && (
                <View style={styles.emptyState}>
                  <Calendar
                    size={48}
                    color={createRgbaColor(theme.foreground, opacity[4])}
                  />
                  <Text
                    style={[
                      styles.emptyStateText,
                      { color: createRgbaColor(theme.foreground, opacity[6]) },
                    ]}
                  >
                    No workouts found
                  </Text>
                  <Text
                    style={[
                      styles.emptyStateSubtext,
                      { color: createRgbaColor(theme.foreground, opacity[4]) },
                    ]}
                  >
                    Try adjusting your search or add a new workout
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.primary }]}
          onPress={() => {
            /* Add workout functionality */
          }}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>

        {/* Run Details Modal */}
        <Modal
          visible={!!selectedRun}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedRun(null)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContent, { backgroundColor: theme.card }]}
            >
              {selectedRun && (
                <>
                  <View style={styles.modalHeader}>
                    <Text
                      style={[
                        styles.modalTitle,
                        { color: theme.cardForeground },
                      ]}
                    >
                      {selectedRun.title}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.closeButton,
                        {
                          backgroundColor: createRgbaColor(
                            theme.foreground,
                            opacity[1],
                          ),
                        },
                      ]}
                      onPress={() => setSelectedRun(null)}
                    >
                      <Text
                        style={[
                          styles.closeButtonText,
                          { color: theme.foreground },
                        ]}
                      >
                        ×
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalBody}>
                    <View style={styles.runBadges}>
                      <View
                        style={[
                          styles.typeBadge,
                          { backgroundColor: selectedRun.color },
                        ]}
                      >
                        <Text style={styles.typeBadgeText}>
                          {selectedRun.type}
                        </Text>
                      </View>
                      {selectedRun.completed && (
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: createRgbaColor('#10b981', 0.2),
                            },
                          ]}
                        >
                          <CheckCircle size={12} color="#10b981" />
                          <Text
                            style={[
                              styles.statusBadgeText,
                              { color: '#10b981' },
                            ]}
                          >
                            Completed
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.runDetails}>
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <Text
                            style={[
                              styles.detailLabel,
                              {
                                color: createRgbaColor(
                                  theme.cardForeground,
                                  opacity[6],
                                ),
                              },
                            ]}
                          >
                            Date & Time
                          </Text>
                          <Text
                            style={[
                              styles.detailValue,
                              { color: theme.cardForeground },
                            ]}
                          >
                            {selectedRun.date} at {selectedRun.time}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text
                            style={[
                              styles.detailLabel,
                              {
                                color: createRgbaColor(
                                  theme.cardForeground,
                                  opacity[6],
                                ),
                              },
                            ]}
                          >
                            Duration
                          </Text>
                          <Text
                            style={[
                              styles.detailValue,
                              { color: theme.cardForeground },
                            ]}
                          >
                            {selectedRun.duration}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <Text
                            style={[
                              styles.detailLabel,
                              {
                                color: createRgbaColor(
                                  theme.cardForeground,
                                  opacity[6],
                                ),
                              },
                            ]}
                          >
                            Distance
                          </Text>
                          <Text
                            style={[
                              styles.detailValue,
                              { color: theme.cardForeground },
                            ]}
                          >
                            {selectedRun.distance}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text
                            style={[
                              styles.detailLabel,
                              {
                                color: createRgbaColor(
                                  theme.cardForeground,
                                  opacity[6],
                                ),
                              },
                            ]}
                          >
                            Location
                          </Text>
                          <Text
                            style={[
                              styles.detailValue,
                              { color: theme.cardForeground },
                            ]}
                          >
                            {selectedRun.location}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {selectedRun.completed && (
                      <View
                        style={[
                          styles.trackingSection,
                          {
                            borderTopColor: createRgbaColor(
                              theme.cardForeground,
                              opacity[1],
                            ),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.trackingTitle,
                            { color: theme.cardForeground },
                          ]}
                        >
                          Track Log
                        </Text>
                        <View style={styles.trackingGrid}>
                          <View style={styles.trackingItem}>
                            <Text
                              style={[
                                styles.detailLabel,
                                {
                                  color: createRgbaColor(
                                    theme.cardForeground,
                                    opacity[6],
                                  ),
                                },
                              ]}
                            >
                              Pace
                            </Text>
                            <Text
                              style={[
                                styles.detailValue,
                                { color: theme.cardForeground },
                              ]}
                            >
                              {selectedRun.pace}
                            </Text>
                          </View>
                          <View style={styles.trackingItem}>
                            <Text
                              style={[
                                styles.detailLabel,
                                {
                                  color: createRgbaColor(
                                    theme.cardForeground,
                                    opacity[6],
                                  ),
                                },
                              ]}
                            >
                              Calories
                            </Text>
                            <Text
                              style={[
                                styles.detailValue,
                                { color: theme.cardForeground },
                              ]}
                            >
                              {selectedRun.calories}
                            </Text>
                          </View>
                          <View style={styles.trackingItem}>
                            <Text
                              style={[
                                styles.detailLabel,
                                {
                                  color: createRgbaColor(
                                    theme.cardForeground,
                                    opacity[6],
                                  ),
                                },
                              ]}
                            >
                              Heart Rate
                            </Text>
                            <Text
                              style={[
                                styles.detailValue,
                                { color: theme.cardForeground },
                              ]}
                            >
                              {selectedRun.heartRate} bpm
                            </Text>
                          </View>
                          <View style={styles.trackingItem}>
                            <Text
                              style={[
                                styles.detailLabel,
                                {
                                  color: createRgbaColor(
                                    theme.cardForeground,
                                    opacity[6],
                                  ),
                                },
                              ]}
                            >
                              Elevation
                            </Text>
                            <Text
                              style={[
                                styles.detailValue,
                                { color: theme.cardForeground },
                              ]}
                            >
                              {selectedRun.elevation}m
                            </Text>
                          </View>
                        </View>
                        {selectedRun.notes && (
                          <View style={styles.notesSection}>
                            <Text
                              style={[
                                styles.detailLabel,
                                {
                                  color: createRgbaColor(
                                    theme.cardForeground,
                                    opacity[6],
                                  ),
                                },
                              ]}
                            >
                              Notes
                            </Text>
                            <Text
                              style={[
                                styles.notesText,
                                {
                                  color: theme.cardForeground,
                                  backgroundColor: createRgbaColor(
                                    theme.cardForeground,
                                    opacity[1],
                                  ),
                                },
                              ]}
                            >
                              {selectedRun.notes}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    <View style={styles.modalActions}>
                      {!selectedRun.completed ? (
                        <TouchableOpacity
                          style={[
                            styles.primaryButton,
                            { backgroundColor: '#10b981' },
                          ]}
                        >
                          <Play size={16} color="#fff" />
                          <Text style={styles.primaryButtonText}>
                            Start Run
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[
                            styles.secondaryButton,
                            {
                              borderColor: createRgbaColor(
                                theme.cardForeground,
                                opacity[2],
                              ),
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.secondaryButtonText,
                              { color: theme.cardForeground },
                            ]}
                          >
                            View Full Track Log
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          {
                            backgroundColor: createRgbaColor(
                              theme.cardForeground,
                              opacity[1],
                            ),
                          },
                        ]}
                      >
                        <Edit size={16} color={theme.cardForeground} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: createRgbaColor('#ef4444', 0.1) },
                        ]}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
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
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  calendarCard: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#fff',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayHeader: {
    width: '14.285%',
    paddingVertical: 8,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  calendarDay: {
    width: '14.285%',
    minHeight: 80,
    padding: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dayNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  runsContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  runDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedRun: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  moreRuns: {
    fontFamily: 'Inter-Regular',
    fontSize: 8,
  },
  legendCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    maxWidth: 400,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  closeButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  modalBody: {
    flex: 1,
  },
  runBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  runDetails: {
    gap: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  trackingSection: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginBottom: 16,
  },
  trackingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  trackingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  trackingItem: {
    width: '45%',
  },
  notesSection: {
    marginTop: 12,
  },
  notesText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    alignItems: 'center',
    gap: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  searchInput: {
    flex: 1,
  },
  searchPlaceholder: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
    gap: 12,
  },
  workoutCard: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  workoutStatusIndicator: {
    width: 4,
  },
  workoutCardContent: {
    flex: 1,
    padding: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutMainInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 6,
  },
  workoutBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  typeBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeSmallText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: '#fff',
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statusBadgeSmallText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
  },
  workoutActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutDetails: {
    gap: 12,
  },
  workoutMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  workoutStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});
