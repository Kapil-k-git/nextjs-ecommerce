
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apolloClient } from '@/lib/apollo-client';
import { TOKEN_CREATE } from '@/lib/graphql/mutations';
import { AuthState, User } from '@/lib/types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string): Promise<boolean> => {
        try {
          const { data } = await apolloClient.mutate({
            mutation: TOKEN_CREATE,
            variables: { email, password },
          });

          if (data.tokenCreate.errors.length > 0) {
            console.error('Login errors:', data.tokenCreate.errors);
            return false;
          }

          const { token, user } = data.tokenCreate;
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', token);
          }

          set({
            user,
            token,
            isAuthenticated: true,
          });

          return true;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
        }
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
