'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'painboul_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (p) => p.product.idProduct === product.idProduct
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((p) => p.product.idProduct !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) return removeItem(productId);
    setItems((prev) =>
      prev.map((it) =>
        it.product.idProduct === productId ? { ...it, quantity } : it
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, it) => s + it.quantity, 0);
  const totalPrice = items.reduce(
    (s, it) => s + it.quantity * (it.product.price ?? 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export default CartProvider;
