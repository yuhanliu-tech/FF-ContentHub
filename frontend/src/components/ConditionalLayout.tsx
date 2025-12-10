"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide navbar and footer on auth pages
  const hideNavAndFooter = pathname?.startsWith('/auth/') || 
                          pathname?.startsWith('/connect/discord/redirect');

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      
      {/* Main content expands to fill available space */}
      <main className={hideNavAndFooter ? "min-h-screen" : "flex-grow"}>
        {children}
      </main>

      {!hideNavAndFooter && <Footer />}
    </>
  );
}