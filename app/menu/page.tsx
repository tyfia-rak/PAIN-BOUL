"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useMemo, useState } from "react";

type MenuItem = { name: string; price: string; note?: string };
type Section = { title: string; items: MenuItem[] };

const allSections: Section[] = [
  {
    title: "Pâtisserie de Boulangerie",
    items: [
      { name: "Croissant", price: "3 500 Ar" },
      { name: "Pain au chocolat", price: "4 000 Ar" },
      { name: "Cheesecake", price: "9 500 Ar", note: "portion" },
      { name: "Brownies", price: "9 000 Ar" },
      { name: "Cake au beurre", price: "13 500 Ar" },
      { name: "Tarte citron / Tarte chocolat", price: "9 500 Ar" },
      { name: "Mousse duo", price: "9 000 Ar" },
      { name: "Cookies", price: "8 000 Ar" },
      { name: "Pudding", price: "4 500 Ar" },
      { name: "Salade de fruits", price: "3 000 / 7 500 Ar" },
      { name: "Yaourt", price: "3 000 Ar" },
    ],
  },
  {
    title: "Café",
    items: [
      { name: "Espresso", price: "7K" },
      { name: "Cappuccino", price: "9,5K" },
      { name: "Mochaccino", price: "13K" },
      { name: "Latte Macchiato", price: "12K" },
      { name: "Café au lait", price: "12K" },
      { name: "Ube latte", price: "12,5K" },
      { name: "Matcha latte", price: "12,5K" },
      { name: "Chocolat chaud", price: "8,5K" },
    ],
  },
  {
    title: "Thé & Cacao",
    items: [
      { name: "Thé citron", price: "5K" },
      { name: "Thé cosse cacao", price: "4K" },
      { name: "Grog (miel-citron-gingembre)", price: "8,5K" },
      { name: "Cacao hibiscus / cannelle", price: "5K" },
      { name: "Cacao vanille", price: "5K" },
    ],
  },
  {
    title: "Sucrés (Bento & Tartes)",
    items: [
      { name: "Bento crème au beurre", price: "25K" },
      { name: "Bento Forêt Noire", price: "35K" },
      { name: "Bento Red Velvet", price: "35K" },
      { name: "Tarte citron", price: "9,5K" },
      { name: "Cheesecake meringué", price: "11,5K" },
      { name: "Pudding", price: "4,5K" },
    ],
  },
  {
    title: "Salés & Snack",
    items: [
      { name: "Pizza Focaccia", price: "7,5K" },
      { name: "Quiche", price: "8,7K" },
      { name: "Hamburger poulet", price: "15K" },
      { name: "Nuggets frites", price: "12,5K" },
      { name: "Panini", price: "15K" },
      { name: "Sandwich vietnamien", price: "15K" },
    ],
  },
  {
    title: "Nos Pains",
    items: [
      { name: "Baguette à l'ancienne", price: "3 500 Ar" },
      { name: "Baguette", price: "2 500 Ar" },
      { name: "Pain filet", price: "900 Ar" },
      { name: "Demi baguette", price: "1 400 Ar" },
      { name: "Pain pointu", price: "900 Ar" },
      { name: "Pain petit gros", price: "1 500 Ar" },
      { name: "Pain long", price: "2 700 Ar" },
      { name: "Pain complet PM/GM", price: "2 800 / 6 000 Ar" },
      { name: "Pain sésame noir & blanc", price: "2 800 Ar" },
      { name: "Pain ail fines herbes", price: "2 800 Ar" },
      { name: "Pain olives herbes", price: "6 000 Ar" },
      { name: "Panini (pain)", price: "1 800 Ar" },
      { name: "Ciabatta", price: "4 000 Ar" },
      { name: "Pavé rustique", price: "4 000 Ar" },
      { name: "Campagne complet lin sésame noir", price: "9 500 Ar" },
      { name: "Brioche choco /10", price: "9 000 Ar" },
      { name: "Chapelure (350gr)", price: "2 200 Ar" },
      { name: "Pain hot-dog /2", price: "5 000 Ar" },
      { name: "Pain viennois /10", price: "6 000 Ar" },
      { name: "Pain viennois choco /3", price: "5 000 Ar" },
    ],
  },
  {
    title: "Pains spéciaux & mie",
    items: [
      { name: "Hamburger classique GM", price: "6 000 Ar" },
      { name: "Mini hamburger (15)", price: "6 000 Ar / unité" },
      { name: "Cracotte nature", price: "5 000 Ar" },
      { name: "Cracotte complète", price: "8 000 Ar" },
      { name: "Pain boule avec sésame", price: "600 Ar (nature)" },
      { name: "Pain de mie nature bombé (carré)", price: "7 000 Ar" },
      { name: "Pain de mie complet", price: "12 000 Ar" },
      { name: "Pain de mie seigle / complet", price: "12 000 Ar" },
      { name: "Pain de mie brioché", price: "12 000 Ar" },
      { name: "Spéciaux petit format sésame noir & blanc", price: "7 000 Ar" },
      { name: "Spéciaux ail herbes de Provence", price: "7 000 Ar" },
    ],
  },
  {
    title: "Sandwichs & Panini",
    items: [
      { name: "Sandwich vietnamien", price: "15 000 Ar" },
      { name: "Club sandwich (jambon ou poulet)", price: "9 500 Ar" },
      { name: "Sandwich poulet", price: "9 500 Ar" },
      { name: "Sandwich thon", price: "9 500 Ar" },
      { name: "Sandwich jambon fromage", price: "12 500 Ar" },
      { name: "Sandwich poulet curry", price: "12 500 Ar" },
      { name: "Sandwich végétarien", price: "12 500 Ar" },
      { name: "Panini jambon fromage", price: "15 000 Ar" },
      { name: "Panini poulet fromage", price: "15 000 Ar" },
      { name: "Panini végétarien", price: "12 500 Ar" },
      { name: "Hamburger poulet / viande", price: "15 000 Ar" },
      { name: "Quiche jambon", price: "8 700 Ar" },
      { name: "Quiche végétarienne", price: "7 900 Ar" },
      { name: "Pizza carrée portion", price: "7 500 Ar" },
      { name: "Croissant jambon fromage", price: "12 000 Ar" },
      { name: "Formule (sandwich + frites + jus)", price: "17 500 Ar", note: "poulet ou thon" },
      { name: "Supplément ingrédients viande", price: "6 000 Ar" },
      { name: "Supplément ingrédients légumes", price: "4 000 Ar" },
      { name: "Frites", price: "7 500 Ar" },
    ],
  },
  {
    title: "Petit déjeuner",
    items: [
      { name: "Classique (boisson chaude + viennoiserie + jus)", price: "13 500 Ar" },
      { name: "Complet (omelette jambon fromage ou fines herbes)", price: "17 500 Ar" },
      { name: "Croque pain de mie toasté", price: "—" },
    ],
  },
  {
    title: "Jus naturels & Detox",
    items: [
      { name: "Ananas menthe", price: "5 000 Ar" },
      { name: "Grenadelle", price: "5 000 Ar" },
      { name: "Carotte citron", price: "5 000 Ar" },
      { name: "Corossol", price: "5 000 Ar" },
      { name: "Gingembre", price: "5 000 Ar" },
      { name: "Tamarin / Fraise (saison)", price: "5 000 Ar" },
      { name: "Persil", price: "5 000 Ar" },
      { name: "Persil citron", price: "5 000 Ar" },
      { name: "Citron", price: "5 000 Ar" },
      { name: "Cocktail du jour", price: "7 000 Ar", note: "pastèque-gingembre-citron-menthe" },
      { name: "Detox (gingembre-menthe-ananas-concombre)", price: "6 000 Ar" },
    ],
  },
  {
    title: "Spaghettis & Formules midi",
    items: [
      { name: "Velouté de légumes de saison", price: "10 000 Ar" },
      { name: "Spaghetti bolognaise", price: "15 000 Ar" },
      { name: "Fettuccine", price: "15 000 Ar" },
      { name: "Fettuccine crevettes", price: "20 000 Ar" },
      { name: "Formule Bolognaise + jus naturel + pain", price: "17 500 Ar" },
      { name: "Formule Nouilles sautées + jus naturel", price: "17 500 Ar" },
    ],
  },
  {
    title: "Salades",
    items: [
      { name: "Salade macédoine de légumes (thon ou jambon)", price: "17 500 Ar" },
      { name: "Purée maison aux baies roses + jambon", price: "17 500 Ar" },
      { name: "Salade César", price: "17 500 Ar" },
      { name: "Salade Niçoise", price: "17 500 Ar" },
      { name: "Salade (poulet ou thon ou surimi)", price: "17 500 Ar" },
      { name: "Salade chic de pâtes italiennes", price: "17 500 Ar" },
      { name: "Taboulé", price: "18 500 Ar" },
    ],
  },
];

type Tab = { key: string; title: string; section: Section };

export default function MenuPage() {
  const [activeKey, setActiveKey] = useState<string>("patisserie");

  const tabs: Tab[] = useMemo(() => {
    const find = (text: string) => allSections.find((s) => s.title.includes(text));

    const unique = (items: MenuItem[]) => {
      const seen = new Set<string>();
      return items.filter((it) => {
        const key = it.name.trim().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };

    const boissons: Section = {
      title: "Café & Thé",
      items: unique([...(find("Café")?.items || []), ...(find("Thé")?.items || [])]),
    };

    const jus: Section = {
      title: "Jus & Detox",
      items: unique([...(find("Jus naturels")?.items || []), ...(find("Detox")?.items || [])]),
    };

    const pains: Section = {
      title: "Pains",
      items: unique([...(find("Nos Pains")?.items || []), ...(find("Pains spéciaux")?.items || [])]),
    };

    const plats: Section = {
      title: "Plats & Spaghettis",
      items: unique([...(find("Spaghettis")?.items || []), ...(find("Formules midi")?.items || []), ...(find("Velouté")?.items || [])]),
    };

    return [
      { key: "patisserie", title: "Pâtisserie", section: find("Pâtisserie") || { title: "Pâtisserie", items: [] } },
      { key: "sucre", title: "Sucrés", section: find("Sucrés") || { title: "Sucrés", items: [] } },
      { key: "boissonschaudes", title: "Café & Thé", section: boissons },
      { key: "jus", title: "Jus", section: jus },
      { key: "pains", title: "Pains", section: pains },
      { key: "sandwichs", title: "Sandwichs & Panini", section: find("Sandwichs") || { title: "Sandwichs & Panini", items: [] } },
      { key: "sales", title: "Salés & Snack", section: find("Salés") || { title: "Salés & Snack", items: [] } },
      { key: "petitdej", title: "Petit déjeuner", section: find("Petit déjeuner") || { title: "Petit déjeuner", items: [] } },
      { key: "plats", title: "Plats", section: plats },
      { key: "salades", title: "Salades", section: find("Salades") || { title: "Salades", items: [] } },
    ];
  }, []);

  const current = tabs.find((t) => t.key === activeKey)?.section || tabs[0].section;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <header className="relative overflow-hidden">
        <div
          className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-16 text-center"
        >
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold tracking-wide">
            NOTRE MENU
          </h1>
          <div className="flex items-center justify-center gap-2 my-4">
            <span className="w-12 h-[2px] bg-golden/20" />
            <span className="w-2 h-2 rounded-full bg-golden" />
            <span className="w-2 h-2 rounded-full bg-golden/80" />
            <span className="w-2 h-2 rounded-full bg-golden" />
            <span className="w-12 h-[2px] bg-golden/20" />
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto pb-8">
            Nos points de vente vous proposent des produits faits maison: pizzas, sandwichs, plats rapides, desserts, cafés, thés et jus naturels.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-wrap items-center justify-start gap-3 mb-12 px-2 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveKey(tab.key)}
              className={`px-6 py-2 rounded-md border transition-colors font-inter ${
                activeKey === tab.key
                  ? "bg-golden text-charcoal border-transparent shadow-golden"
                  : "bg-transparent text-foreground border-border hover:border-golden hover:text-golden"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <section className="bg-[hsl(var(--card))] border border-border rounded-xl p-6 shadow-card">
          <h2 className="font-playfair text-2xl text-foreground mb-6">{current.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {current.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-baseline">
                <span className="text-foreground font-inter">{item.name}</span>
                <span className="mx-3 flex-1 border-b border-dotted border-border opacity-60" />
                <span className="text-golden font-semibold whitespace-nowrap">{item.price}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


