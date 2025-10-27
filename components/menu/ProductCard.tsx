'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { Product } from '@/types'
import { useCart } from '@/components/CartProvider'
import { BACKEND_URL } from '@/lib/config'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)

  const imgSrc = (() => {
    if (!product.image) return '/placeholder.png'
    if (product.image.startsWith('http')) return product.image
    return `${BACKEND_URL}${product.image}`
  })()

  return (
    <div className="group w-64 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          src={imgSrc} 
          alt={product.name} 
          fill 
          className="object-cover transform group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <div className="p-4">
        <h3 className="font-playfair text-lg text-foreground mb-1 truncate">{product.name}</h3>
        <div className="text-lg font-semibold text-golden mb-3">{(product.price ?? 0).toFixed(0)} Ar</div>
        
        <div className="flex items-center justify-between gap-3 opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center bg-background/80 rounded-lg overflow-hidden border border-border/50">
            <button 
              onClick={() => setQty((q) => Math.max(1, q - 1))} 
              className="w-8 h-8 flex items-center justify-center hover:bg-background/90 transition-colors"
            >
              -
            </button>
            <span className="w-10 text-center font-medium">{qty}</span>
            <button 
              onClick={() => setQty((q) => q + 1)} 
              className="w-8 h-8 flex items-center justify-center hover:bg-background/90 transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={() => {
              addItem(product, qty)
              setQty(1) // Reset quantity after adding
            }}
            className="flex-1 bg-golden text-charcoal font-medium py-2 px-4 rounded-lg hover:brightness-110 transition-all duration-200 active:scale-95"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}
