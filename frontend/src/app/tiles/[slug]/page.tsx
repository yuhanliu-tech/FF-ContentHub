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
      <h1 className="text-4xl leading-[60px] capitalize text-center font-bold text-black font-jet-brains">
        {tile.title}
      </h1>
      <div className="w-full flex items-center justify-center font-light text-gray-700">
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
        <p className="text-gray-800 leading-[32px] tracking-wide italic mt-2 mb-6">
          {tile.description}
        </p>
      )}

      {/* External Link Section */}
      {tile.link && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-black mb-2">External Link</h3>
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

      {/* List Items Section (Direct on Tile) */}
      {tile.list_items && tile.list_items.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">Items</h3>
          <div className="space-y-4">
            {tile.list_items.map((item: any, itemIndex: number) => (
              <div key={itemIndex} className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-black mb-2">{item.title}</h4>
                
                {item.date && (
                  <p className="text-gray-600 text-sm mb-2">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                )}
                
                {item.link && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-2"
                  >
                    View Link <FaExternalLinkAlt className="ml-1 text-sm" />
                  </a>
                )}
                
                {item.attachment?.url && (
                  <div className="mt-2">
                    {item.attachment.mime?.startsWith('image/') ? (
                      <div>
                        <img
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attachment.url}`}
                          alt={item.attachment.alternativeText || item.title}
                          className="max-w-full h-auto rounded-md border border-gray-300 mb-2"
                        />
                        <a
                          href={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attachment.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
                        >
                          Open Image <FaExternalLinkAlt className="ml-1 text-xs" />
                        </a>
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-300 p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {item.attachment.name || 'File Attachment'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.attachment.mime && (
                                <>
                                  {item.attachment.mime.includes('pdf') && '📄 PDF Document'}
                                  {item.attachment.mime.includes('powerpoint') && '📊 PowerPoint Presentation'}
                                  {item.attachment.mime.includes('presentationml') && '📊 PowerPoint Presentation'}
                                  {item.attachment.mime.includes('word') && '📝 Word Document'}
                                  {item.attachment.mime.includes('document') && '📝 Word Document'}
                                  {item.attachment.mime.includes('excel') && '📈 Excel Spreadsheet'}
                                  {item.attachment.mime.includes('sheet') && '📈 Excel Spreadsheet'}
                                  {!item.attachment.mime.includes('pdf') && 
                                   !item.attachment.mime.includes('powerpoint') && 
                                   !item.attachment.mime.includes('presentationml') &&
                                   !item.attachment.mime.includes('word') && 
                                   !item.attachment.mime.includes('document') &&
                                   !item.attachment.mime.includes('excel') && 
                                   !item.attachment.mime.includes('sheet') && '📎 File'}
                                </>
                              )}
                              {item.attachment.size && ` • ${Math.round(item.attachment.size / 1024)} KB`}
                            </p>
                          </div>
                          <a
                            href={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attachment.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                          >
                            Open File <FaExternalLinkAlt className="ml-1 text-xs" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Zone Content */}
      {tile.content && Array.isArray(tile.content) && tile.content.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">Content</h3>
          {tile.content.map((component: any, index: number) => (
            <div key={index} className="mb-6">
              {component.__component === "content.page-content" && (
                <div className="space-y-6">
                  
                  {/* Render Markdown/Rich Text Content */}
                  {component.words && (
                    <div className="prose prose-lg max-w-none text-gray-800">
                      <div 
                        dangerouslySetInnerHTML={{ __html: component.words }} 
                        className="leading-relaxed"
                      />
                    </div>
                  )}
                  
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:text-blue-800 mt-4 inline-block hover:underline"
      >
        Back to Home
      </button>
    </div>
  );
};

export default TilePage;