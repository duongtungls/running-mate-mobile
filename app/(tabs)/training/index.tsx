import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Brain,
  Plus,
  Star,
  Users,
  Award,
  BookOpen,
  Search,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import GradientBackground from '../../../components/GradientBackground';
import { useTraining } from '../../../contexts/TrainingContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { createRgbaColor, opacity } from '../../../constants/designTokens';

export default function TrainingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { trainingPlans, currentPlan, loading, error, refreshPlans } =
    useTraining();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('my-plans');
  const { theme } = useTheme();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshPlans();
    setRefreshing(false);
  }, [refreshPlans]);

  // Mock data for featured programs (will be replaced with API data)
  const featuredPrograms = [
    {
      id: '1',
      title: 'Beginner 5K Training',
      description:
        'Perfect for first-time runners looking to complete their first 5K race',
      duration: '8 weeks',
      difficulty: 'Beginner',
      author: 'Sarah Johnson',
      authorAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      rating: 4.8,
      participants: 1247,
      progress: 0,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      tags: ['5K', 'Beginner', 'Endurance'],
      enrolled: false,
    },
    {
      id: '2',
      title: 'Marathon Training Pro',
      description:
        'Advanced 16-week marathon training program for experienced runners',
      duration: '16 weeks',
      difficulty: 'Advanced',
      author: 'Mike Chen',
      authorAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      rating: 4.9,
      participants: 892,
      progress: 25,
      image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643',
      tags: ['Marathon', 'Advanced', 'Endurance'],
      enrolled: true,
    },
    {
      id: '3',
      title: 'Speed Development',
      description:
        'Improve your running speed with interval training and tempo runs',
      duration: '6 weeks',
      difficulty: 'Intermediate',
      author: 'Emma Davis',
      authorAvatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      rating: 4.7,
      participants: 634,
      progress: 100,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256',
      tags: ['Speed', 'Intervals', 'Intermediate'],
      enrolled: true,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#10b981';
      case 'Intermediate':
        return '#f59e0b';
      case 'Advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const filteredPrograms =
    activeTab === 'my-plans'
      ? featuredPrograms.filter((p) => p.enrolled)
      : featuredPrograms;

  const getCurrentWeekWorkouts = () => {
    if (!currentPlan?.workouts) return [];

    const currentWeek =
      Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % currentPlan.duration;
    return currentPlan.workouts.filter((w) => w.week_number === currentWeek);
  };

  const getWorkoutStatus = (dayOfWeek: number) => {
    const today = new Date().getDay();
    if (dayOfWeek < today) return 'completed';
    if (dayOfWeek === today) return 'current';
    return 'pending';
  };

  const renderTabContent = () => {
    if (activeTab === 'schedule') {
      return (
        <View style={styles.scheduleContainer}>
          <TouchableOpacity
            style={[
              styles.scheduleCard,
              {
                backgroundColor: createRgbaColor(theme.foreground, opacity[1]),
              },
            ]}
            onPress={() => router.push('/training/schedule')}
          >
            <Calendar size={48} color={theme.primary} />
            <Text style={[styles.scheduleTitle, { color: theme.foreground }]}>
              Training Schedule
            </Text>
            <Text
              style={[
                styles.scheduleSubtitle,
                { color: createRgbaColor(theme.foreground, opacity[8]) },
              ]}
            >
              View and manage your workout calendar
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        {/* Current Program Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
              {activeTab === 'my-plans' ? 'My Programs' : 'Featured Programs'}
            </Text>
            <TouchableOpacity
              style={[
                styles.generateButton,
                { backgroundColor: theme.primary },
              ]}
              onPress={() => router.push('/training/generate-plan')}
            >
              <Brain size={16} color="#fff" />
              <Text style={styles.generateButtonText}>AI Plan</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'my-plans' && currentPlan && (
            <TouchableOpacity
              style={[
                styles.programCard,
                {
                  backgroundColor: createRgbaColor(
                    theme.foreground,
                    opacity[1],
                  ),
                },
              ]}
              onPress={() => router.push('/training/program')}
            >
              <View style={styles.programHeader}>
                <Text
                  style={[styles.programTitle, { color: theme.foreground }]}
                >
                  {currentPlan.name}
                </Text>
                <Text
                  style={[
                    styles.programWeek,
                    { color: createRgbaColor(theme.foreground, opacity[8]) },
                  ]}
                >
                  Week 1 of {currentPlan.duration}
                </Text>
              </View>
              <View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: createRgbaColor(
                      theme.foreground,
                      opacity[1],
                    ),
                  },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: theme.primary, width: '12.5%' },
                  ]}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Program Cards */}
        <FlatList
          data={filteredPrograms}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.featuredCard,
                {
                  backgroundColor: createRgbaColor(
                    theme.foreground,
                    opacity[1],
                  ),
                },
              ]}
              onPress={() => router.push('/training/program')}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.featuredImage}
              />
              <View style={styles.featuredContent}>
                <View style={styles.featuredHeader}>
                  <View style={styles.featuredTitleContainer}>
                    <Text
                      style={[
                        styles.featuredTitle,
                        { color: theme.foreground },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <View
                      style={[
                        styles.difficultyBadge,
                        {
                          backgroundColor: createRgbaColor(
                            getDifficultyColor(item.difficulty),
                            0.2,
                          ),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.difficultyText,
                          { color: getDifficultyColor(item.difficulty) },
                        ]}
                      >
                        {item.difficulty}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    <Text
                      style={[
                        styles.ratingText,
                        {
                          color: createRgbaColor(theme.foreground, opacity[8]),
                        },
                      ]}
                    >
                      {item.rating}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.featuredDescription,
                    { color: createRgbaColor(theme.foreground, opacity[8]) },
                  ]}
                >
                  {item.description}
                </Text>

                <View style={styles.featuredStats}>
                  <View style={styles.statItem}>
                    <Clock
                      size={14}
                      color={createRgbaColor(theme.foreground, opacity[6])}
                    />
                    <Text
                      style={[
                        styles.statText,
                        {
                          color: createRgbaColor(theme.foreground, opacity[8]),
                        },
                      ]}
                    >
                      {item.duration}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Users
                      size={14}
                      color={createRgbaColor(theme.foreground, opacity[6])}
                    />
                    <Text
                      style={[
                        styles.statText,
                        {
                          color: createRgbaColor(theme.foreground, opacity[8]),
                        },
                      ]}
                    >
                      {item.participants}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Award
                      size={14}
                      color={createRgbaColor(theme.foreground, opacity[6])}
                    />
                    <Text
                      style={[
                        styles.statText,
                        {
                          color: createRgbaColor(theme.foreground, opacity[8]),
                        },
                      ]}
                    >
                      by {item.author}
                    </Text>
                  </View>
                </View>

                {item.progress > 0 && (
                  <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <Text
                        style={[
                          styles.progressLabel,
                          {
                            color: createRgbaColor(
                              theme.foreground,
                              opacity[8],
                            ),
                          },
                        ]}
                      >
                        Progress
                      </Text>
                      <Text
                        style={[
                          styles.progressPercent,
                          { color: theme.foreground },
                        ]}
                      >
                        {item.progress}%
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          backgroundColor: createRgbaColor(
                            theme.foreground,
                            opacity[2],
                          ),
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressFill,
                          {
                            backgroundColor: theme.primary,
                            width: `${item.progress}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.tagsContainer}>
                  {item.tags.map((tag, index) => (
                    <View
                      key={index}
                      style={[
                        styles.tag,
                        {
                          backgroundColor: createRgbaColor(theme.primary, 0.1),
                        },
                      ]}
                    >
                      <Text style={[styles.tagText, { color: theme.primary }]}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.programsList}
        />
      </>
    );
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.foreground }]}>
            Training Plans
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: createRgbaColor(theme.foreground, opacity[8]) },
            ]}
          >
            Personalized by AI for your goals
          </Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {['my-plans', 'discover', 'schedule'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                {
                  backgroundColor: createRgbaColor(
                    theme.foreground,
                    opacity[1],
                  ),
                },
                activeTab === tab && { backgroundColor: theme.primary },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              {tab === 'my-plans' && (
                <BookOpen
                  size={16}
                  color={
                    activeTab === tab
                      ? '#fff'
                      : createRgbaColor(theme.foreground, opacity[8])
                  }
                />
              )}
              {tab === 'discover' && (
                <Search
                  size={16}
                  color={
                    activeTab === tab
                      ? '#fff'
                      : createRgbaColor(theme.foreground, opacity[8])
                  }
                />
              )}
              {tab === 'schedule' && (
                <Calendar
                  size={16}
                  color={
                    activeTab === tab
                      ? '#fff'
                      : createRgbaColor(theme.foreground, opacity[8])
                  }
                />
              )}
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab
                        ? '#fff'
                        : createRgbaColor(theme.foreground, opacity[8]),
                  },
                ]}
              >
                {tab === 'my-plans'
                  ? 'My Plans'
                  : tab === 'discover'
                    ? 'Discover'
                    : 'Schedule'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {renderTabContent()}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/training/generate-plan')}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  tabText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
  },
  generateButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  generateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#fff',
  },
  programCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  programTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  programWeek: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  programsList: {
    padding: 20,
    paddingTop: 0,
  },
  featuredCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featuredImage: {
    width: '100%',
    height: 160,
  },
  featuredContent: {
    padding: 16,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featuredTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  featuredTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  featuredDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  featuredStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  progressPercent: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
  scheduleContainer: {
    padding: 20,
  },
  scheduleCard: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  scheduleTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  scheduleSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
