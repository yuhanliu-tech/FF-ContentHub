// src/components/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full mt-auto">
      {/* gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-orange to-transparent" />

      <div className="bg-brand-blue py-8">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <p className="text-sm text-white/60 font-inter">
            &copy; 2026 Feedforward
          </p>

          <ul className="flex items-center gap-6 text-white/80 font-inter text-sm">
            {[
              { href: "/docs", label: "Docs" },
              { href: "/support", label: "Support" },
              { href: "/privacy", label: "Privacy" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-brand-orange transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
