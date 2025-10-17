'use client'

import { Card, CardBody, CardHeader } from '@heroui/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const Products = () => {
  const products = [
    {
      title: "Chocolats",
      description: "Offrez du chocolat à vos proches , à ceux que vous aimez ou à vous-même !",
      image: "/chocolat.jpg",
      items: ["Barres aux fruits secs", "Les  merveilleux", "Bonbons insert café"]
    },
    {
      title: "Cake",
      description: "Plongez dans la douceur d’un cake traditionnel, fait maison avec des ingrédients de qualité et une bonne dose d’amour.",
      image: "/cake.jpeg",
      items: ["Bentos cakes", "Napolitains", "Cake au beurre"]
    },
    {
      title: "Pains",
      description: "Retrouvez le vrai goût du pain avec notre pain maison, pétri et cuit chaque jour à la main avec des ingrédients simples, naturels et de qualité.",
      image: "/pain-sesame.jpeg",
      items: ["Pains boules", "pains doré", "Pain de mie complet"]
    },
    {
      title: "Tartes",
      description: "Tartes de saison aux fruits frais et pâte croustillante maison.",
      image: "/cake.jpeg",
      items: ["Tarte aux Fraises", "Tarte Citron Meringuée", "Tarte aux Pommes", "Tarte Chocolat"]
    },
    {
      title: "Chocolats",
      description: "Ganaches fines, pralinés croustillants, tablettes artisanales.",
      image: "/carre-rouge.jpeg",
      items: ["Ganache Noire", "Praliné Noisette", "Tablette Lait", "Rochers Maison"]
    },
    {
      title: "Snacking",
      description: "Petite restauration: frais, rapide et gourmand pour le midi.",
      image: "/biscuit.jpeg",
      items: ["Sandwich Poulet", "Focaccia Tomates", "Quiche Lorraine", "Salade César"]
    }
  ]

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  useEffect(() => {
    const updateScrollButtons = () => {
      const el = scrollContainerRef.current
      if (!el) return
      setCanScrollPrev(el.scrollLeft > 0)
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    }

    updateScrollButtons()

    const el = scrollContainerRef.current
    if (!el) return

    el.addEventListener('scroll', updateScrollButtons, { passive: true })
    window.addEventListener('resize', updateScrollButtons)

    return () => {
      el.removeEventListener('scroll', updateScrollButtons)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [])

  const scrollByPage = (direction: number) => {
    const el = scrollContainerRef.current
    if (!el) return
    const amount = el.clientWidth * 0.9
    el.scrollBy({ left: amount * direction, behavior: 'smooth' })
  }

  return (
    <section id="produits" className="py-20 gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Nos Créations
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
            Chaque jour, nos boulangers-pâtissiers sélectionnent les meilleurs ingrédients 
            pour vous offrir des produits d'exception, dans le respect de la tradition Malgache.
          </p>
        </div>

        <div className="relative" role="region" aria-label="Carrousel des produits">
          <button
            type="button"
            aria-label="Précédent"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-foreground/10 text-foreground backdrop-blur-md transition-opacity ${!canScrollPrev ? 'opacity-40 cursor-not-allowed' : 'hover:bg-foreground/20'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {products.map((product, index) => (
              <div
                key={index}
                className="snap-start shrink-0 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Card 
                  classNames={{
                    base: "h-full bg-[hsl(var(--card))] border border-border shadow-card transition-all duration-300 transform hover:-translate-y-2 hover:shadow-golden group",
                  }}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <CardHeader className='flex flex-col items-start'>
                    <h3 className="font-playfair text-2xl text-foreground group-hover:text-golden transition-colors duration-300">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground font-inter">
                      {product.description}
                    </p>
                  </CardHeader>
                  
                  <CardBody>
                    <ul className="space-y-2">
                      {product.items.map((item, itemIndex) => (
                        <li 
                          key={itemIndex}
                          className="flex items-center text-sm text-muted-foreground font-inter"
                        >
                          <div className="w-2 h-2 bg-golden rounded-full mr-3 flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Suivant"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-foreground/10 text-foreground backdrop-blur-md transition-opacity ${!canScrollNext ? 'opacity-40 cursor-not-allowed' : 'hover:bg-foreground/20'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Products