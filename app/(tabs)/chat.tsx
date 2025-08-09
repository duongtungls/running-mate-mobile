import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send } from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';
import ActivityItem from '../../components/ActivityItem';

type Message = {
  id: string;
  text: string;
  isAI: boolean;
  showActivity?: boolean;
  activityData?: any;
};

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI running assistant. How can I help you with your training today?",
      isAI: true,
    },
    {
      id: '2',
      text: 'I just finished my morning run. Can you analyze my performance?',
      isAI: false,
    },
    {
      id: '3',
      text: "Great! I can see your latest run from Strava. Here's your tracklog analysis:\n\n🏃‍♂️ Distance: 5.2km\n⏱️ Duration: 28:15\n📈 Average Pace: 5:26/km\n💓 Average HR: 145 bpm\n🔥 Calories: 320\n\nYour pace was consistent throughout, and your heart rate stayed in the aerobic zone. This was a solid training run!",
      isAI: true,
      showActivity: true,
      activityData: {
        id: '12345',
        name: 'Morning Run - Central Park',
        type: 'Run',
        sport_type: 'Run',
        start_date_local: '2024-01-15T07:30:00Z',
        distance: 5200,
        moving_time: 1695,
        average_speed: 3.07,
        total_elevation_gain: 45,
        average_heartrate: 145,
        max_heartrate: 165,
        calories: 320,
        description:
          'Great morning run around Central Park. Felt strong and maintained consistent pace throughout.',
      },
    },
    {
      id: '4',
      text: 'Thanks! Can you show me my current training plan?',
      isAI: false,
    },
    {
      id: '5',
      text: "Here's your current 12-week marathon training plan:\n\n📅 Week 6/12\n\nMonday: Rest day\nTuesday: 8km tempo run\nWednesday: 5km easy run\nThursday: Cross-training (cycling)\nFriday: 10km long run\nSaturday: 5km recovery run\nSunday: Rest day\n\nYou're on track! Your long run this week should focus on building endurance.",
      isAI: true,
    },
    {
      id: '6',
      text: 'I want to generate a new training plan for a 10K race in 8 weeks',
      isAI: false,
    },
    {
      id: '7',
      text: "Perfect! I can help you create a personalized 10K training plan. Based on your recent runs, I suggest:\n\n🎯 Goal: 10K in 8 weeks\n📊 Current fitness: Intermediate\n🏃‍♂️ Weekly mileage: 25-35km\n\nWould you like me to generate a plan that includes:\n• 3-4 runs per week\n• Speed work sessions\n• Progressive long runs\n• Recovery periods\n\nJust say 'Generate 10K plan' and I'll create it for you!",
      isAI: true,
    },
    {
      id: '8',
      text: 'Can you show me my recent tracklog data?',
      isAI: false,
    },
    {
      id: '9',
      text: "Here are your recent activities from Strava:\n\nI can see you've been consistent with your training. Here are your last 3 runs:",
      isAI: true,
      showActivity: true,
      activityData: [
        {
          id: '12345',
          name: 'Morning Run - Central Park',
          type: 'Run',
          sport_type: 'Run',
          start_date_local: '2024-01-15T07:30:00Z',
          distance: 5200,
          moving_time: 1695,
          average_speed: 3.07,
          total_elevation_gain: 45,
          average_heartrate: 145,
          max_heartrate: 165,
          calories: 320,
          description:
            'Great morning run around Central Park. Felt strong and maintained consistent pace throughout.',
        },
        {
          id: '12346',
          name: 'Tempo Run - Riverside',
          type: 'Run',
          sport_type: 'Run',
          start_date_local: '2024-01-13T18:00:00Z',
          distance: 8000,
          moving_time: 2400,
          average_speed: 3.33,
          total_elevation_gain: 12,
          average_heartrate: 158,
          max_heartrate: 175,
          calories: 480,
          description:
            'Tempo run with 3x1km intervals. Hit target paces consistently.',
        },
        {
          id: '12347',
          name: 'Easy Recovery Run',
          type: 'Run',
          sport_type: 'Run',
          start_date_local: '2024-01-12T06:45:00Z',
          distance: 3000,
          moving_time: 1200,
          average_speed: 2.5,
          total_elevation_gain: 8,
          average_heartrate: 130,
          max_heartrate: 145,
          calories: 180,
          description:
            "Easy recovery run to shake out the legs after yesterday's long run.",
        },
      ],
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isAI: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    // Simulate AI response based on message content
    setTimeout(() => {
      let aiResponse: Message;

      if (
        message.toLowerCase().includes('generate') &&
        message.toLowerCase().includes('plan')
      ) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          text: '🎯 Your 10K Training Plan (8 weeks)\n\nWeek 1-2: Base Building\n• Mon: Rest\n• Tue: 5km easy\n• Thu: 6km with 3x800m intervals\n• Sat: 8km long run\n\nWeek 3-4: Build Volume\n• Mon: Rest\n• Tue: 6km tempo\n• Thu: 7km with 4x1km intervals\n• Sat: 10km long run\n\nWeek 5-6: Speed Focus\n• Mon: Rest\n• Tue: 8km with 5x1km intervals\n• Thu: 6km tempo\n• Sat: 12km long run\n\nWeek 7-8: Taper\n• Mon: Rest\n• Tue: 5km easy\n• Thu: 4km with 2x800m\n• Sat: 6km easy\n• Sun: 10K RACE!\n\nThis plan will help you achieve your 10K goal!',
          isAI: true,
        };
      } else if (
        message.toLowerCase().includes('tracklog') ||
        message.toLowerCase().includes('analysis')
      ) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          text: '📊 Tracklog Analysis:\n\nYour latest run shows excellent form:\n\n🏃‍♂️ Distance: 5.2km\n⏱️ Duration: 28:15\n📈 Average Pace: 5:26/km\n💓 Average HR: 145 bpm\n🔥 Calories: 320\n\nKey insights:\n• Your pace was very consistent\n• Heart rate stayed in optimal aerobic zone\n• Good cadence at 175 spm\n• No signs of overtraining\n\nKeep up this great work!',
          isAI: true,
          showActivity: true,
          activityData: {
            id: '12345',
            name: 'Morning Run - Central Park',
            type: 'Run',
            sport_type: 'Run',
            start_date_local: '2024-01-15T07:30:00Z',
            distance: 5200,
            moving_time: 1695,
            average_speed: 3.07,
            total_elevation_gain: 45,
            average_heartrate: 145,
            max_heartrate: 165,
            calories: 320,
            description:
              'Great morning run around Central Park. Felt strong and maintained consistent pace throughout.',
          },
        };
      } else if (
        message.toLowerCase().includes('plan') ||
        message.toLowerCase().includes('training')
      ) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          text: "📅 Your Current Training Plan:\n\nWeek 6/12 - Marathon Prep\n\nMonday: Rest day\nTuesday: 8km tempo run (pace: 5:15/km)\nWednesday: 5km easy run (pace: 6:00/km)\nThursday: Cross-training (cycling 45min)\nFriday: 10km long run (pace: 5:45/km)\nSaturday: 5km recovery run (pace: 6:30/km)\nSunday: Rest day\n\nYou're 50% through your marathon plan! This week focuses on building endurance for your long runs.",
          isAI: true,
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          text: 'I can help you with:\n\n📊 Tracklog analysis of your runs\n📅 View your current training plan\n🎯 Generate new training plans\n💡 Training advice and tips\n\nJust ask me about any of these topics!',
          isAI: true,
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>AI Coach Chat</Text>
          <Text style={styles.subtitle}>Get personalized training advice</Text>
        </View>

        <ScrollView style={styles.messagesContainer}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageWrapper,
                msg.isAI ? styles.aiMessageWrapper : styles.userMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.message,
                  msg.isAI ? styles.aiMessage : styles.userMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.isAI ? styles.aiMessageText : styles.userMessageText,
                  ]}
                >
                  {msg.text}
                </Text>

                {/* Show ActivityItem if message has activity data */}
                {msg.showActivity && msg.activityData && (
                  <View style={styles.activityContainer}>
                    {Array.isArray(msg.activityData) ? (
                      // Multiple activities
                      msg.activityData.map((activity: any, index: number) => (
                        <ActivityItem
                          key={`${activity.id}-${index}`}
                          activity={activity}
                          compact={true}
                        />
                      ))
                    ) : (
                      // Single activity
                      <ActivityItem
                        activity={msg.activityData}
                        compact={false}
                      />
                    )}
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Ask about your training..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Send
              size={20}
              color={message.trim() ? '#fff' : 'rgba(255, 255, 255, 0.4)'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageWrapper: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  aiMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: '#10b981',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  aiMessageText: {
    color: '#fff',
  },
  userMessageText: {
    color: '#fff',
  },
  activityContainer: {
    marginTop: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sendButton: {
    backgroundColor: '#10b981',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
