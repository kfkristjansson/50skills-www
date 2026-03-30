import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { RetainerPricing } from "@/components/retainer-pricing";

export const metadata = {
  title: "Service Retainers — 50skills",
  description:
    "Dedicated expert time for workflow building, integrations, and system design. Flexible retainer packages measured in days per month.",
};

export default function RetainersPage() {
  return (
    <>
      <Nav />
      <main>
        <RetainerPricing />
      </main>
      <Footer />
    </>
  );
}
