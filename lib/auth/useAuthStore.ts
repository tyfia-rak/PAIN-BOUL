import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setLoading: (loading) => set({ isLoading: loading }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${BACKEND_BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
          });

          if (!res.ok) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return false;
          }

          const userData = await res.json();

          if (!userData?.email) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return false;
          }

          const user: User = {
            id: String(userData.id ?? userData.email),
            email: userData.email,
            name: userData.name || userData.email,
            role: userData.role || "admin",
          };

          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          console.error("Login error:", error);
          set({ user: null, isAuthenticated: false, isLoading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          // Optionnel : appel à l'API backend pour logout
          await fetch(`${BACKEND_BASE_URL}/users/logout`, {
            method: "POST",
            credentials: "include",
          }).catch(() => {
            // Ignorer les erreurs de logout backend
          });
        } finally {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      checkAuth: async () => {
        const { user } = get();
        if (user) {
          set({ isAuthenticated: true, isLoading: false });
        } else {
          set({ isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
