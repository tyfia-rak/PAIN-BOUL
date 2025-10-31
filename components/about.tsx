export const About = () => {
  return (
    <section id="apropos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Notre Histoire
            </h2>
            <div className="space-y-6 text-muted-foreground font-inter leading-relaxed">
              <p className="text-lg">
                Pain-Boul est une boulangerie artisanale malgache créée en 2018
                et située à Tsiadana, juste avant l’Hôpital Mpitsabo Mikambana,
                sur la route d’Ankatso vers l’université.
              </p>
              <p>
                Elle se distingue par la fabrication de pains, viennoiseries et
                pâtisseries de qualité, élaborés à partir de produits locaux
                soigneusement sélectionnés. Mettant en avant le savoir-faire
                artisanal malgache, Pain-Boul s’engage à offrir à sa clientèle
                des produits frais, savoureux et authentiques, tout en soutenant
                les producteurs locaux.
              </p>
              <p>
                Laissez-vous simplement guider par l’odeur du pain chaud qui
                vous mènera jusqu’à nous !
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-golden font-playfair mb-2">
                  3
                </div>
                <div className="text-sm text-muted-foreground font-inter">
                  Années d&apos;expérience
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden font-playfair mb-2">
                  1
                </div>
                <div className="text-sm text-muted-foreground font-inter">
                  Générations
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden font-playfair mb-2">
                  50+
                </div>
                <div className="text-sm text-muted-foreground font-inter">
                  Recettes artisanales
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="gradient-golden rounded-2xl p-8 shadow-golden">
              <h3 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                Notre Engagement
              </h3>
              <ul className="space-y-4 text-charcoal">
                <li className="flex items-start font-inter">
                  <svg
                    className="w-5 h-5 text-charcoal mt-1 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Ingrédients locaux et de qualité supérieure</span>
                </li>
                <li className="flex items-start font-inter">
                  <svg
                    className="w-5 h-5 text-charcoal mt-1 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Méthodes artisanales traditionnelles</span>
                </li>
                <li className="flex items-start font-inter">
                  <svg
                    className="w-5 h-5 text-charcoal mt-1 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Fraîcheur garantie tous les jours</span>
                </li>
                <li className="flex items-start font-inter">
                  <svg
                    className="w-5 h-5 text-charcoal mt-1 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Respect de l'environnement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
