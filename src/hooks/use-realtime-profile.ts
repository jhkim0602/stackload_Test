"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  level?: string;
  location?: string;
  socialLinks?: Record<string, string>;
  techStack: Array<{ name: string; category?: string; level?: number; }>;
  interests?: string[];
  badges?: Array<{ name: string; icon: string; description: string; }>;
  stats?: {
    posts: number;
    likes: number;
    comments: number;
    projects: number;
    studies: number;
    mentoring: number;
  };
  joinedAt: string;
}

interface ProfileUpdateData {
  bio: string;
  level: string;
  location: string;
  github: string;
  discord: string;
  contactEmail: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  website: string;
}

export function useRealtimeProfile() {
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchProfile = useCallback(async (showLoading = true) => {
    if (!authUser) return;
    
    try {
      if (showLoading) setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/users/me', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      if (data.success) {
        setUserProfile(data.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(data.error || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [authUser]);

  const updateProfile = useCallback(async (updateData: ProfileUpdateData) => {
    if (!authUser || !userProfile) {
      throw new Error('User not authenticated or profile not loaded');
    }
    
    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
      if (data.success) {
        // Optimistically update the local state
        setUserProfile(data.data);
        setLastUpdated(new Date());
        
        // Refresh profile data to ensure consistency
        setTimeout(() => {
          fetchProfile(false);
        }, 500);
        
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      throw err;
    }
  }, [authUser, userProfile, fetchProfile]);

  const refreshProfile = useCallback(() => {
    fetchProfile(false);
  }, [fetchProfile]);

  // Periodic refresh to keep data in sync (every 5 minutes)
  useEffect(() => {
    if (!authUser) return;

    const interval = setInterval(() => {
      fetchProfile(false);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [authUser, fetchProfile]);

  // Focus refresh - refresh when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchProfile(false);
      }
    };

    document.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchProfile]);

  // Initial load
  useEffect(() => {
    if (authUser) {
      fetchProfile(true);
    } else {
      setUserProfile(null);
      setIsLoading(false);
      setError(null);
    }
  }, [authUser, fetchProfile]);

  return {
    userProfile,
    isLoading,
    error,
    lastUpdated,
    updateProfile,
    refreshProfile,
    refetch: () => fetchProfile(true)
  };
}