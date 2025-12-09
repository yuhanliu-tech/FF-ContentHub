// src/app/page.tsx
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllTiles } from "../../lib/api";
import { Tile } from "@/../lib/types";
import Loader from "@/components/Loader";

export default function Home() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the search query from URL params
  const searchQuery = searchParams.get("search") ?? "";

  useEffect(() => {
    const fetchTiles = async () => {
      try {
        const { tiles } = await getAllTiles(searchQuery);
        setTiles(tiles);
      } catch (error) {
        setError("Error fetching tiles.");
        console.error("Error fetching tiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTiles();
  }, [searchQuery]); // Re-fetch when search query changes

  const handleTileClick = (tile: Tile) => {
    // If tile has an external link, navigate to it in the current tab
    if (tile.link && tile.link.trim() !== "") {
      window.location.href = tile.link;
    } else {
      // Navigate to the tile detail page
      router.push(`/tiles/${tile.slug}`);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      {loading && (
        <div className="w-full flex items-center justify-center">
          <Loader />
        </div>
      )}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiles.length > 0 ? (
              tiles.map((tile) => (
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
                      <h2 className="text-lg font-semibold font-jet-brains text-black line-clamp-2">
                        {tile.title}
                      </h2>
                      <p className="text-gray-600 mt-2 text-sm leading-6 line-clamp-3">
                        {tile.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No tiles available at the moment.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}