import { About } from "@/components/about";
import { Accueil } from "@/components/accueil";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import Products from "@/components/products";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Accueil />
      <Products />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}