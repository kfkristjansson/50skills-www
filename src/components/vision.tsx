export function Vision() {
  return (
    <section className="py-24 md:py-32 text-center">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-500 mb-4 block">
          Our thesis
        </span>
        <h2 className="font-[family-name:var(--font-display)] font-bold text-3xl md:text-5xl leading-[1.05] tracking-[-0.02em] max-w-[800px] mx-auto mb-6 text-indigo-400">
          &ldquo;People Operators are the Future of HR&rdquo;
        </h2>
        <p className="text-lg text-gray-500 max-w-[640px] mx-auto mb-6">
          HR is evolving from administrative overhead to strategic operations. The companies that
          automate the tedious work will free their people teams to do what matters — building
          culture, developing talent, and driving the business forward.
        </p>
        <a href="#" className="text-blue-hl hover:text-blue-hl-hover text-[15px] font-medium transition-colors">
          Read the full article &rarr;
        </a>
        <div className="text-sm font-medium text-gray-500 mt-6">
          Kristjan Kristjansson, CEO &amp; Co-founder
        </div>
      </div>
    </section>
  );
}
