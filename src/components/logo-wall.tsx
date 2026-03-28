const logos = [
  "Icelandair", "Securitas", "Isavia", "Vodafone", "Hilton",
  "Islandshotel", "Festi", "Domino's", "Samskip", "Samkaup",
  "ELKO", "Wortell", "GRID",
];

const badges = ["Cyber Essentials Plus", "GDPR Compliant"];

export function LogoWall() {
  return (
    <section className="py-12 md:py-16 text-center">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-500 mb-8 block">
          Trusted by leading employers
        </span>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-8">
          {logos.map((name) => (
            <div
              key={name}
              className="h-8 px-5 bg-gray-50 rounded-md flex items-center justify-center text-[11px] text-gray-500 font-medium"
            >
              {name}
            </div>
          ))}
        </div>
        <div className="flex gap-6 justify-center">
          {badges.map((badge) => (
            <div key={badge} className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <span className="w-2 h-2 bg-green rounded-full" />
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
