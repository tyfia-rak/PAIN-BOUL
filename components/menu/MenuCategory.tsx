'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { BACKEND_URL } from "@/lib/config/backend";

interface Category {
  idCategory: number;
  nameCategory: string;
}

interface Product {
  idProduct: number;
  name: string;
}
export default function MenuCategory({ category }: { category: Category }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        const categoryProducts = Array.isArray(data)
          ? data.filter(
              (p) =>
                p.categoryName?.toLowerCase() ===
                category.nameCategory.toLowerCase()
            )
          : [];
        if (mounted) setProducts(categoryProducts);
      } catch (e) {
        console.error(
          'Error fetching products for category:',
          category.nameCategory,
          e
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, [category.nameCategory]);

  if (products.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="mb-20">
      <div className="relative mb-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-golden/20"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-background px-8">
            <h3 className="font-playfair text-4xl md:text-5xl text-foreground text-center bg-gradient-to-r from-golden to-golden/70 bg-clip-text text-transparent">
              {category.nameCategory}
            </h3>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-golden rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-golden rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 h-2 bg-golden rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((p, index) => (
            <div
              key={p.idProduct}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
