"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useAuthStore } from "@/lib/auth/useAuthStore";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMockHelp, setShowMockHelp] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

  // Afficher les erreurs depuis l'URL
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "unauthorized") {
      Swal.fire({
        icon: "error",
        title: "Accès refusé",
        text: "Vous n'avez pas les permissions nécessaires.",
        confirmButtonColor: "#C8A882",
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Connexion via NextAuth
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (result?.ok) {
        // Stocker aussi dans Zustand
        setUser({
          id: email,
          email: email.trim(),
          name: email,
          role: "admin",
        });

        // Rediriger vers la page de retour ou dashboard
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

        // Message de succès rapide
        await Swal.fire({
          icon: "success",
          title: "Connexion réussie !",
          text: "Bienvenue",
          timer: 1000,
          showConfirmButton: false,
          background: "#1a1a1a",
          color: "#ffffff",
          iconColor: "#C8A882",
        });

        router.push(callbackUrl);
      } else {
        setIsLoading(false);

        // Messages d'erreur personnalisés
        let errorMessage = "Identifiants incorrects";
        let errorTitle = "Échec de la connexion";

        if (result?.error === "CredentialsSignin") {
          errorMessage = "Email ou mot de passe incorrect. Veuillez réessayer.";
        } else if (result?.error === "Configuration") {
          errorMessage = "Erreur de configuration. Contactez l'administrateur.";
          errorTitle = "Erreur système";
        } else if (result?.error) {
          errorMessage = "Une erreur est survenue lors de la connexion.";
        }

        await Swal.fire({
          icon: "error",
          title: errorTitle,
          html: `
            <div style="text-align: left; padding: 10px;">
              <p style="margin-bottom: 15px; text-align: center;">${errorMessage}</p>
              ${
                isMockMode
                  ? `
                <div style="background: rgba(200, 168, 130, 0.1); padding: 15px; border-radius: 8px; border-left: 3px solid #C8A882;">
                  <p style="font-weight: bold; color: #C8A882; margin-bottom: 10px;">💡 Mode Mock activé</p>
                  <p style="font-size: 0.9em; color: #999; margin: 5px 0;">Comptes de test disponibles :</p>
                  <ul style="font-size: 0.85em; color: #999; margin: 10px 0; padding-left: 20px;">
                    <li>admin@painboul.com / admin123</li>
                    <li>owner@painboul.com / owner123</li>
                    <li>test@test.com / test123</li>
                  </ul>
                </div>
              `
                  : ""
              }
            </div>
          `,
          confirmButtonText: "Réessayer",
          confirmButtonColor: "#C8A882",
          background: "#1a1a1a",
          color: "#ffffff",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      await Swal.fire({
        icon: "error",
        title: "Erreur inattendue",
        html: `
          <div style="text-align: left; padding: 10px;">
            <p>Une erreur inattendue est survenue.</p>
            <p style="margin-top: 10px; font-size: 0.9em; color: #999;">Veuillez vérifier votre connexion internet et réessayer.</p>
          </div>
        `,
        confirmButtonText: "OK",
        confirmButtonColor: "#C8A882",
        background: "#1a1a1a",
        color: "#ffffff",
      });
    }
  };

  return (
    <section className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-card p-8">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">Pain Boul</h1>
            <p className="text-muted-foreground font-inter">Administration</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-inter" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-golden/50 focus:border-golden text-foreground placeholder-muted-foreground font-inter transition-colors"
                placeholder="ex: admin@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-inter" htmlFor="password">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-golden/50 focus:border-golden text-foreground placeholder-muted-foreground font-inter transition-colors"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gradient-golden text-charcoal font-semibold text-lg py-3 shadow-golden font-inter"
              radius="sm"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          {/* Aide Mode Mock */}
          {isMockMode && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowMockHelp(!showMockHelp)}
                className="w-full text-sm text-golden hover:text-golden/80 font-inter transition-colors flex items-center justify-center gap-2"
              >
                {showMockHelp ? "▼" : "▶"} Mode Mock activé - Comptes de test
              </button>

              {showMockHelp && (
                <div className="mt-4 p-4 bg-input rounded-lg border border-golden/30">
                  <h3 className="text-sm font-semibold text-foreground mb-3 font-inter">🔧 Utilisateurs de test disponibles :</h3>
                  <div className="space-y-3 text-xs font-inter">
                    <div
                      className="p-3 bg-card rounded border border-border hover:border-golden/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setEmail("admin@painboul.com");
                        setPassword("admin123");
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-golden">Admin</span>
                        <span className="px-2 py-0.5 bg-golden/20 text-golden rounded text-xs">admin</span>
                      </div>
                      <div className="text-muted-foreground">admin@painboul.com</div>
                      <div className="text-muted-foreground">admin123</div>
                    </div>

                    <div
                      className="p-3 bg-card rounded border border-border hover:border-golden/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setEmail("owner@painboul.com");
                        setPassword("owner123");
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-golden">Owner</span>
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">owner</span>
                      </div>
                      <div className="text-muted-foreground">owner@painboul.com</div>
                      <div className="text-muted-foreground">owner123</div>
                    </div>

                    <div
                      className="p-3 bg-card rounded border border-border hover:border-golden/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setEmail("test@test.com");
                        setPassword("test123");
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-golden">Test</span>
                        <span className="px-2 py-0.5 bg-golden/20 text-golden rounded text-xs">admin</span>
                      </div>
                      <div className="text-muted-foreground">test@test.com</div>
                      <div className="text-muted-foreground">test123</div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground text-center">💡 Cliquez sur un compte pour remplir automatiquement</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground font-inter">© 2024 Pain Boul - Tous droits réservés</p>
          </div>
        </div>
      </div>
    </section>
  );
}
