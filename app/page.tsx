import { About } from "@/components/about";
import { Accueil } from "@/components/accueil";
import { Services } from "@/components/services";
import { Footer } from "@/components/footer";
import Localisation from "@/components/localisation";
import { Navigation } from "@/components/navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Accueil />
      <Localisation/>
      <About />
      <Services />
      <Footer />
    </div>
  )
}