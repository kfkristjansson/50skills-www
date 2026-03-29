import { Suspense } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PricingBusinessCase } from "@/components/pricing-business-case";

export const metadata = {
  title: "Credit Calculator — 50skills Journeys",
  description:
    "Estimate your credit usage and build your business case. See all credit tier options across Business, Premium, and Enterprise plans.",
};

export default function CalculatorPage() {
  return (
    <>
      <Nav />
      <main>
        <Suspense>
          <PricingBusinessCase />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
