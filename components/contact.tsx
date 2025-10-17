'use client';

import { Button, Card, CardBody, CardHeader } from '@heroui/react'

export const Contact = () => {
    return (
        <section id="contact" className="py-20 bg-gradient-to-br from-background to-warm-gray">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-foreground mb-6">
                        Nous Trouver
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                        Venez découvrir notre boulangerie et goûter à l&apos;authenticité de nos produits artisanaux.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    <Card classNames={{ base: "bg-[hsl(var(--card))] border border-border shadow-card" }}>
                        <CardHeader>
                            <h3 className="font-playfair text-2xl text-foreground flex items-center">
                                <svg className="w-6 h-6 text-golden mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Adresse
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div>
                                <p className="font-inter text-foreground font-medium">Pain Boul</p>
                                <p className="text-muted-foreground font-inter">
                                    Route d’Ankatso , Antananarivo, Madagascar, 101</p>
                                <p className="text-muted-foreground font-inter">Antananarivo, Madagascar</p>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <div className="flex items-center mb-3">
                                    <svg className="w-5 h-5 text-golden mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-foreground font-inter">034 05 078 68</span>
                                </div>

                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-golden mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-foreground font-inter">aupainboul@gmail.com</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card classNames={{ base: "bg-[hsl(var(--card))] border border-border shadow-card" }}>
                        <CardHeader>
                            <h3 className="font-playfair text-2xl text-foreground flex items-center">
                                <svg className="w-6 h-6 text-golden mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Horaires d&apos;ouverture
                            </h3>
                            <p className="font-inter text-muted-foreground">
                                Nous vous accueillons tous les jours sauf le dimanche
                            </p>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <span className="font-inter text-foreground">Lundi - Vendredi</span>
                                    <span className="font-inter text-muted-foreground">6h30 - 19h30</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <span className="font-inter text-foreground">Samedi</span>
                                    <span className="font-inter text-muted-foreground">7h00 - 19h00</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-inter text-foreground">Dimanche</span>
                                    <span className="font-inter text-red-500">Fermé</span>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-golden/10 rounded-lg border border-golden/20">
                                <p className="text-sm text-golden font-inter font-medium">
                                    🥖 Nos baguettes tradition sont cuites toutes les 2 heures pour une fraîcheur optimale !
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className="text-center mt-12">
                    <Button
                        size="lg"
                        className="gradient-golden text-charcoal font-semibold text-lg px-8 py-6 shadow-golden"
                        radius="sm"
                    >
                        Nous rendre visite
                    </Button>
                </div>
            </div>
        </section>
    )
}