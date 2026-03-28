"use client";

import { useState } from "react";

const products = [
  {
    id: "journeys",
    name: "Journeys",
    label: "Workflow Automation",
    labelColor: "text-blue-hl",
    title: "Build any HR process. Run it on autopilot.",
    desc: "From onboarding to offboarding, leave management to credential verification. Journeys lets you design workflows visually or describe them to Navigator.",
    features: [
      "AI Navigator builds workflows from natural language",
      "100+ integrations with your existing tools",
      "Employee self-service portals",
      "Automated notifications via email, Slack, and Teams",
    ],
    cta: "Explore Journeys",
    screenshot: "Journeys product screenshot",
  },
  {
    id: "hire",
    name: "50hire",
    label: "Applicant Tracking",
    labelColor: "text-orange",
    title: "Hire faster. From job post to first day.",
    desc: "A modern ATS that connects directly to your Journeys workflows. Post jobs, review candidates, and trigger onboarding automatically.",
    features: [
      "Multi-channel job posting",
      "Collaborative candidate scoring",
      "Automated interview scheduling",
      "Seamless handoff to Journeys onboarding",
    ],
    cta: "Explore 50hire",
    screenshot: "50hire product screenshot",
  },
];

export function ProductTabs() {
  const [active, setActive] = useState(0);
  const product = products[active];

  return (
    <section className="py-20 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        <h2 className="font-[family-name:var(--font-display)] font-bold text-3xl md:text-[40px] leading-[1.05] tracking-[-0.02em] text-center mb-12">
          Everything you need to run HR
        </h2>

        {/* Tab bar */}
        <div className="flex justify-center gap-8 mb-12 border-b border-gray-100">
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              className={`pb-3 text-base transition-colors border-b-2 ${
                i === active
                  ? "font-semibold text-indigo-400 border-blue-hl"
                  : "font-normal text-gray-500 border-transparent hover:text-indigo-400"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <span className={`text-[11px] font-semibold tracking-[0.08em] uppercase ${product.labelColor} mb-3 block`}>
              {product.label}
            </span>
            <h3 className="font-[family-name:var(--font-display)] font-bold text-2xl md:text-[32px] leading-[1.1] tracking-[-0.02em] mb-4">
              {product.title}
            </h3>
            <p className="text-gray-500 mb-6 max-w-[640px]">{product.desc}</p>
            <ul className="flex flex-col gap-3 mb-8">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[15px] text-gray-500">
                  <span className="w-5 h-5 min-w-[20px] bg-green rounded-full mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="inline-flex items-center h-11 px-6 bg-blue-hl hover:bg-blue-hl-hover text-white text-[15px] font-medium rounded-lg transition-colors"
            >
              {product.cta}
            </a>
          </div>
          <div className="w-full aspect-[4/3] bg-indigo-400 rounded-2xl flex items-center justify-center text-indigo-5 text-sm font-medium order-first md:order-last">
            [ {product.screenshot} ]
          </div>
        </div>
      </div>
    </section>
  );
}
