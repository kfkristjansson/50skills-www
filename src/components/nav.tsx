"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 h-16 flex items-center transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-100"
          : "bg-white/95 backdrop-blur-xl border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto w-full px-6 md:px-10 lg:px-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <Image src="/logo.svg" alt="50skills" width={140} height={29} priority />
        </a>

        {/* Links */}
        <ul className="hidden md:flex gap-8">
          {["Product", "Customers", "Pricing", "Blog"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="text-[15px] font-medium text-indigo-400 hover:text-blue-hl transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <a href="#" className="hidden md:inline text-[15px] font-medium text-indigo-400">
            Log in
          </a>
          <a
            href="#"
            className="bg-blue-hl hover:bg-blue-hl-hover text-white text-[15px] font-medium rounded-lg px-6 h-11 flex items-center transition-colors"
          >
            Book a Demo
          </a>
        </div>
      </div>
    </nav>
  );
}
