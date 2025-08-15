import { makeRedirectUri } from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from './supabase';
import { Platform } from 'react-native';

// OAuth configuration
export const oauth = {
  redirectUri: makeRedirectUri({
    scheme: 'runningmate',
    path: 'auth/callback',
  }),
};

// Google Sign-In with Supabase
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: oauth.redirectUri,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

// Apple Sign-In with Supabase
export const signInWithApple = async () => {
  try {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In is only available on iOS');
    }

    // Check if Apple Sign-In is available
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Apple Sign-In is not available on this device');
    }

    // Request Apple authentication
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Sign in with Supabase using Apple ID token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken!,
      // nonce is not available in all credential types, so we'll omit it for now
    });

    if (error) throw error;

    // Update user metadata if available
    if (credential.fullName && data.user) {
      const displayName = [
        credential.fullName.givenName,
        credential.fullName.familyName,
      ]
        .filter(Boolean)
        .join(' ');

      if (displayName) {
        await supabase.auth.updateUser({
          data: {
            full_name: displayName,
            display_name: displayName,
          },
        });
      }
    }

    return { data, error: null };
  } catch (error: any) {
    if (error.code === 'ERR_REQUEST_CANCELED') {
      // User canceled the sign-in flow
      return { data: null, error: new Error('Sign-in was canceled') };
    }
    return { data: null, error };
  }
};

// Check if Apple Sign-In is available
export const isAppleAuthAvailable = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios') return false;
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
};
