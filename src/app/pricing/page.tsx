import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PricingPlans } from "@/components/pricing-plans";
import { CreditTiers } from "@/components/credit-tiers";

export const metadata = {
  title: "Pricing — 50skills Journeys",
  description:
    "Plans that grow with your team. Transparent pricing with live support and AI-powered workflow automation included.",
};

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main>
        <PricingPlans />
        <CreditTiers />
      </main>
      <Footer />
    </>
  );
}
