import Image from "next/image";

const steps = [
  {
    photo: "/character-overwhelmed.png",
    photoAlt: "Overwhelmed HR manager at cluttered desk — before 50skills",
    number: "01",
    title: "Describe",
    desc: "Tell Navigator what you need in plain language. No templates, no configuration.",
  },
  {
    photo: "/character-busy.png",
    photoAlt: "HR professional navigating complex workflows with AI cards overlaid",
    number: "02",
    title: "Build",
    desc: "AI creates the workflow structure in seconds. Review, adjust, and approve.",
  },
  {
    photo: "/character-stressfree.png",
    photoAlt: "Relaxed HR professional at organized desk — after 50skills automation",
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
              <div className="w-full aspect-[4/3] rounded-xl mb-6 overflow-hidden relative bg-indigo-50">
                <Image
                  src={step.photo}
                  alt={step.photoAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
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
