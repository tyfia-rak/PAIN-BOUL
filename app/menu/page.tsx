"use client";

import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import React, { useEffect, useState } from "react";
import MenuCategory from "@/components/menu/MenuCategory";
import { Category } from "@/lib/types";
import { BACKEND_URL } from "@/lib/config/backend";
import CartProvider, { useCart } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        if (mounted) {
          setCategories(data);
          if (data.length > 0) {
            setActiveCategory(data[0].nameCategory);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  const scrollToCategory = (categoryName: string) => {
    setActiveCategory(categoryName);
    const element = document.getElementById(`category-${categoryName}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Header avec image de fond */}
        <header className="relative h-96 overflow-hidden">
          {/* Image de fond */}
          <div className="absolute inset-0 bg-[url('/image.png')] bg-cover bg-center" />
          {/* Overlay sombre pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Gradient supplémentaire */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/5" />

          <div className="relative h-full flex items-center justify-center">
            <div className="text-center px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-golden to-transparent mx-auto mb-4" />
                <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                  Notre Menu
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-golden to-transparent mx-auto mt-4" />
              </div>

              <p className="text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                Découvrez l'excellence de notre artisanat boulanger. Chaque produit est une œuvre préparée avec passion et le savoir-faire
                traditionnel malgache.
              </p>

              {/* Indicateur de scroll */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-golden rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-golden rounded-full mt-2 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation par catégories sticky */}
        {categories.length > 0 && (
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-golden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="font-inter font-medium text-foreground">Catégories</span>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                  {categories.map((category) => (
                    <button
                      key={category.idCategory}
                      onClick={() => scrollToCategory(category.nameCategory)}
                      className={`px-4 py-2 rounded-full font-inter text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                        activeCategory === category.nameCategory
                          ? "gradient-golden text-charcoal shadow-golden"
                          : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                      }`}
                    >
                      {category.nameCategory}
                    </button>
                  ))}
                </div>

                <CartToggle onToggle={() => setShowCart((s) => !s)} />
              </div>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Statistiques simplifiées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-2xl bg-background border border-border hover:border-golden/30 transition-all duration-300 group">
              <div className="text-3xl font-bold text-golden font-playfair mb-2 group-hover:scale-110 transition-transform duration-300">
                50+
              </div>
              <div className="text-muted-foreground font-inter">Produits Artisanaux</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-background border border-border hover:border-golden/30 transition-all duration-300 group">
              <div className="text-3xl font-bold text-golden font-playfair mb-2 group-hover:scale-110 transition-transform duration-300">
                {categories.length}+
              </div>
              <div className="text-muted-foreground font-inter">Catégories</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-background border border-border hover:border-golden/30 transition-all duration-300 group">
              <div className="text-3xl font-bold text-golden font-playfair mb-2 group-hover:scale-110 transition-transform duration-300">
                2018
              </div>
              <div className="text-muted-foreground font-inter">Année de Création</div>
            </div>
          </div>

          {loading ? (
            <div className="min-h-96 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-golden/20 border-t-golden rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-golden/10 rounded-full animate-ping" />
                </div>
              </div>
              <div className="mt-6 text-lg text-muted-foreground font-inter">Chargement de notre sélection...</div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-background border border-border rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="font-playfair text-2xl text-foreground mb-3">Menu en préparation</h3>
              <p className="text-muted-foreground max-w-md mx-auto font-inter">
                Notre menu est actuellement en cours de préparation. Revenez bientôt pour découvrir nos délicieuses créations.
              </p>
            </div>
          ) : (
            <div className="space-y-20">
              {categories.map((category, index) => (
                <div key={category.idCategory} id={`category-${category.nameCategory}`} className="scroll-mt-32">
                  <MenuCategory category={category} />

                  {/* Séparateur décoratif entre les catégories */}
                  {index < categories.length - 1 && (
                    <div className="flex items-center justify-center mt-16 mb-8">
                      <div className="w-32 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                      <div className="mx-4 w-2 h-2 rounded-full bg-golden/40" />
                      <div className="w-32 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-20 p-12 rounded-3xl bg-background border border-border">
            <h2 className="font-playfair text-3xl md:text-4xl text-foreground mb-6">Prêt à savourer l'excellence ?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto font-inter">
              Commandez dès maintenant et laissez-vous emporter par la magie de nos créations artisanales.
            </p>
            <button
              onClick={() => setShowCart(true)}
              className="gradient-golden text-charcoal font-semibold px-8 py-4 rounded-xl hover:brightness-110 transition-all duration-300 shadow-golden text-lg font-inter"
            >
              Commander Maintenant
            </button>
          </div>
        </main>

        <Footer />

        {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
      </div>
    </CartProvider>
  );
}

function CartToggle({ onToggle }: { onToggle: () => void }) {
  try {
    const { totalItems } = useCart();
    return (
      <button
        onClick={onToggle}
        className="group relative flex items-center gap-3 bg-background/95 backdrop-blur-sm border border-border px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:border-golden/30 transition-all duration-300"
      >
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-golden group-hover:scale-110 transition-transform duration-200"
          >
            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
          </svg>

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-golden text-charcoal text-xs font-bold min-w-[1.5rem] h-6 rounded-full flex items-center justify-center shadow-lg">
              {totalItems}
            </span>
          )}
        </div>

        <span className="font-inter font-semibold text-foreground">Panier</span>

        {/* Effet de halo au hover */}
        <div className="absolute inset-0 rounded-full bg-golden/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </button>
    );
  } catch (e) {
    return null;
  }
}
