// src/components/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-brand-blue py-6 mt-12">
      <div className="max-w-screen-lg mx-auto px-4 flex justify-between items-center">

        {/* Left side */}
        <h3 className="font-regular text-lg text-white font-poppins">
            Copyright 2025 Feedforward
          </h3>

        {/* Right side menu */}
        <ul className="flex items-center gap-6 text-white font-inter text-sm">
          <li className="hover:text-white/70 transition-colors">
            <Link href="/docs">Docs</Link>
          </li>
          <li className="hover:text-white/70 transition-colors">
            <Link href="/support">Support</Link>
          </li>
          <li className="hover:text-white/70 transition-colors">
            <Link href="/privacy">Privacy</Link>
          </li>
          <li className="hover:text-white/70 transition-colors">
            <Link href="/contact">Contact</Link>
          </li>
        </ul>

      </div>
    </footer>
  );
};

export default Footer;
