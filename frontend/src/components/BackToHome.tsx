"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

interface BackToHomeProps {
  /** Optional label; default is "Member Portal" */
  label?: string;
  /** Optional href; default is "/" */
  href?: string;
  /** Optional class name for the wrapper */
  className?: string;
}

export default function BackToHome({ label = "Member Portal", href = "/", className = "" }: BackToHomeProps) {
  return (
    <nav className={`mb-6 font-plex ${className}`} aria-label="Breadcrumb">
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-blue transition-colors text-sm font-medium"
      >
        <FaArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
        <span>Back to {label}</span>
      </Link>
    </nav>
  );
}
