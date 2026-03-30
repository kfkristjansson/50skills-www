import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CreditTiers } from "@/components/credit-tiers";

export const metadata = {
  title: "Credit Overview — 50skills Journeys",
  description:
    "All Journeys credit tiers at a glance. See pricing across Business, Premium, and Enterprise plans in your currency.",
};

export default function OverviewPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <CreditTiers />
      </main>
      <Footer />
    </>
  );
}
