'use client';

import { Card, CardBody } from '@heroui/react';

export const Services = () => {
  const services = [
    {
      title: "COMMANDE SUR PLACE",
      description: "Dégustez nos spécialités dans un cadre convivial et chaleureux",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "LIVRAISON",
      description: "Faites vous livrer vos plats préférés en un temps record",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "A EMPORTER",
      description: "Commandez et emportez vos plats favoris",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      title: "DRIVE",
      description: "Commandez et récupérez en toute simplicité, sans sortir de votre voiture",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-background to-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-foreground mb-6">
            NOS SERVICES
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto font-inter">
            Oui, côté sucré et côté salé, si vous commandez avant 16h, vous êtes livré(e) le jour même. Toute commande de pain passée aujourd’hui sera prête pour le lendemain — sauf si votre pain est déjà sorti du four !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              classNames={{
                base: 'bg-[hsl(var(--card))] border border-border shadow-card h-full transition-all duration-300 hover:shadow-golden hover:-translate-y-2 group',
              }}
            >
              <CardBody className="p-8 text-center">
                <div className="flex flex-col items-center space-y-6">
                  {/* Icône */}
                  <div className="w-20 h-20 bg-golden/10 rounded-full flex items-center justify-center text-golden group-hover:bg-golden group-hover:text-background transition-all duration-300">
                    {service.icon}
                  </div>

                  {/* Titre */}
                  <h3 className="font-playfair text-xl font-bold text-foreground group-hover:text-golden transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground font-inter leading-relaxed">
                    {service.description}
                  </p>

                  {/* Ligne décorative */}
                  <div className="w-16 h-1 bg-golden rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};