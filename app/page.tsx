import { About } from "@/components/sections/about";
import { Accueil } from "@/components/sections/accueil";
import { Services } from "@/components/sections/services";
import { Footer } from "@/components/layout/footer";
import Localisation from "@/components/sections/localisation";
import { Navigation } from "@/components/layout/navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Accueil />
      <Localisation />
      <About />
      <Services />
      <Footer />
    </div>
  );
}
