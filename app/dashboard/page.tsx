'use client';

import withAuth from '../../lib/withAuth';
import { DashboardProps } from '../../types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { BACKEND_URL } from '@/lib/config';

import ProductsSection from './sections/ProductsSection';
import CategoriesSection from './sections/CategoriesSection';
import CommandesSection from './sections/CommandesSection';

function Dashboard({ session }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<string>('Dashboard');
  const [query, setQuery] = useState<string>('');
  const router = useRouter();

  const sections = [
    'Dashboard',
    'Commandes',
    'Produits',
    'Catégories',
    'Clients',
    'Rapports',
  ] as const;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Se déconnecter',
      cancelButtonText: 'Annuler',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${BACKEND_URL}/users/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        Swal.fire({
          title: 'Déconnecté!',
          text: 'Vous avez été déconnecté avec succès.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          router.push('admin/login');
        });
      } else {
        throw new Error('Échec de la déconnexion');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur lors de la déconnexion.',
        icon: 'error',
        timer: 3000,
      }).then(() => {
        router.push('/login');
      });
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Produits':
        return <ProductsSection query={query} />;
      case 'Commandes':
        return <CommandesSection />;
      case 'Catégories':
        return <CategoriesSection query={query} />;
      case 'Dashboard':
        return (
          <section className="mt-6 bg-card border border-border rounded-lg p-6 shadow-card">
            <h2 className="font-playfair text-xl font-bold text-foreground mb-4">
              Tableau de bord
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-input p-4 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">
                  Bienvenue
                </h3>
                <p className="text-muted-foreground text-sm">
                  Connecté en tant que <strong>{session?.user.email}</strong>
                </p>
              </div>
              <div className="bg-input p-4 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">
                  Navigation rapide
                </h3>
                <p className="text-muted-foreground text-sm">
                  Utilisez le menu de gauche pour naviguer entre les différentes
                  sections.
                </p>
              </div>
            </div>
          </section>
        );
      case 'Clients':
        return (
          <section className="mt-6 bg-card border border-border rounded-lg p-6 shadow-card">
            <h2 className="font-playfair text-xl font-bold text-foreground mb-4">
              Clients
            </h2>
            <p className="text-muted-foreground">
              Section clients en cours de développement...
            </p>
          </section>
        );
      case 'Rapports':
        return (
          <section className="mt-6 bg-card border border-border rounded-lg p-6 shadow-card">
            <h2 className="font-playfair text-xl font-bold text-foreground mb-4">
              Rapports
            </h2>
            <p className="text-muted-foreground">
              Section rapports en cours de développement...
            </p>
          </section>
        );
      default:
        return (
          <section className="mt-6 bg-card border border-border rounded-lg p-6 shadow-card">
            <h2 className="font-playfair text-xl font-bold text-foreground mb-4">
              {activeSection}
            </h2>
            <p className="text-muted-foreground">
              Section en cours de développement...
            </p>
          </section>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r border-border bg-card">
          <div className="h-16 flex items-center px-6 border-b border-border">
            <span className="font-playfair text-xl font-bold text-foreground">
              PainBoul Admin
            </span>
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
                    if (s !== 'Produits' && s !== 'Commandes') setQuery('');
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-input transition ${
                    isActive
                      ? 'bg-input text-foreground font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  <span>{s}</span>
                </a>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border text-xs text-muted-foreground">
            v1.0.0
          </div>
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden p-2 rounded-md border border-border hover:bg-input transition"
                  aria-label="Ouvrir le menu"
                >
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
                      display:
                        activeSection === 'Produits' ||
                        activeSection === 'Commandes'
                          ? 'block'
                          : 'none',
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {session?.user.email}
                </span>
                <div
                  className="w-8 h-8 rounded-full bg-foreground text-background grid place-items-center font-medium"
                  aria-hidden
                >
                  {session?.user.name?.[0] ?? 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-input transition text-muted-foreground hover:text-foreground"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 lg:px-8 py-6">
            <nav
              aria-label="Fil d'Ariane"
              className="text-sm text-muted-foreground mb-4"
            >
              <ol className="flex items-center gap-2">
                <li>
                  <a
                    href="#"
                    className="hover:underline transition"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection('Dashboard');
                      setQuery('');
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

export default withAuth(Dashboard);
