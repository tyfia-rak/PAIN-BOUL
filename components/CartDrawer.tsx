'use client';

import React, { useState } from 'react';
import { useCart } from './CartProvider';
import Image from 'next/image';
import { BACKEND_URL } from '@/lib/config';
import OrderFormModal from './menu/OrderFormModal';

export default function CartDrawer({ onClose }: { onClose?: () => void }) {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
      setIsClosing(false);
    }, 300);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-lg z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="absolute right-0 top-0 h-full w-96 max-w-[90vw]">
          <div
            className={`relative h-full bg-background border-l border-golden/20 shadow-2xl shadow-golden/20 transform transition-transform duration-300 ${isClosing ? 'translate-x-full' : 'translate-x-0'}`}
          >
            {/* Header */}
            <div className="p-6 border-b border-golden/10 bg-gradient-to-r from-background to-golden/5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-playfair text-2xl text-foreground">
                  Mon Panier
                </h4>
                <div className="flex items-center gap-3">
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-sm text-muted-foreground hover:text-golden transition-colors font-inter flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Vider
                    </button>
                  )}
                  {onClose && (
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-golden/10 rounded-full transition-all duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Compteur d'articles */}
              <div className="flex items-center gap-2 text-muted-foreground font-inter text-sm">
                <div className="w-2 h-2 bg-golden rounded-full animate-pulse"></div>
                {totalItems} article{totalItems > 1 ? 's' : ''} dans le panier
              </div>
            </div>

            {/* Contenu du panier */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 mb-4 relative">
                    <div className="absolute inset-0 bg-golden/10 rounded-full animate-pulse"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-muted-foreground/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div className="text-muted-foreground font-inter mb-6">
                    Votre panier est vide
                  </div>
                  {onClose && (
                    <button
                      onClick={handleClose}
                      className="gradient-golden text-charcoal font-semibold py-3 px-8 rounded-lg hover:brightness-110 transition-all duration-200 shadow-golden"
                    >
                      Découvrir nos produits
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Liste des articles */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {items.map((it, index) => {
                      const img = it.product.image
                        ? it.product.image.startsWith('http')
                          ? it.product.image
                          : `${BACKEND_URL}${it.product.image}`
                        : '/placeholder.png';

                      return (
                        <div
                          key={`${it.product.idProduct}-${index}`}
                          className="flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-golden/5 transition-all duration-300 border border-golden/10 group animate-fade-in"
                        >
                          <div className="relative w-16 h-16 bg-background rounded-xl overflow-hidden shadow-sm border border-golden/10">
                            <Image
                              src={img}
                              alt={it.product.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-golden/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="font-inter font-medium text-foreground truncate mb-1 group-hover:text-golden transition-colors">
                              {it.product.name}
                            </div>
                            <div className="text-lg font-semibold text-golden">
                              {(it.product.price ?? 0).toFixed(0)} Ar
                            </div>
                          </div>

                          {/* Contrôle de quantité */}
                          <div className="flex items-center gap-1 bg-background rounded-full p-1 border border-golden/20">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  it.product.idProduct,
                                  it.quantity - 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-golden/10 transition-all duration-200 active:scale-95 text-foreground"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-inter font-medium text-foreground">
                              {it.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  it.product.idProduct,
                                  it.quantity + 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-golden/10 transition-all duration-200 active:scale-95 text-foreground"
                            >
                              +
                            </button>
                          </div>

                          {/* Bouton supprimer */}
                          <button
                            onClick={() => removeItem(it.product.idProduct)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-golden transition-all duration-200 active:scale-95 opacity-0 group-hover:opacity-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer avec total et bouton commander */}
                  <div className="border-t border-golden/10 p-6 space-y-6 bg-background/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-xl">
                      <span className="font-inter font-semibold text-foreground">
                        Total
                      </span>
                      <span className="font-playfair text-2xl font-bold text-golden">
                        {totalPrice.toFixed(0)} Ar
                      </span>
                    </div>

                    <button
                      onClick={() => setShowOrderForm(true)}
                      className="w-full gradient-golden text-charcoal font-semibold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-golden font-inter text-lg relative overflow-hidden group"
                    >
                      <span className="relative z-10">Commander</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showOrderForm && (
        <OrderFormModal
          onClose={() => {
            setShowOrderForm(false);
            handleClose();
          }}
        />
      )}
    </>
  );
}
