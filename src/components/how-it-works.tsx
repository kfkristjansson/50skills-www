const steps = [
  {
    photo: "\"Too busy\" character at desk",
    number: "01",
    title: "Describe",
    desc: "Tell Navigator what you need in plain language. No templates, no configuration.",
  },
  {
    photo: "Navigator prompt box, typing",
    number: "02",
    title: "Build",
    desc: "AI creates the workflow structure in seconds. Review, adjust, and approve.",
  },
  {
    photo: "\"Stress free\" character, dashboard",
    number: "03",
    title: "Run",
    desc: "Employees interact through portals, email, Slack, or AI. You stay in control.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-24 bg-indigo-5">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        <h2 className="font-[family-name:var(--font-display)] font-bold text-3xl md:text-[40px] leading-[1.05] tracking-[-0.02em] text-center mb-16">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-full aspect-[4/3] bg-indigo-50 rounded-xl mb-6 flex items-center justify-center text-sm text-indigo-300 font-medium px-4">
                [ {step.photo} ]
              </div>
              <div className="text-blue-hl font-[family-name:var(--font-display)] font-bold text-sm mb-2">
                {step.number}
              </div>
              <h3 className="font-[family-name:var(--font-display)] font-bold text-2xl leading-[1.1] mb-2">
                {step.title}
              </h3>
              <p className="text-base text-gray-500 max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
