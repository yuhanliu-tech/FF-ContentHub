// src/components/Navbar.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaPen, FaSearch, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { getLogo } from "../../lib/api";
import { Logo } from "../../lib/types";
import { getUser, logout, isAuthenticated } from "../../lib/auth";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [logo, setLogo] = useState<Logo | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname(); // Get the current route path
  const { replace } = useRouter(); // Next js function to replace routes

  // Fetch logo and check auth on component mount
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logoData = await getLogo();
        setLogo(logoData);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      if (authStatus) {
        setUser(getUser());
      }
    };

    fetchLogo();
    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-full sticky top-0 bg-brand-blue py-3 sm:py-6 z-50">
      <nav className="max-w-screen-lg mx-auto flex justify-between items-center mb-2 px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            {logo && logo.logo && logo.logo.length > 0 && (
              <img
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${logo.logo[0].url}`}
                alt="FF Content Hub Logo"
                className="h-8 w-auto"
              />
            )}
            <h1 className="font-bold text-xl text-white-600 font-poppins">
              Content Hub
            </h1>
          </Link>
        </div>

        {/* User Authentication Section */}
        {authenticated && user && (
          <div className="flex items-center gap-4">
            <span className="text-white text-sm">
              Welcome, {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
              title="Logout"
            >
              <FaSignOutAlt size={14} />
              Logout
            </button>
          </div>
        )}
      </nav>

    </div>
  );
};

export default Navbar;