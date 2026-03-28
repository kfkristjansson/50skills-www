const industries = [
  {
    name: "Hospitality",
    desc: "Multi-location onboarding and shift-based workforce management.",
  },
  {
    name: "Retail",
    desc: "Fast-track hiring and training for seasonal peaks.",
  },
  {
    name: "Healthcare",
    desc: "Certification tracking and compliance-heavy onboarding.",
  },
  {
    name: "Banking",
    desc: "Regulated onboarding with audit trails for every step.",
  },
];

export function IndustryCards() {
  return (
    <section className="py-20 md:py-24 bg-indigo-5">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        <h2 className="font-[family-name:var(--font-display)] font-bold text-3xl md:text-[40px] leading-[1.05] tracking-[-0.02em] mb-12">
          Built for complex industries
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2 gap-4">
          {/* Hero card */}
          <div className="md:row-span-2 bg-indigo-400 text-white rounded-2xl p-8 flex flex-col justify-end">
            <div className="flex-1 bg-indigo-300 rounded-xl mb-6 min-h-[200px] flex items-center justify-center text-sm text-indigo-5 font-medium">
              [ Aviation customer photo ]
            </div>
            <h3 className="font-[family-name:var(--font-display)] font-bold text-2xl md:text-[28px] leading-[1.1] mb-2">
              Aviation
            </h3>
            <p className="text-indigo-5 text-[15px]">
              Credential verification, seasonal staffing, compliance tracking for airlines and airports.
            </p>
            <p className="text-indigo-5/70 text-sm italic mt-4 pt-4 border-t border-white/15">
              &quot;50skills transformed how we onboard 400 seasonal workers every summer.&quot; — Isavia
            </p>
          </div>

          {/* Secondary cards */}
          {industries.map((ind) => (
            <div
              key={ind.name}
              className="bg-white rounded-2xl p-8 border border-transparent hover:border-indigo-50 transition-colors"
            >
              <h3 className="font-[family-name:var(--font-display)] font-bold text-xl mb-2">
                {ind.name}
              </h3>
              <p className="text-gray-500 text-sm">{ind.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
