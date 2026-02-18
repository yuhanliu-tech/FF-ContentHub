"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

interface BackToHomeProps {
  /** Optional label; default is "Content Hub" */
  label?: string;
  /** Optional class name for the wrapper */
  className?: string;
}

export default function BackToHome({ label = "Content Hub", className = "" }: BackToHomeProps) {
  return (
    <nav className={`mb-6 font-inter ${className}`} aria-label="Breadcrumb">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-blue transition-colors text-sm font-medium"
      >
        <FaArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
        <span>Back to {label}</span>
      </Link>
    </nav>
  );
}
