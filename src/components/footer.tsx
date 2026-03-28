const columns = [
  {
    title: "Products",
    links: ["Journeys", "50hire", "Integrations", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Customers", "Blog", "Careers"],
  },
  {
    title: "Resources",
    links: ["Help Center", "Security", "API Docs", "Status"],
  },
];

export function Footer() {
  return (
    <footer className="bg-blue-400 text-white pt-20 pb-10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-[family-name:var(--font-display)] font-bold text-xl flex items-center gap-2 mb-4">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <rect width="14" height="14" fill="white" />
                <rect x="14" y="14" width="14" height="14" fill="white" />
                <rect y="14" width="14" height="14" fill="rgba(255,255,255,0.5)" />
                <rect x="14" width="14" height="14" fill="rgba(255,255,255,0.5)" />
              </svg>
              50skills
            </div>
            <p className="text-sm text-white/60 max-w-[280px] leading-relaxed">
              AI-powered HR workflow automation. Built in Reykjavik.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold tracking-[0.08em] uppercase text-indigo-5/60 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[15px] text-white/80 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[13px] text-white/50">Built in Reykjavik</span>
          <div className="flex gap-6">
            <a href="#" className="text-[13px] text-white/50 hover:text-white/80 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[13px] text-white/50 hover:text-white/80 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
