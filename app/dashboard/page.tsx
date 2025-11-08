"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";
import LogoutButton from "@/components/admin/LogoutButton";

import ProductsSection from "@/components/dashboard/sections/ProductsSection";
import CategoriesSection from "@/components/dashboard/sections/CategoriesSection";
import CommandesSection from "@/components/dashboard/sections/CommandesSection";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState<string>("Dashboard");
  const [query, setQuery] = useState<string>("");

  const sections = ["Dashboard", "Commandes", "Produits", "Catégories", "Clients", "Rapports"] as const;

  // Redirection si non authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Utiliser window.location pour forcer le middleware
      window.location.href = "/admin/login";
    }
  }, [isLoading, isAuthenticated]);

  // Loading state
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

  // Si pas authentifié après chargement
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

  const renderSection = () => {
    switch (activeSection) {
      case "Produits":
        return <ProductsSection query={query} />;
      case "Commandes":
        return <CommandesSection />;
      case "Catégories":
        return <CategoriesSection query={query} />;
      case "Dashboard":
        return (
          <section className="mt-6 bg-card border border-border rounded-lg p-6 shadow-card">
            <h2 className="font-playfair text-xl font-bold text-foreground mb-4">Tableau de bord</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-input p-4 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">Bienvenue</h3>
                <p className="text-muted-foreground text-sm">
                  Connecté en tant que <strong>{user?.email}</strong>
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Rôle: <strong>{(user as any)?.role || "N/A"}</strong>
                </p>
              </div>
              <div className="bg-input p-4 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">Navigation rapide</h3>
                <p className="text-muted-foreground text-sm">Utilisez le menu de gauche pour naviguer entre les différentes sections.</p>
              </div>
            </div>
          </section>
        );
      case "Clients":
        return (
          <section className="mt-6 bg-card border border-border rounded-lg p-6 shadow-card">
            <h2 className="font-playfair text-xl font-bold text-foreground mb-4">Clients</h2>
            <p className="text-muted-foreground">Section clients en cours de développement...</p>
          </section>
        );
      case "Rapports":
        return (
          <section className="mt-6 bg-card border border-border rounded-lg p-6 shadow-card">
            <h2 className="font-playfair text-xl font-bold text-foreground mb-4">Rapports</h2>
            <p className="text-muted-foreground">Section rapports en cours de développement...</p>
          </section>
        );
      default:
        return (
          <section className="mt-6 bg-card border border-border rounded-lg p-6 shadow-card">
            <h2 className="font-playfair text-xl font-bold text-foreground mb-4">{activeSection}</h2>
            <p className="text-muted-foreground">Section en cours de développement...</p>
          </section>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r border-border bg-card">
          <div className="h-16 flex items-center px-6 border-b border-border">
            <span className="font-playfair text-xl font-bold text-foreground">PainBoul Admin</span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {sections.map((s) => {
              const isActive = activeSection === s;
              return (
                <a
                  key={s}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(s);
                    if (s !== "Produits" && s !== "Commandes") setQuery("");
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-input transition ${
                    isActive ? "bg-input text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  <span>{s}</span>
                </a>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border text-xs text-muted-foreground">v1.0.0</div>
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button className="lg:hidden p-2 rounded-md border border-border hover:bg-input transition" aria-label="Ouvrir le menu">
                  ☰
                </button>
                <div className="relative">
                  <input
                    aria-label="Rechercher"
                    placeholder="Rechercher..."
                    className="w-56 md:w-72 lg:w-96 px-3 py-2 rounded-md bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none transition"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                      display: activeSection === "Produits" || activeSection === "Commandes" ? "block" : "none",
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm text-muted-foreground">{user?.email}</span>
                <div className="w-8 h-8 rounded-full bg-foreground text-background grid place-items-center font-medium" aria-hidden>
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <LogoutButton
                  variant="bordered"
                  size="sm"
                  className="text-sm border border-border rounded-md hover:bg-input transition text-muted-foreground hover:text-foreground"
                />
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 lg:px-8 py-6">
            <nav aria-label="Fil d'Ariane" className="text-sm text-muted-foreground mb-4">
              <ol className="flex items-center gap-2">
                <li>
                  <a
                    href="#"
                    className="hover:underline transition"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection("Dashboard");
                      setQuery("");
                    }}
                  >
                    Accueil
                  </a>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">{activeSection}</li>
              </ol>
            </nav>

            {renderSection()}
          </main>
        </div>
      </div>
    </div>
  );
}
