import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { LogoWall } from "@/components/logo-wall";
import { HowItWorks } from "@/components/how-it-works";
import { ProductTabs } from "@/components/product-tabs";
import { IndustryCards } from "@/components/industry-cards";
import { Vision } from "@/components/vision";
import { Metrics } from "@/components/metrics";
import { Integrations } from "@/components/integrations";
import { DualCta } from "@/components/dual-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoWall />
        <HowItWorks />
        <ProductTabs />
        <IndustryCards />
        <Vision />
        <Metrics />
        <Integrations />
        <DualCta />
      </main>
      <Footer />
    </>
  );
}
