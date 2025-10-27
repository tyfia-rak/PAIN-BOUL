'use client'

import { Button } from '@heroui/react'
import Image from 'next/image'

export const Accueil = () => {
      return (
    <section id="accueil" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/ensemble.jpg"
          alt="Boulangerie pain boule"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
        <div className="lg:w-1/2">
          <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Pain Boul
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-4 font-playfair font-medium">
            Boulangerie Artisanale
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl font-inter font-light leading-relaxed">
            Depuis 2018, nous perpétuons la tradition boulangère Malgache avec passion. 
            Découvrez nos pains artisanaux, viennoiseries et pâtisseries préparés quotidiennement 
            avec des ingrédients locaux.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="/menu">
              <Button 
                size="lg" 
                className="gradient-golden text-charcoal font-semibold text-lg px-8 py-6 shadow-golden"
                radius="sm"
              >
                Nos Menu
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-golden"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}