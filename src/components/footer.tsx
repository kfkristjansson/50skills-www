import Image from "next/image";

const columns = [
  {
    title: "Platform",
    links: ["Workflow Automation", "AI Navigator", "AI Agents", "Integrations", "Templates", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Customers", "Blog", "Careers", "Contact"],
  },
  {
    title: "Resources",
    links: ["Help Center", "Security", "API Docs", "FAQ"],
  },
];

export function Footer() {
  return (
    <footer className="bg-blue-400 text-white pt-20 pb-10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Image src="/logo-white.svg" alt="50skills" width={120} height={25} />
            </div>
            <p className="text-sm text-white/60 max-w-[280px] leading-relaxed mb-4">
              AI-powered HR workflow automation. Built in Reykjavik.
            </p>
            <p className="text-xs text-white/40">
              Also by 50skills: <a href="https://50hire.com" className="text-white/50 hover:text-white/70 underline transition-colors">50hire.com</a>
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
