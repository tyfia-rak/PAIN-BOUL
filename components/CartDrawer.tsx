'use client'

import React, { useState } from 'react'
import { useCart } from './CartProvider'
import Image from 'next/image'
import { BACKEND_URL } from '@/lib/config'
import OrderFormModal from './menu/OrderFormModal'

export default function CartDrawer({ onClose }: { onClose?: () => void }) {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart()
  const [showOrderForm, setShowOrderForm] = useState(false)

  return (
    <>
      <div className="fixed right-4 top-16 w-[420px] max-w-[calc(100vw-2rem)] bg-white border border-border/10 rounded-2xl shadow-2xl p-6 z-50">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-playfair text-xl text-foreground">Mon Panier ({totalItems})</h4>
          <div className="flex gap-3">
            {items.length > 0 && (
              <button 
                onClick={clearCart} 
                className="text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Vider
              </button>
            )}
            {onClose && (
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <div className="text-muted-foreground">Votre panier est vide</div>
            {onClose && (
              <button 
                onClick={onClose}
                className="mt-4 text-sm text-golden hover:underline"
              >
                Continuer mes achats
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {items.map((it) => {
                const img = it.product.image 
                  ? (it.product.image.startsWith('http') ? it.product.image : `${BACKEND_URL}${it.product.image}`) 
                  : '/placeholder.png'
                
                return (
                  <div 
                    key={it.product.idProduct} 
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-background/50 transition-colors"
                  >
                    <div className="relative w-16 h-16 bg-background rounded-lg overflow-hidden">
                      <Image src={img} alt={it.product.name} fill className="object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate mb-1">{it.product.name}</div>
                      <div className="text-sm text-golden">{(it.product.price ?? 0).toFixed(0)} Ar</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => updateQuantity(it.product.idProduct, it.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{it.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(it.product.idProduct, it.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(it.product.idProduct)} 
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span className="font-medium">Total</span>
                <span className="font-semibold text-golden">{totalPrice.toFixed(0)} Ar</span>
              </div>

              <button
                onClick={() => setShowOrderForm(true)}
                className="w-full bg-golden text-charcoal font-semibold py-3 rounded-xl hover:brightness-105 active:scale-[0.99] transition-all duration-200"
              >
                Commander
              </button>
            </div>
          </div>
        )}
      </div>

      {showOrderForm && (
        <OrderFormModal onClose={() => {
          setShowOrderForm(false)
          onClose?.()
        }} />
      )}
    </>
  )
}
