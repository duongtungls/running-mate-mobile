import { User } from '@supabase/supabase-js';
import { UserProfile } from '../types/profile';

interface GetProfilePictureOptions {
  profile?: UserProfile | null;
  user?: User | null;
  fallbackUrl?: string;
}

/**
 * Gets the appropriate profile picture URI with proper fallback hierarchy
 * 1. Custom uploaded avatar (profile.avatar_url) - highest priority
 * 2. OAuth provider picture (user.user_metadata.picture)
 * 3. OAuth provider avatar_url (user.user_metadata.avatar_url)
 * 4. Generic fallback image - lowest priority
 */
export function getProfilePictureUri({
  profile,
  user,
  fallbackUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80',
}: GetProfilePictureOptions): string {
  // 1. Custom uploaded avatar has highest priority
  if (profile?.avatar_url) {
    return profile.avatar_url;
  }

  // 2. OAuth provider profile picture
  if (user?.user_metadata?.picture) {
    return user.user_metadata.picture;
  }

  // 3. OAuth provider avatar_url (alternative field)
  if (user?.user_metadata?.avatar_url) {
    return user.user_metadata.avatar_url;
  }

  // 4. Generic fallback
  return fallbackUrl;
}
