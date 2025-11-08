"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { BACKEND_URL } from "@/lib/config/backend";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const imgSrc = (() => {
    if (!product.image) return "/placeholder.png";
    if (product.image.startsWith("http")) return product.image;
    return `${BACKEND_URL}${product.image}`;
  })();

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItem(product, qty);
    setQty(1);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className="group w-72 bg-background rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-golden/10 hover:border-golden/30 relative">
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-golden text-charcoal text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Nouveau</span>
      </div>

      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute inset-0 bg-golden/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 bg-background relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-golden to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

        <h3 className="font-playfair text-xl text-foreground mb-2 line-clamp-2 leading-tight group-hover:text-golden transition-colors duration-300">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-golden font-playfair">{(product.price ?? 0).toFixed(0)} Ar</div>
          <div className="text-sm text-muted-foreground font-inter">Pièce</div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center bg-background/80 rounded-xl overflow-hidden border border-golden/20 shadow-inner">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-golden/10 transition-all duration-200 active:scale-95 font-inter font-medium text-foreground"
            >
              -
            </button>
            <span className="w-12 text-center font-inter font-semibold text-foreground">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-golden/10 transition-all duration-200 active:scale-95 font-inter font-medium text-foreground"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 gradient-golden text-charcoal font-semibold py-3 px-4 rounded-xl hover:brightness-110 transition-all duration-300 active:scale-95 shadow-golden font-inter relative overflow-hidden disabled:opacity-50"
          >
            <span className={`relative z-10 transition-all duration-300 ${isAdding ? "opacity-0" : "opacity-100"}`}>Ajouter</span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAdding ? "opacity-100" : "opacity-0"}`}
            >
              ✓ Ajouté
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl border-2 border-golden/0 group-hover:border-golden/20 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
}
