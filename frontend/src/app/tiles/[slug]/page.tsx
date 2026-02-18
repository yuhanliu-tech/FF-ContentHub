// app/tiles/[slug]/page.tsx
"use client";
import { useEffect, useState, use, useMemo } from "react";
import { getTileBySlug } from "../../../../lib/api";
import { useRouter } from "next/navigation";
import { Tile, ListItem, Doc } from "@/../lib/types";
import { FaExternalLinkAlt, FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import Loader from "@/components/Loader";
import BackToHome from "@/components/BackToHome";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TilePage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);
  const [tile, setTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeSection, setActiveSection] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchTile = async () => {
      if (slug) {
        try {
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

  const filteredAndSortedListItems = useMemo(() => {
    if (!tile?.list_items) return [];

    let filtered = tile.list_items;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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

  const tableOfContents = useMemo(() => {
    if (!tile?.docs) return [];
    return tile.docs
      .filter((doc: Doc) => doc.subtitle)
      .map((doc: Doc) => ({
        id: `doc-${doc.id}`,
        title: doc.subtitle!,
        slug: doc.subtitle!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }));
  }, [tile?.docs]);

  const scrollToSection = (slug: string) => {
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(slug);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => item.slug);
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error) return <p className="max-w-screen-md mx-auto p-8 text-red-500">Error: {error}</p>;
  if (!tile) return <p className="max-w-screen-md mx-auto p-8 text-subtitle">No tile found.</p>;

  return (
    <div className="relative max-w-screen-xl mx-auto px-6 py-8">
      {/* Left Sidebar - Table of Contents */}
      {tableOfContents.length > 0 && (
        <div className="hidden lg:block fixed left-8 top-24 w-48 h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="sticky top-4">
            <h3 className="text-sm font-semibold text-brand-blue mb-4 font-poppins uppercase tracking-wider">
              Contents
            </h3>
            <nav className="space-y-1">
              {tableOfContents.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => scrollToSection(item.slug)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-inter text-sm ${
                    activeSection === item.slug
                      ? 'bg-peach text-brand-blue font-medium border-l-3 border-brand-orange'
                      : 'text-subtitle hover:text-brand-blue hover:bg-gray-100'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-3xl mx-auto">
        <BackToHome />
        <h1 className="text-3xl leading-snug capitalize font-bold text-brand-blue font-poppins">
          {tile.title}
        </h1>

        {/* External Link Section */}
        {tile.link && (
          <div className="mt-4 bg-white border border-gray-200 p-5 rounded-xl mb-6">
            <a
              href={tile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-brand-blue hover:text-brand-orange transition-colors font-medium font-inter text-sm"
            >
              Visit External Link <FaExternalLinkAlt className="ml-2 text-xs" />
            </a>
          </div>
        )}

        {/* Docs Content */}
        {tile.docs && tile.docs.length > 0 && (
          <div className="mb-8 space-y-8 mt-6">
            {tile.docs.map((doc: Doc) => {
              const slug = doc.subtitle ? doc.subtitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '';
              return (
                <div key={doc.id} className="border-b border-gray-200 last:border-b-0 pb-8 last:pb-0">
                  {doc.subtitle && (
                    <h2
                      id={slug}
                      className="text-2xl font-bold text-brand-blue mb-4 font-poppins scroll-mt-20"
                    >
                      {doc.subtitle}
                    </h2>
                  )}

                  {doc.content && (
                    <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-inter">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({children}) => <h1 className="text-3xl font-bold text-brand-blue mb-4 font-poppins">{children}</h1>,
                          h2: ({children}) => <h2 className="text-2xl font-bold text-brand-blue mb-3 font-poppins">{children}</h2>,
                          h3: ({children}) => <h3 className="text-xl font-semibold text-brand-blue mb-2 font-poppins">{children}</h3>,
                          h4: ({children}) => <h4 className="text-lg font-semibold text-brand-blue mb-2 font-poppins">{children}</h4>,
                          p: ({children}) => <p className="mb-4 text-gray-800 font-inter leading-relaxed">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="text-gray-800 font-inter">{children}</li>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-brand-orange pl-4 italic text-gray-700 mb-4 bg-peach/30 py-3 rounded-r-lg">{children}</blockquote>,
                          code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded-md text-sm font-mono">{children}</code>,
                          pre: ({children}) => <pre className="bg-gray-100 p-4 rounded-xl overflow-x-auto mb-4">{children}</pre>,
                          a: ({children, href}) => <a href={href} className="text-brand-blue hover:text-brand-orange underline transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                          strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                          em: ({children}) => <em className="italic">{children}</em>,
                        }}
                      >
                        {doc.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* List Items Section */}
        {tile.list_items && tile.list_items.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Search Input */}
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input pl-11 pr-4 py-2.5 text-sm text-primary font-inter"
                  />
                </div>

                {/* Sort Toggle */}
                <button
                  onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                  className="inline-flex items-center px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-subtitle bg-white hover:bg-gray-50 transition-colors font-inter"
                  title={`Sort by date (${sortOrder === "desc" ? "newest first" : "oldest first"})`}
                >
                  {sortOrder === "desc" ? <FaSortAmountDown className="mr-2" /> : <FaSortAmountUp className="mr-2" />}
                  Date {sortOrder === "desc" ? "↓" : "↑"}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredAndSortedListItems.length > 0 ? (
                filteredAndSortedListItems.map((item: ListItem, itemIndex: number) => (
                <div key={itemIndex} className="bg-white p-5 rounded-xl border border-gray-200 border-l-3 border-l-brand-orange hover:shadow-md transition-shadow">
                  <h4 className="text-base font-semibold text-brand-blue mb-1 font-poppins">{item.title}</h4>

                  {item.date && (
                    <p className="text-subtitle text-sm mb-2 font-inter">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  )}

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-brand-blue hover:text-brand-orange transition-colors mb-2 text-sm font-inter"
                    >
                      View Link <FaExternalLinkAlt className="ml-1 text-xs" />
                    </a>
                  )}

                  {item.attachment?.url && (
                    <div className="mt-3">
                      {item.attachment.mime?.startsWith('image/') ? (
                        <div>
                          <img
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attachment.url}`}
                            alt={item.attachment.alternativeText || item.title}
                            className="max-w-full h-auto rounded-xl border border-gray-200 mb-2"
                          />
                          <a
                            href={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attachment.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-brand-blue hover:text-brand-orange transition-colors text-sm font-inter"
                          >
                            Open Image <FaExternalLinkAlt className="ml-1 text-xs" />
                          </a>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-primary font-inter">
                                {item.attachment.name || 'File Attachment'}
                              </p>
                              <p className="text-xs text-subtitle">
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
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-blue hover:bg-secondary-blue rounded-lg transition-colors font-inter"
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
                <div className="py-8 text-subtitle font-inter">
                  {searchQuery ? (
                    <p>No items found matching &ldquo;{searchQuery}&rdquo;</p>
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
          className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-orange mt-4 transition-colors font-inter text-sm font-medium"
        >
          <FaArrowLeft size={12} />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default TilePage;
