import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  id: string | null;
  role: string | null;
  validatorId: string | null;
  agencyId: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Define mock user data
const MOCK_USERS = [
  { id: '1', username: 'admin', password: 'admin', role: 'admin', agencyId: '', validatorId: '' },
  {
    id: '2',
    username: 'test1',
    password: 'test',
    role: 'employee',
    agencyId: 'societe1',
    validatorId: ''
  },
  {
    id: '3',
    username: 'agence1',
    password: 'agence',
    role: 'agency',
    agencyId: 'societe1',
    validatorId: ''
  },
  {
    id: '4',
    username: 'valid1',
    password: 'valid',
    role: 'validator',
    agencyId: 'societe1',
    validatorId: ''
  },
  {
    id: '5',
    username: 'test2',
    password: 'test',
    role: 'employee',
    agencyId: 'societe2',
    validatorId: ''
  },
  {
    id: '6',
    username: 'agence2',
    password: 'agence',
    role: 'agency',
    agencyId: 'societe2',
    validatorId: ''
  },
  {
    id: '7',
    username: 'valid2',
    password: 'valid',
    role: 'validator',
    agencyId: 'societe2',
    validatorId: ''
  },
];

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
        set({ isAuthenticated: false, role: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
