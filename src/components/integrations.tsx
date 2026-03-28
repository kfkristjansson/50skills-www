const groups = [
  { label: "HRIS", logos: ["BambooHR", "HiBob", "Personio"] },
  { label: "Payroll", logos: ["Deel", "Remote", "Papaya"] },
  { label: "E-Sign", logos: ["DocuSign", "Taktikal", "Adobe"] },
  { label: "Communication", logos: ["Slack", "Teams", "Gmail"] },
];

export function Integrations() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        <h2 className="font-[family-name:var(--font-display)] font-bold text-3xl md:text-[40px] leading-[1.05] tracking-[-0.02em] text-center mb-12">
          Works with your tools
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {groups.map((g) => (
            <div key={g.label}>
              <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-500 mb-4 block">
                {g.label}
              </span>
              <div className="flex flex-wrap gap-3">
                {g.logos.map((logo) => (
                  <div
                    key={logo}
                    className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-[9px] text-gray-500 font-medium"
                  >
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center h-11 px-6 border border-gray-100 hover:bg-indigo-5 hover:border-indigo-50 text-indigo-400 text-[15px] font-medium rounded-lg transition-colors"
          >
            View all 100+ integrations
          </a>
        </div>
      </div>
    </section>
  );
}
