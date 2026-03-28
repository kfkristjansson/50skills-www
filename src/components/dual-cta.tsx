export function DualCta() {
  return (
    <section className="py-20 md:py-24 bg-indigo-5">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Self-serve */}
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center">
            <h3 className="font-[family-name:var(--font-display)] font-bold text-2xl md:text-[28px] leading-[1.1] mb-4">
              Ready to try Navigator?
            </h3>
            <p className="text-gray-500 mb-8">
              Describe what you need and see it built in seconds.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                placeholder="Describe your workflow..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-indigo-400 placeholder:text-gray-200 px-2 py-2"
              />
              <button className="bg-blue-hl hover:bg-blue-hl-hover text-white rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors shrink-0">
                Try free →
              </button>
            </div>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center flex flex-col">
            <h3 className="font-[family-name:var(--font-display)] font-bold text-2xl md:text-[28px] leading-[1.1] mb-4">
              Need a guided demo?
            </h3>
            <p className="text-gray-500 mb-8">
              Our team will show you how 50skills fits your organization.
            </p>
            <a
              href="#"
              className="mt-auto w-full flex items-center justify-center h-12 bg-blue-hl hover:bg-blue-hl-hover text-white text-[15px] font-medium rounded-lg transition-colors"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
