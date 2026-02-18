// src/components/Navbar.tsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaSignOutAlt, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { getLogo, getAllTiles } from "../../lib/api";
import { Logo, Tile } from "../../lib/types";
import { getUser, logout, isAuthenticated } from "../../lib/auth";
import LoginModal from "./LoginModal";

const NAV_LINKS = [
  { href: "/expert-net", label: "Expert-Net" },
  { href: "/documents", label: "Documents" },
];

const Navbar = () => {
  const [logo, setLogo] = useState<Logo | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const { toolTiles, dashboardTiles } = useMemo(() => {
    const tools = tiles.filter((t) => t.category === "tool");
    const dashboard = tiles.filter((t) => t.category === "dashboard");
    return { toolTiles: tools, dashboardTiles: dashboard };
  }, [tiles]);

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

  useEffect(() => {
    if (!menuOpen) return;
    const fetchTiles = async () => {
      try {
        const { tiles: data } = await getAllTiles("");
        setTiles(data ?? []);
      } catch (err) {
        console.error("Error fetching tiles for menu:", err);
      }
    };
    fetchTiles();
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
  };

  const handleTileClick = (tile: Tile) => {
    setMenuOpen(false);
    if (tile.link_to_single_type) {
      router.push(`/${tile.slug.toLowerCase()}`);
    } else if (tile.link?.trim()) {
      window.location.href = tile.link;
    } else {
      router.push(`/tiles/${tile.slug.toLowerCase()}`);
    }
  };

  return (
    <div className="w-full sticky top-0 py-4 sm:py-5 z-50" style={{ background: "linear-gradient(135deg, #1a3f69 0%, #2a5a8f 50%, #1a3f69 100%)" }}>
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-3">
            {logo && logo.logo && logo.logo.length > 0 && (
              <img
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${logo.logo[0].url}`}
                alt="FF Content Hub Logo"
                className="h-10 w-auto"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <h1 className="font-semibold text-xl text-white font-poppins tracking-tight">
              Content Hub
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-inter transition-colors duration-200 pb-0.5 ${
                  isActive
                    ? "text-brand-orange"
                    : "text-white hover:text-brand-orange"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-brand-orange" />
                )}
              </Link>
            );
          })}

          {authenticated && user ? (
            <>
              <Link
                href="/users/appointments"
                className={`relative text-sm font-inter transition-colors duration-200 pb-0.5 ${
                  pathname === "/users/appointments"
                    ? "text-brand-orange"
                    : "text-white hover:text-brand-orange"
                }`}
              >
                My appointments
                {pathname === "/users/appointments" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-brand-orange" />
                )}
              </Link>
              <span className="text-white/70 text-sm font-inter">
                Hi, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-brand-orange hover:bg-amber-500 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
                title="Logout"
              >
                <FaSignOutAlt size={13} />
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="bg-brand-orange hover:bg-amber-500 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Log in
            </button>
          )}
        </div>
      </nav>

      {/* Burger menu overlay + slide-out panel */}
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 bg-black/40 z-[60] transition-opacity"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            className="nav-drawer fixed top-0 left-0 h-full w-[min(320px,85vw)] bg-white z-[70] shadow-xl flex flex-col"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-semibold text-brand-blue font-poppins">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-blue transition-colors"
                aria-label="Close menu"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <div className="border-b border-gray-100">
                <button
                  type="button"
                  className="nav-drawer-section w-full flex items-center justify-between px-4 py-3 text-left text-brand-blue font-medium font-inter hover:bg-gray-50"
                  onClick={() => setToolsOpen(!toolsOpen)}
                >
                  Tools
                  {toolsOpen ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
                </button>
                {toolsOpen && (
                  <div className="nav-drawer-sub pl-4 pb-2">
                    {toolTiles.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-gray-500">Loading…</p>
                    ) : (
                      toolTiles.map((tile) => (
                        <button
                          key={tile.id}
                          type="button"
                          className="nav-drawer-item block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-peach/40 hover:text-brand-blue rounded-r-lg font-inter"
                          onClick={() => handleTileClick(tile)}
                        >
                          {tile.title}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="border-b border-gray-100">
                <button
                  type="button"
                  className="nav-drawer-section w-full flex items-center justify-between px-4 py-3 text-left text-brand-blue font-medium font-inter hover:bg-gray-50"
                  onClick={() => setDashboardOpen(!dashboardOpen)}
                >
                  Dashboard
                  {dashboardOpen ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
                </button>
                {dashboardOpen && (
                  <div className="nav-drawer-sub pl-4 pb-2">
                    {dashboardTiles.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-gray-500">Loading…</p>
                    ) : (
                      dashboardTiles.map((tile) => (
                        <button
                          key={tile.id}
                          type="button"
                          className="nav-drawer-item block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-peach/40 hover:text-brand-blue rounded-r-lg font-inter"
                          onClick={() => handleTileClick(tile)}
                        >
                          {tile.title}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </>
      )}

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
};

export default Navbar;
