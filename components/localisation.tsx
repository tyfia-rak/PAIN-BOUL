'use client';

import { Card, CardBody } from '@heroui/react';
import Image from 'next/image';
import { useState } from 'react';

const Localisation = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const openMap = () => setIsMapOpen(true);
  const closeMap = () => setIsMapOpen(false);

  return (
    <>
      <section id="localisation" className="py-20 gradient-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Notre Point de Vente
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-inter">
              Venez nous retrouver dans notre boulangerie chaleureuse, où l'odeur du pain frais vous guide jusqu'à nous
            </p>
          </div>

          <Card
            classNames={{
              base: 'bg-[hsl(var(--card))] border border-border shadow-card overflow-hidden',
            }}
          >
            <div className="flex flex-col lg:flex-row min-h-[500px]">
              <div className="lg:w-5/12">
                <div className="relative h-80 lg:h-full w-full">
                  <Image
                    src="/lieu.webp"
                    alt="Intérieur de la boulangerie Pain-Boul' Triadana"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-golden/5 to-transparent"></div>
                </div>
              </div>

              <div className="lg:w-7/12">
                <CardBody className="p-8 lg:p-12 h-full flex flex-col justify-center">
                  <div className="space-y-8">
                    <div className="border-b border-border/30 pb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-golden/10 rounded-full flex items-center justify-center">
                          <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-golden"
                          >
                            <path 
                              d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" 
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-foreground">
                          PAIN-BOUL'
                        </h3>
                      </div>
                      <p className="text-lg text-muted-foreground font-inter italic pl-16">
                        L'odeur du pain chaud vous guidera jusqu'à nous !
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-golden/10 rounded-lg flex items-center justify-center">
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-golden"
                            >
                              <path 
                                d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" 
                                stroke="currentColor" 
                                strokeWidth="2"
                              />
                              <circle 
                                cx="12" 
                                cy="9" 
                                r="2.5" 
                                stroke="currentColor" 
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                          <h4 className="font-playfair text-xl text-foreground font-semibold">
                            Localisation
                          </h4>
                        </div>
                        <p className="text-muted-foreground font-inter pl-11 leading-relaxed">
                          Notre boulangerie vous accueille juste avant l'hôpital
                          Mpitsabo Mikambana, sur la route d'Ankatso vers
                          l'université.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-golden/10 rounded-lg flex items-center justify-center">
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-golden"
                            >
                              <path 
                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                                stroke="currentColor" 
                                strokeWidth="2"
                              />
                              <path 
                                d="M12 6V12L16 14" 
                                stroke="currentColor" 
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                          <h4 className="font-playfair text-xl text-foreground font-semibold">
                            Horaires
                          </h4>
                        </div>
                        <ul className="space-y-3 text-muted-foreground font-inter pl-11">
                          <li className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-golden rounded-full flex-shrink-0"></div>
                            <span>Lun - Ven : <strong>7h - 18h30</strong></span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-golden rounded-full flex-shrink-0"></div>
                            <span>Samedi : <strong>7h - 12h</strong></span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-golden rounded-full flex-shrink-0"></div>
                            <span>Dimanche : <strong className="text-red-400">Fermé</strong></span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-golden/5 border border-golden/10 rounded-lg p-4">
                      <p className="text-muted-foreground font-inter text-center italic">
                        "Des produits frais, dorés et pleins de saveur préparés chaque jour 
                        avec passion et savoir-faire traditionnel."
                      </p>
                    </div>

                    <div className="flex justify-center pt-4">
                      <button 
                        onClick={openMap}
                        className="group bg-golden text-background px-8 py-4 rounded-lg font-inter font-semibold hover:bg-golden/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-golden/25 flex items-center gap-3"
                      >
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" 
                            stroke="currentColor" 
                            strokeWidth="2"
                          />
                          <circle 
                            cx="12" 
                            cy="9" 
                            r="2.5" 
                            stroke="currentColor" 
                            strokeWidth="2"
                          />
                        </svg>
                        Voir sur la carte
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className="transform group-hover:translate-x-1 transition-transform duration-300"
                        >
                          <path 
                            d="M5 12H19M19 12L12 5M19 12L12 19" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </CardBody>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {isMapOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={closeMap}
        >
          <div 
            className="relative w-full max-w-6xl h-full max-h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeMap}
              className="absolute top-4 right-4 z-10 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-full p-2 transition-all duration-300 transform hover:scale-110"
              aria-label="Fermer la carte"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            <div className="w-full h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.999999999999!2d47.5385047!3d-18.9166609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21f07dbe57306e3d%3A0xd87963caefbc6dae!2sPain-Boul%27!5e0!3m2!1sfr!2smg!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation de Pain-Boul' Triadana"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Localisation;