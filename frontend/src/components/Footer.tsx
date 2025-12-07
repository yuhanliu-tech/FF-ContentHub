// src/components/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-[#1B3F6A] py-6 mt-12">
      <div className="max-w-screen-lg mx-auto px-4 flex justify-between items-center">

        {/* Left side */}
        <Link href="/">
          <h1 className="font-bold text-lg text-white font-jet-brains">
            FF Content Hub
          </h1>
        </Link>

        {/* Right side menu */}
        <ul className="flex items-center gap-6 text-white font-jet-brains text-sm">
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
