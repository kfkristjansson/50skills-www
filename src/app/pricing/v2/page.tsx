import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PricingPlansV2 } from "@/components/pricing-plans-v2";

export const metadata = {
  title: "Pricing v2 — 50skills Journeys",
  description:
    "Guided pricing with credit sliders and enterprise package builder.",
};

export default function PricingV2Page() {
  return (
    <>
      <Nav />
      <main>
        <PricingPlansV2 />
      </main>
      <Footer />
    </>
  );
}
