// src/app/page.tsx
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllTiles, getHomepageHero } from "../../lib/api";
import { Tile, HomepageHero } from "@/../lib/types";
import { isAuthenticated, getUser } from "../../lib/auth";
import Loader from "@/components/Loader";

export default function Home() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [hero, setHero] = useState<HomepageHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("search") ?? "";

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    setAuthChecked(true);
    const user = getUser();
    if (user?.username) {
      setUserName(user.username);
    }
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    const fetchData = async () => {
      try {
        const [tilesResponse, heroResponse] = await Promise.all([
          getAllTiles(searchQuery),
          getHomepageHero()
        ]);
        setTiles(tilesResponse.tiles);
        setHero(heroResponse);
      } catch (error) {
        setError("Error fetching content.");
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, authChecked]);
  const { toolTiles, contentSeriesTiles } = useMemo(() => {
    const tools = tiles.filter(tile => tile.category === "tool");
    const contentSeries = tiles.filter(tile => tile.category === "dashboard");
    return { toolTiles: tools, contentSeriesTiles: contentSeries };
  }, [tiles]);

  const handleTileClick = (tile: Tile) => {
    if (tile.link_to_single_type) {
      router.push(`/${tile.slug.toLowerCase()}`);
    } else if (tile.link && tile.link.trim() !== "") {
      window.location.href = tile.link;
    } else {
      router.push(`/tiles/${tile.slug.toLowerCase()}`);
    }
  };

  /** Shared tile card renderer */
  const renderTileCard = (tile: Tile, idx: number, fallbackBg: string) => (
    <div
      key={tile.id}
      className="tile-card group card-animate-in"
      style={{ "--delay": `${idx * 80}ms` } as React.CSSProperties}
      onClick={() => handleTileClick(tile)}
    >
      <div className={`relative h-44 w-full overflow-hidden ${fallbackBg}`}>
        {tile.cover?.url && (
          <img
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${tile.cover.url}`}
            alt={tile.title}
            className="tile-card__img w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
      </div>
      <div className="p-5">
        <h3 className="text-sm font-semibold font-poppins text-primary line-clamp-2">
          {tile.title}
        </h3>
        {tile.description && (
          <p className="text-secondary mt-2 text-sm leading-relaxed line-clamp-3 font-inter">
            {tile.description}
          </p>
        )}
      </div>
    </div>
  );


  return (
    <div className="home-bg min-h-screen relative overflow-hidden">
      {/* ─── Decorative Blobs ─────────────────────── */}
      <div className="home-blob absolute -top-24 -right-24 w-80 h-80 bg-peach opacity-20" />
      <div className="home-blob absolute top-[40%] -left-32 w-64 h-64 bg-brand-orange opacity-[0.07]" style={{ animationDelay: "-6s" }} />
      <div className="home-blob absolute bottom-[10%] right-[5%] w-48 h-48 bg-secondary-blue opacity-[0.05]" style={{ animationDelay: "-12s" }} />

      <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-16">
        {loading && (
          <div className="w-full flex items-center justify-center min-h-[40vh]">
            <Loader />
          </div>
        )}
        {error && (
          <p className="text-red-600 text-center py-12 font-inter">{error}</p>
        )}

        {!loading && !error && (
          <>
            {/* ─── Hero Section ───────────────────────── */}
            {hero && (
              <section className="mb-16 card-animate-in">
                <h1 className="text-2xl md:text-3xl font-semibold text-brand-blue font-poppins mb-3">
                  {userName ? `Welcome back, ${userName}!` : "Welcome!"}
                </h1>
                <p className="text-base md:text-lg text-subtitle leading-relaxed max-w-xl font-inter mb-6">
                  Here is your Feedforward content portal. Feel free to share.
                </p>
                {hero.description && !/lorem\s+ipsum/i.test(hero.description.trim()) && (
                  <p className="text-base md:text-lg text-subtitle leading-relaxed max-w-xl font-inter mb-6">
                    {hero.description}
                  </p>
                )}
              </section>
            )}

            {/* ─── Gradient Divider ───────────────────── */}
            <div className="gradient-divider mb-14" />

            {/* ─── Tools Section ──────────────────────── */}
            {toolTiles.length > 0 && (
              <section id="tools-section" className="mb-14">
                <header className="mb-6">
                  <h2 className="flex items-center gap-3 text-2xl font-bold mb-2 font-poppins text-brand-blue">
                    <span className="inline-block w-8 h-1 rounded-full bg-brand-orange" />
                    Tools
                  </h2>
                  <p className="text-sm text-subtitle font-inter">
                    Internal utilities and helpers to navigate and use your Feedforward content faster.
                  </p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {toolTiles.map((tile, idx) => renderTileCard(tile, idx, "bg-brand-blue"))}
                </div>
              </section>
            )}

            {/* ─── Gradient Divider ───────────────────── */}
            {contentSeriesTiles.length > 0 && (
              <div className="gradient-divider mb-14" />
            )}

            {/* ─── Dashboard Section ───────────── */}
            {contentSeriesTiles.length > 0 && (
              <section className="mb-14">
                <header className="mb-6">
                  <h2 className="flex items-center gap-3 text-2xl font-bold mb-2 font-poppins text-brand-blue">
                    <span className="inline-block w-8 h-1 rounded-full bg-brand-orange" />
                    Dashboard
                  </h2>
                  <p className="text-sm text-subtitle font-inter">
                    Curated content series and overview tiles that keep your initiatives on track.
                  </p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {contentSeriesTiles.map((tile, idx) => renderTileCard(tile, idx, "bg-brand-blue"))}
                </div>
              </section>
            )}

            {tiles.length === 0 && (
              <p className="text-secondary text-center py-16 font-inter">
                No tiles available at the moment.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
