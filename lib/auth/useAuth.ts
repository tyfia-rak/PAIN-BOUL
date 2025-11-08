"use client";

import { useSession } from "next-auth/react";
import { useAuthStore } from "@/lib/auth/useAuthStore";
import { useEffect } from "react";

/**
 * Hook personnalisé pour gérer l'authentification
 * Combine NextAuth et Zustand pour une synchronisation complète
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const { user, isAuthenticated, setUser, checkAuth } = useAuthStore();

  // Synchroniser NextAuth avec Zustand
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.email || "",
        email: session.user.email || "",
        name: session.user.name || session.user.email || "",
        role: (session.user as any).role || "admin",
      });
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status, setUser]);

  // Vérifier l'authentification au montage
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user: session?.user || user,
    isAuthenticated: status === "authenticated" || isAuthenticated,
    isLoading: status === "loading",
    session,
  };
}
