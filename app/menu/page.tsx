"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import React, { useEffect, useState } from "react";
import MenuCategory from '@/components/menu/MenuCategory'
import { Category } from '@/types'
import { BACKEND_URL } from '@/lib/config'
import CartProvider, { useCart } from '@/components/CartProvider'
import CartDrawer from '@/components/CartDrawer'

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/categories`)
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data = await res.json()
        if (mounted) setCategories(data)
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchCategories()
    return () => { mounted = false }
  }, [])

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="relative bg-[url('/menu-header.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/40" />
          <header className="relative">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
              <h1 className="font-playfair text-5xl sm:text-6xl font-bold tracking-wide text-white mb-6">
                Notre Menu
              </h1>
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="w-16 h-[2px] bg-golden" />
                <span className="w-3 h-3 rounded-full bg-golden" />
                <span className="w-16 h-[2px] bg-golden" />
              </div>
              <p className="text-white/90 text-lg max-w-2xl mx-auto font-light">
                Découvrez notre sélection de produits artisanaux, préparés avec passion et savoir-faire
              </p>
            </div>
          </header>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="sticky top-4 z-40 flex justify-end mb-12">
            <CartToggle onToggle={() => setShowCart((s) => !s)} />
          </div>

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-xl text-muted-foreground animate-pulse">
                Chargement de notre menu...
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucune catégorie disponible pour le moment.
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map((c) => (
                <MenuCategory key={c.idCategory} category={c} />
              ))}
            </div>
          )}
        </main>

        <Footer />

        {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
      </div>
    </CartProvider>
  );
}

function CartToggle({ onToggle }: { onToggle: () => void }) {
  try {
    const { totalItems } = useCart()
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-border/10 px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-5 h-5 text-golden"
        >
          <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
        </svg>
        <span className="font-medium">Panier</span>
        {totalItems > 0 && (
          <span className="bg-golden text-charcoal text-sm font-semibold min-w-[1.5rem] h-6 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
    )
  } catch (e) {
    return null // Ne pas afficher le bouton si en dehors du provider
  }
}


