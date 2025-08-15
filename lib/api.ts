import Constants from 'expo-constants';
import { supabase } from './supabase';

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'http://localhost:3000';

class ApiService {
  private async getAuthHeaders() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return {
      'Content-Type': 'application/json',
      ...(session?.access_token && {
        Authorization: `Bearer ${session.access_token}`,
      }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth methods
  async signUp(email: string, password: string, metadata?: any) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  }

  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signOut() {
    return supabase.auth.signOut();
  }

  async resetPassword(email: string) {
    return supabase.auth.resetPasswordForEmail(email);
  }

  async updatePassword(password: string) {
    return supabase.auth.updateUser({ password });
  }

  // Profile methods
  async getProfile() {
    return this.request<any>('/api/profile');
  }

  async updateProfile(data: any) {
    return this.request<any>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Training Plans methods
  async getTrainingPlans() {
    return this.request<any[]>('/api/training/plans');
  }

  async generateTrainingPlan(data: any) {
    return this.request<any>('/api/training/generate-plan', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTrainingPlan(id: string) {
    return this.request<any>(`/api/training/plans/${id}`);
  }

  // Notifications methods
  async getNotifications() {
    return this.request<any[]>('/api/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/api/notifications/${id}`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead() {
    return this.request<any>('/api/notifications/mark-all-read', {
      method: 'POST',
    });
  }

  // Activities methods
  async getActivities() {
    return this.request<any[]>('/api/activities');
  }

  async analyzeActivity(activityId: string) {
    return this.request<any>('/api/activity/analyze', {
      method: 'POST',
      body: JSON.stringify({ activityId }),
    });
  }

  // Strava methods
  async getStravaStatus() {
    return this.request<any>('/api/strava/status');
  }

  async connectStrava() {
    // This will need to handle OAuth flow in mobile app
    const data = await this.request<{ authUrl: string }>('/api/strava/connect');
    return data;
  }

  // Chat/AI methods
  async sendChatMessage(message: string, context?: any) {
    return this.request<any>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }
}

export const apiService = new ApiService();
