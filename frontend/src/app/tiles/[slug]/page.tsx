// app/tiles/[slug]/page.tsx
"use client";
import { useEffect, useState, use } from "react";
import { getTileBySlug } from "../../../../lib/api"; // Import your API function
import { useRouter } from "next/navigation";
import { Tile } from "@/../lib/types";
import { FaExternalLinkAlt } from "react-icons/fa"; // Import your chosen icon
import Loader from "@/components/Loader";
import moment from "moment";

const TilePage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);
  const [tile, setTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTile = async () => {
      if (slug) {
        try {
          // Fetch the tile using the slug
          const fetchedTile = await getTileBySlug(slug);
          setTile(fetchedTile);
        } catch (err) {
          setError("Error fetching tile.");
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTile();
  }, [slug]);

  if (loading)
    return (
      <div className="max-w-screen-md mx-auto flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error) return <p className="max-w-screen-md mx-auto">Error: {error}</p>;
  if (!tile) return <p className="max-w-screen-md mx-auto">No tile found.</p>;

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <h1 className="text-4xl leading-[60px] capitalize text-center font-bold text-purple-800 font-jet-brains">
        {tile.title}
      </h1>
      <div className="w-full flex items-center justify-center font-light">
        Created: {moment(tile.createdAt).fromNow()}
      </div>

      {tile.cover && (
        <div className="relative h-72 w-full my-4">
          <img
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${tile.cover.url}`}
            alt={tile.title}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
      )}
      
      {tile.description && (
        <p className="text-gray-300 leading-[32px] tracking-wide italic mt-2 mb-6">
          {tile.description}
        </p>
      )}

      {/* External Link Section */}
      {tile.link && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">External Link</h3>
          <a 
            href={tile.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            Visit Link <FaExternalLinkAlt className="ml-2" />
          </a>
        </div>
      )}

      {/* Dynamic Zone Content */}
      {tile.content && Array.isArray(tile.content) && tile.content.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Content</h3>
          {tile.content.map((component: any, index: number) => (
            <div key={index} className="mb-4">
              {component.__component === "content.page-content" && (
                <div className="prose prose-invert max-w-none">
                  {component.content && (
                    <div dangerouslySetInnerHTML={{ __html: component.content }} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => router.back()}
        className="text-purple-800 mt-4 inline-block hover:underline"
      >
        Back to Home
      </button>
    </div>
  );
};

export default TilePage;