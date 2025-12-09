// app/tiles/[slug]/page.tsx
"use client";
import { useEffect, useState, use, useMemo } from "react";
import { getTileBySlug } from "../../../../lib/api"; // Import your API function
import { useRouter } from "next/navigation";
import { Tile, ListItem } from "@/../lib/types";
import { FaExternalLinkAlt, FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa"; // Import your chosen icon
import Loader from "@/components/Loader";
import moment from "moment";

const TilePage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);
  const [tile, setTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Default to newest first
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

  // Filter and sort list items
  const filteredAndSortedListItems = useMemo(() => {
    if (!tile?.list_items) return [];
    
    let filtered = tile.list_items;
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort by date
    const sorted = [...filtered].sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    
    return sorted;
  }, [tile?.list_items, searchQuery, sortOrder]);

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
      <h1 className="text-4xl leading-[60px] capitalize font-bold text-brand-blue font-poppins">
        {tile.title}
      </h1>

      {/* External Link Section */}
      {tile.link && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-brand-blue mb-2 font-poppins">External Link</h3>
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

      {/* List Items Section (Direct on Tile) */}
      {tile.list_items && tile.list_items.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">

            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search Input */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-inter"
                />
              </div>
              
              {/* Sort Toggle */}
              <button
                onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                title={`Sort by date (${sortOrder === "desc" ? "newest first" : "oldest first"})`}
              >
                {sortOrder === "desc" ? <FaSortAmountDown className="mr-2" /> : <FaSortAmountUp className="mr-2" />}
                Date {sortOrder === "desc" ? "↓" : "↑"}
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredAndSortedListItems.length > 0 ? (
              filteredAndSortedListItems.map((item: ListItem, itemIndex: number) => (
              <div key={itemIndex} className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-brand-blue mb-2 font-poppins">{item.title}</h4>
                
                {item.date && (
                  <p className="text-gray-600 text-sm mb-2 font-inter">
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
                            <p className="text-sm font-medium text-gray-900 font-inter">
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
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-inter"
                          >
                            Open File <FaExternalLinkAlt className="ml-1 text-xs" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
            ) : (
              <div className="py-8 text-gray-500">
                {searchQuery ? (
                  <p>No items found matching "{searchQuery}"</p>
                ) : (
                  <p>No items available</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:text-blue-800 mt-4 inline-block hover:underline font-inter"
      >
        Back to Home
      </button>
    </div>
  );
};

export default TilePage;