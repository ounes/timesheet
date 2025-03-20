import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  agencie: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Define mock user data
const MOCK_USERS = [
  { username: 'admin', password: 'admin', role: 'admin', agencie: 'all' },
  {
    username: 'test1',
    password: 'test',
    role: 'employee',
    agencie: 'societe1',
  },
  {
    username: 'agence1',
    password: 'agence',
    role: 'agencie',
    agencie: 'societe1',
  },
  {
    username: 'valid1',
    password: 'valid',
    role: 'validator',
    agencie: 'societe1',
  },
  {
    username: 'test2',
    password: 'test',
    role: 'employee',
    agencie: 'societe2',
  },
  {
    username: 'agence2',
    password: 'agence',
    role: 'agencie',
    agencie: 'societe2',
  },
  {
    username: 'valid2',
    password: 'valid',
    role: 'validator',
    agencie: 'societe2',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      agencie: null,
      login: async (username: string, password: string) => {
        const user = MOCK_USERS.find(
          (u) => u.username === username && u.password === password
        );

        if (user) {
          set({
            isAuthenticated: true,
            role: user.role,
            agencie: user.agencie,
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, role: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
