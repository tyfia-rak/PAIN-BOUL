"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * Composant pour protéger les routes côté client
 * Utilise NextAuth et Zustand pour vérifier l'authentification
 */
export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }

    if (!isLoading && isAuthenticated && requiredRole) {
      const userRole = (user as any)?.role;
      if (userRole !== requiredRole) {
        router.push("/admin/login?error=unauthorized");
      }
    }
  }, [isAuthenticated, isLoading, router, requiredRole, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden mx-auto mb-4"></div>
          <p className="text-muted-foreground font-inter">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-2xl font-bold text-foreground mb-4">Redirection...</h1>
          <p className="text-muted-foreground font-inter">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
