"use client";

import { useEffect, useRef, useState } from "react";

const placeholders = [
  "Build an onboarding workflow for a 200-person retail company...",
  "Create a leave request process with Slack notifications...",
  "Set up credential verification for aviation seasonal workers...",
  "Design a 90-day review cycle with manager check-ins...",
];

export function Hero() {
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.activeElement === inputRef.current) return;
      setFade(false);
      setTimeout(() => {
        setPlaceholderIdx((i) => (i + 1) % placeholders.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-20 text-center">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        <h1 className="font-[family-name:var(--font-display)] font-bold text-4xl md:text-5xl lg:text-[60px] leading-[1] tracking-[-0.03em] text-indigo-400 max-w-[720px] mx-auto mb-5">
          Describe your HR workflow. We&apos;ll build it.
        </h1>
        <p className="text-lg text-gray-500 max-w-[640px] mx-auto mb-12">
          50skills turns natural language into automated employee processes.
        </p>

        {/* Prompt box — light, like ChatGPT/Claude/Lovable */}
        <div className="max-w-[680px] mx-auto bg-white border border-gray-100 rounded-2xl p-3 md:p-4 shadow-[0_2px_12px_rgba(35,0,78,0.06)] flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            className={`flex-1 bg-transparent border-none outline-none text-base text-indigo-400 placeholder:text-gray-200 px-3 py-2 transition-opacity duration-300 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
            placeholder={placeholders[placeholderIdx]}
          />
          <button className="bg-blue-hl hover:bg-blue-hl-hover text-white rounded-xl px-6 py-3 text-[15px] font-medium whitespace-nowrap transition-colors shrink-0">
            Try Navigator free →
          </button>
        </div>
      </div>
    </section>
  );
}
