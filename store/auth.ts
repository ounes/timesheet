import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_USERS } from './mock_data';

interface AuthState {
  isAuthenticated: boolean;
  id: string | null;
  role: string | null;
  validatorId: string | null;
  agencyId: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      id: null,
      role: null,
      validatorId: null,
      agencyId: null,
      login: async (username: string, password: string) => {
        const user = MOCK_USERS.find(
          (u) => u.username === username && u.password === password
        );

        if (user) {
          set({
            isAuthenticated: true,
            id: user.id,
            role: user.role,
            validatorId: user.validatorId,
            agencyId: user.agencyId,
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({
          isAuthenticated: false,
          id: null,
          role: null,
          validatorId: null,
          agencyId: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
