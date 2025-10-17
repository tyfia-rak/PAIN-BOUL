'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from '@heroui/react';
import { signIn } from 'next-auth/react'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result?.ok) {
        router.push('/dashboard')
      } else {
        console.error(result?.error || 'Echec de connexion')
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-card p-8">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">
              Pain Boul
            </h1>
            <p className="text-muted-foreground font-inter">
              Administration
            </p>
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

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground font-inter">
              © 2024 Pain Boul - Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
