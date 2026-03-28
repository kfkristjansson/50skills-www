"use client";

import { useState } from "react";

const capabilities = [
  {
    id: "navigator",
    name: "AI Navigator",
    label: "AI-Powered",
    labelColor: "text-purple-hl",
    title: "Describe what you need. Navigator builds it.",
    desc: "Tell Navigator what HR process you need in plain language. It creates the complete workflow — steps, notifications, approvals, integrations — in under 60 seconds.",
    features: [
      "Natural language to working workflow in seconds",
      "Understands HR context — onboarding, offboarding, leave, compliance",
      "Connects to your existing tools automatically",
      "Review, adjust, and approve before going live",
    ],
    cta: "Try Navigator",
    screenshot: "Navigator building a workflow from a prompt",
  },
  {
    id: "workflows",
    name: "Workflow Automation",
    label: "Core Platform",
    labelColor: "text-blue-hl",
    title: "Build any HR process. Run it on autopilot.",
    desc: "From onboarding to offboarding, leave management to credential verification. Design workflows visually or let Navigator build them for you.",
    features: [
      "Visual workflow builder with drag-and-drop",
      "100+ integrations with HRIS, payroll, e-signing, and communication tools",
      "Employee self-service portals",
      "Automated notifications via email, Slack, and Teams",
    ],
    cta: "Explore Journeys",
    screenshot: "Journeys workflow builder with connected steps",
  },
  {
    id: "ai-agents",
    name: "AI Agents",
    label: "New",
    labelColor: "text-orange",
    title: "AI agents that handle employee requests.",
    desc: "Deploy AI agents that answer employee questions, process requests, and trigger workflows — all within your existing communication channels.",
    features: [
      "Handles leave requests, policy questions, IT support",
      "Works in Slack, Teams, and employee portals",
      "Follows your company policies and approval chains",
      "Full audit trail for every AI action",
    ],
    cta: "Learn about AI Agents",
    screenshot: "AI agent responding to an employee in Slack",
  },
];

export function ProductTabs() {
  const [active, setActive] = useState(0);
  const cap = capabilities[active];

  return (
    <section className="py-20 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        <h2 className="font-[family-name:var(--font-display)] font-bold text-3xl md:text-[40px] leading-[1.05] tracking-[-0.02em] text-center mb-12">
          One platform for every HR workflow
        </h2>

        {/* Tab bar */}
        <div className="flex justify-center gap-6 md:gap-8 mb-12 border-b border-gray-100 overflow-x-auto">
          {capabilities.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(i)}
              className={`pb-3 text-base whitespace-nowrap transition-colors border-b-2 ${
                i === active
                  ? "font-semibold text-indigo-400 border-blue-hl"
                  : "font-normal text-gray-500 border-transparent hover:text-indigo-400"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <span className={`text-[11px] font-semibold tracking-[0.08em] uppercase ${cap.labelColor} mb-3 block`}>
              {cap.label}
            </span>
            <h3 className="font-[family-name:var(--font-display)] font-bold text-2xl md:text-[32px] leading-[1.1] tracking-[-0.02em] mb-4">
              {cap.title}
            </h3>
            <p className="text-gray-500 mb-6 max-w-[640px]">{cap.desc}</p>
            <ul className="flex flex-col gap-3 mb-8">
              {cap.features.map((f) => (
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
              {cap.cta}
            </a>
          </div>
          <div className="w-full aspect-[4/3] bg-indigo-400 rounded-2xl flex items-center justify-center text-indigo-5 text-sm font-medium order-first md:order-last px-8 text-center">
            [ {cap.screenshot} ]
          </div>
        </div>
      </div>
    </section>
  );
}
