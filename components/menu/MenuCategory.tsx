'use client'

import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { Category, Product } from '@/types'
import { BACKEND_URL } from '@/lib/config'

export default function MenuCategory({ category }: { category: Category }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchProducts = async () => {
      try {
        // Fetch all products first
        const res = await fetch(`${BACKEND_URL}/products`)
        if (!res.ok) throw new Error('Failed to fetch products')
        const data = await res.json()
        // Filter products that belong to this category
        const categoryProducts = Array.isArray(data) 
          ? data.filter(p => p.categoryName?.toLowerCase() === category.nameCategory.toLowerCase())
          : []
        if (mounted) setProducts(categoryProducts)
      } catch (e) {
        console.error('Error fetching products for category:', category.nameCategory, e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchProducts()
    return () => { mounted = false }
  }, [category.nameCategory])

  if (products.length === 0 && !loading) {
    return null; // Ne pas afficher les catégories vides
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="font-playfair text-2xl text-foreground">{category.nameCategory}</h3>
        <div className="flex-1 h-[1px] bg-border/40" />
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Chargement des produits...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.idProduct} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}
