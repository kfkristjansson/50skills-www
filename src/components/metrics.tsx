const metrics = [
  { number: "130+", label: "Companies across 14 countries" },
  { number: "1M+", label: "Workflow actions processed" },
  { number: "67", label: "NPS score from active customers" },
];

export function Metrics() {
  return (
    <section className="py-20 md:py-24 bg-indigo-5">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {metrics.map((m) => (
            <div key={m.number}>
              <div className="font-[family-name:var(--font-display)] font-black text-5xl md:text-7xl leading-[1] tracking-[-0.03em] text-indigo-400">
                {m.number}
              </div>
              <div className="text-base text-gray-500 mt-2">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
