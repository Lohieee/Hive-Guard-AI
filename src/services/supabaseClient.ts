// HIVEGUARD AI - Supabase Client Bridge
// Provides unified interface with real Supabase Auth/DB/Realtime when configured,
// and smooth transparent fallback to the local mock relational store.

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { db } from './mockDb';
import { UserProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.includes('.supabase.co') &&
  supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface AuthSession {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isMock: boolean;
}

// Authentication Service Wrapper
export const authService = {
  async getSession(): Promise<AuthSession> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const userProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: profile?.full_name || session.user.user_metadata?.full_name || 'Beekeeper',
            phone: profile?.phone || session.user.user_metadata?.phone || '',
            organization: profile?.organization || session.user.user_metadata?.organization || '',
            created_at: profile?.created_at || session.user.created_at
          };

          return { user: userProfile, isAuthenticated: true, isMock: false };
        }
      } catch (e) {
        console.warn('Supabase auth session fetch error, falling back to local session:', e);
      }
    }

    // Local Mock Session
    const localUser = db.getUser();
    const storedAuth = localStorage.getItem('hiveguard_auth_state');
    const isAuthed = storedAuth !== 'logged_out';

    return {
      user: isAuthed ? localUser : null,
      isAuthenticated: isAuthed,
      isMock: true
    };
  },

  async signIn(email: string, _password: string):Promise<{ user: UserProfile; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: _password });
        if (error) return { user: null as any, error: error.message };
        if (data.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          const user: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: profile?.full_name || data.user.user_metadata?.full_name || 'Beekeeper',
            phone: profile?.phone || '',
            created_at: data.user.created_at
          };
          return { user };
        }
      } catch (err: any) {
        console.warn('Supabase login failed, trying demo fallback:', err);
      }
    }

    // Local Sign In
    localStorage.setItem('hiveguard_auth_state', 'logged_in');
    const user = db.getUser();
    user.email = email;
    db.updateUser(user);
    return { user };
  },

  async signUp(email: string, _password: string, fullName: string, phone: string, organization?: string): Promise<{ user: UserProfile; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: _password,
          options: {
            data: { full_name: fullName, phone, organization }
          }
        });
        if (error) return { user: null as any, error: error.message };
        if (data.user) {
          const newUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            phone: phone,
            organization: organization || '',
            created_at: new Date().toISOString()
          };
          return { user: newUser };
        }
      } catch (err: any) {
        console.warn('Supabase register error:', err);
      }
    }

    // Local Sign Up
    localStorage.setItem('hiveguard_auth_state', 'logged_in');
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email,
      full_name: fullName,
      phone,
      organization: organization || '',
      created_at: new Date().toISOString()
    };
    db.updateUser(newUser);
    return { user: newUser };
  },

  async signOut() {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('hiveguard_auth_state', 'logged_out');
  }
};
