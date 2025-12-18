// src/app/page.tsx
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllTiles, getHomepageHero } from "../../lib/api";
import { Tile, HomepageHero } from "@/../lib/types";
import { isAuthenticated } from "../../lib/auth";
import Loader from "@/components/Loader";

export default function Home() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [hero, setHero] = useState<HomepageHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the search query from URL params
  const searchQuery = searchParams.get("search") ?? "";

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked) return; // Wait for auth check to complete

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
  }, [searchQuery, authChecked]); // Re-fetch when search query changes or auth is checked

  // Filter tiles by category
  const { archiveTiles, toolTiles } = useMemo(() => {
    const archive = tiles.filter(tile => tile.category === "archive");
    const tools = tiles.filter(tile => tile.category === "tool");
    return { archiveTiles: archive, toolTiles: tools };
  }, [tiles]);

  const handleTileClick = (tile: Tile) => {
    // If tile should link to single type page, navigate to the single type page using slug
    if (tile.link_to_single_type) {
      router.push(`/${tile.slug.toLowerCase()}`);
    } 
    // If tile has an external link, navigate to it in the current tab
    else if (tile.link && tile.link.trim() !== "") {
      window.location.href = tile.link;
    } else {
      // Navigate to the tile detail page
      router.push(`/tiles/${tile.slug.toLowerCase()}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading && (
        <div className="w-full flex items-center justify-center">
          <Loader />
        </div>
      )}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          {/* Homepage Hero Section */}
          {hero && (
            <div className="mb-16 pt-8">
              {hero.cover?.url && (
                <div className="mb-6">
                  <img
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${hero.cover.url}`}
                    alt="Logo"
                    className="w-2/3 h-auto rounded-lg"
                  />
                </div>
              )}
              {hero.description && (
                <div className="text-left">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {hero.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Horizontal line separator */}
          <div className="w-full h-px bg-brand-orange mb-12"></div>

          {/* Tools Section */}
          {toolTiles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-10 mt-8 font-poppins text-brand-blue">Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {toolTiles.map((tile) => (
                  <div
                    key={tile.id}
                    className="cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => handleTileClick(tile)}
                  >
                    <div className="block">
                      {tile.cover?.url && (
                        <div className="relative h-36 w-full">
                          <img
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${tile.cover.url}`}
                            alt={tile.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold font-poppins text-black line-clamp-2">
                          {tile.title}
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm leading-6 line-clamp-3 font-inter">
                          {tile.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Archive Section */}
          {archiveTiles.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-10 mt-8 font-poppins text-brand-blue">Archive</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archiveTiles.map((tile) => (
                  <div
                    key={tile.id}
                    className="cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => handleTileClick(tile)}
                  >
                    <div className="block">
                      {tile.cover?.url && (
                        <div className="relative h-36 w-full">
                          <img
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${tile.cover.url}`}
                            alt={tile.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold font-poppins text-black line-clamp-2">
                          {tile.title}
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm leading-6 line-clamp-3 font-inter">
                          {tile.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No tiles message */}
          {tiles.length === 0 && (
            <p className="text-gray-600 text-center font-inter">No tiles available at the moment.</p>
          )}
        </>
      )}
    </div>
  );
}