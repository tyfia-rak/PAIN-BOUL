'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Button,
} from '@heroui/react';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const navigateTo = (target: string) => {
    const isHashOnly = target.startsWith('#');
    const destination = isHashOnly ? `/${target}` : target;
    router.push(destination);
  };

  const linkBase = 'transition-colors duration-200 font-inter font-medium';

  return (
    <Navbar
      className="bg-background/80 backdrop-blur-md border-b border-border"
      position="sticky"
      maxWidth="full"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="md:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        />
      </NavbarContent>

      <NavbarBrand>
        <h1 className="font-playfair text-2xl font-bold text-golden">
          Pain Boul
        </h1>
      </NavbarBrand>

      <NavbarContent className="hidden md:flex gap-8" justify="center">
        <NavbarItem>
          <button
            type="button"
            onClick={() => navigateTo('#accueil')}
            className={`text-foreground hover:text-golden ${linkBase}`}
          >
            Accueil
          </button>
        </NavbarItem>
        <NavbarItem>
          <button
            type="button"
            onClick={() => navigateTo('#localisation')}
            className={`text-foreground hover:text-golden ${linkBase}`}
          >
            Point de vente
          </button>
        </NavbarItem>
        <NavbarItem>
          <button
            type="button"
            onClick={() => navigateTo('#apropos')}
            className={`text-foreground hover:text-golden ${linkBase}`}
          >
            À Propos
          </button>
        </NavbarItem>
        <NavbarItem>
          <button
            type="button"
            onClick={() => navigateTo('#services')}
            className={`text-foreground hover:text-golden ${linkBase}`}
          >
            Services
          </button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <button
            type="button"
            onClick={() => navigateTo('/admin/login')}
            className={`text-foreground hover:text-golden ${linkBase}`}
          >
            Admin
          </button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <button
            type="button"
            className="block py-2 text-foreground hover:text-golden"
            onClick={() => {
              setIsMenuOpen(false);
              navigateTo('#accueil');
            }}
          >
            Accueil
          </button>
        </NavbarMenuItem>

        <NavbarMenuItem>
          <button
            type="button"
            className="block py-2 text-foreground hover:text-golden"
            onClick={() => {
              setIsMenuOpen(false);
              navigateTo('#produits');
            }}
          >
            Point de vente
          </button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <button
            type="button"
            className="block py-2 text-foreground hover:text-golden"
            onClick={() => {
              setIsMenuOpen(false);
              navigateTo('#apropos');
            }}
          >
            À Propos
          </button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <button
            type="button"
            className="block py-2 text-foreground hover:text-golden"
            onClick={() => {
              setIsMenuOpen(false);
              navigateTo('#contact');
            }}
          >
            Contact
          </button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <button
            type="button"
            className="block py-2 text-foreground hover:text-golden"
            onClick={() => {
              setIsMenuOpen(false);
              navigateTo('/admin/login');
            }}
          >
            Admin
          </button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};
