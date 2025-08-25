import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../lib/api';
import { useAuth } from './AuthContext';

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // in weeks
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  workouts: Workout[];
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  type: 'easy' | 'tempo' | 'interval' | 'long' | 'recovery';
  duration: number; // in minutes
  distance?: number; // in km
  intensity: number; // 1-10 scale
  day_of_week: number; // 0-6 (Sunday = 0)
  week_number: number;
  completed?: boolean;
  completed_at?: string;
  notes?: string;
}

interface TrainingContextType {
  trainingPlans: TrainingPlan[];
  currentPlan: TrainingPlan | null;
  loading: boolean;
  error: string | null;

  // Actions
  generateTrainingPlan: (goals: any) => Promise<TrainingPlan | null>;
  getTrainingPlans: () => Promise<void>;
  getTrainingPlan: (id: string) => Promise<TrainingPlan | null>;
  setCurrentPlan: (plan: TrainingPlan | null) => void;
  refreshPlans: () => Promise<void>;
  completeWorkout: (workoutId: string, notes?: string) => Promise<void>;
  updateWorkout: (
    workoutId: string,
    updates: Partial<Workout>,
  ) => Promise<void>;
}

const TrainingContext = createContext<TrainingContextType | undefined>(
  undefined,
);

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};

interface TrainingProviderProps {
  children: React.ReactNode;
}

export const TrainingProvider: React.FC<TrainingProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getTrainingPlans();
    }
  }, [user]);

  const getTrainingPlans = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const plans = await apiService.getTrainingPlans();
      setTrainingPlans(plans || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load training plans');
    } finally {
      setLoading(false);
    }
  };

  const getTrainingPlan = async (id: string): Promise<TrainingPlan | null> => {
    if (!user) return null;

    try {
      const plan = await apiService.getTrainingPlan(id);
      return plan;
    } catch (err: any) {
      setError(err.message || 'Failed to load training plan');
      return null;
    }
  };

  const generateTrainingPlan = async (
    goals: any,
  ): Promise<TrainingPlan | null> => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const plan = await apiService.generateTrainingPlan(goals);
      if (plan) {
        setTrainingPlans((prev) => [plan, ...prev]);
        return plan;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to generate training plan');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshPlans = async () => {
    await getTrainingPlans();
  };

  const completeWorkout = async (workoutId: string, notes?: string) => {
    if (!user) return;

    try {
      await apiService.completeWorkout(workoutId, notes);

      // Update local state
      setTrainingPlans((prev) =>
        prev.map((plan) => ({
          ...plan,
          workouts: plan.workouts.map((workout) =>
            workout.id === workoutId
              ? {
                  ...workout,
                  completed: true,
                  completed_at: new Date().toISOString(),
                  notes: notes || workout.notes,
                }
              : workout,
          ),
        })),
      );

      // Update current plan if it contains this workout
      if (currentPlan) {
        setCurrentPlan((prev) =>
          prev
            ? {
                ...prev,
                workouts: prev.workouts.map((workout) =>
                  workout.id === workoutId
                    ? {
                        ...workout,
                        completed: true,
                        completed_at: new Date().toISOString(),
                        notes: notes || workout.notes,
                      }
                    : workout,
                ),
              }
            : null,
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete workout');
    }
  };

  const updateWorkout = async (
    workoutId: string,
    updates: Partial<Workout>,
  ) => {
    if (!user) return;

    try {
      await apiService.updateWorkout(workoutId, updates);

      // Update local state
      setTrainingPlans((prev) =>
        prev.map((plan) => ({
          ...plan,
          workouts: plan.workouts.map((workout) =>
            workout.id === workoutId ? { ...workout, ...updates } : workout,
          ),
        })),
      );

      // Update current plan if it contains this workout
      if (currentPlan) {
        setCurrentPlan((prev) =>
          prev
            ? {
                ...prev,
                workouts: prev.workouts.map((workout) =>
                  workout.id === workoutId
                    ? { ...workout, ...updates }
                    : workout,
                ),
              }
            : null,
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update workout');
    }
  };

  const value: TrainingContextType = {
    trainingPlans,
    currentPlan,
    loading,
    error,
    generateTrainingPlan,
    getTrainingPlans,
    getTrainingPlan,
    setCurrentPlan,
    refreshPlans,
    completeWorkout,
    updateWorkout,
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
};
