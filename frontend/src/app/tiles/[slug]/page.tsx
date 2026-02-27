// app/tiles/[slug]/page.tsx
"use client";
import { useEffect, useState, use, useMemo } from "react";
import { getTileBySlug } from "../../../../lib/api";
import { useRouter } from "next/navigation";
import { Tile, ListItem, Doc } from "@/../lib/types";
import { FaDownload, FaExternalLinkAlt, FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import Loader from "@/components/Loader";
import BackToHome from "@/components/BackToHome";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MEMBER_SESSIONS_TILE_SLUG,
  MEMBER_SESSION_GROUPS,
  assignToThematicGroup,
} from "../member-sessions-config";

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

  const isMemberSessions = slug?.toLowerCase() === MEMBER_SESSIONS_TILE_SLUG;

  const groupedByTheme = useMemo(() => {
    if (!isMemberSessions || !tile?.list_items) return null;
    const items = filteredAndSortedListItems;
    const byGroup: Record<
      string,
      { subGroups?: Record<string, { title: string; items: ListItem[] }>; directItems?: ListItem[] }
    > = {};
    const other: ListItem[] = [];

    for (const item of items) {
      const assigned = assignToThematicGroup(item.title);
      if (!assigned) {
        other.push(item);
        continue;
      }
      const group = MEMBER_SESSION_GROUPS.find((g) => g.id === assigned.groupId);
      if (!group) {
        other.push(item);
        continue;
      }
      if (!byGroup[assigned.groupId]) {
        if (group.subGroups) {
          byGroup[assigned.groupId] = {
            subGroups: Object.fromEntries(
              group.subGroups.map((sg) => [sg.id, { title: sg.title, items: [] }])
            ),
          };
        } else {
          byGroup[assigned.groupId] = { directItems: [] };
        }
      }
      const bucket = byGroup[assigned.groupId];
      if (assigned.subGroupId && bucket.subGroups?.[assigned.subGroupId]) {
        bucket.subGroups[assigned.subGroupId].items.push(item);
      } else if (bucket.directItems) {
        bucket.directItems.push(item);
      }
    }

    const sortByDateDesc = (a: ListItem, b: ListItem) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    };
    for (const key of Object.keys(byGroup)) {
      const b = byGroup[key];
      if (b.directItems) b.directItems.sort(sortByDateDesc);
      if (b.subGroups) {
        for (const subId of Object.keys(b.subGroups)) {
          b.subGroups[subId].items.sort(sortByDateDesc);
        }
      }
    }
    other.sort(sortByDateDesc);
    return { byGroup, other };
  }, [isMemberSessions, tile?.list_items, filteredAndSortedListItems]);

  const memberSessionsToc = useMemo(() => {
    if (!groupedByTheme) return [];
    const groupEntries = MEMBER_SESSION_GROUPS.filter((g) => {
      const b = groupedByTheme.byGroup[g.id];
      if (!b) return false;
      if (b.directItems?.length) return true;
      if (b.subGroups) {
        return Object.values(b.subGroups).some((sg) => sg.items.length > 0);
      }
      return false;
    }).map((g) => ({ id: g.id, title: `${g.emoji} ${g.title}`, slug: g.id }));
    if (groupedByTheme.other.length > 0) {
      groupEntries.push({ id: "other", title: "Other sessions", slug: "other" });
    }
    return groupEntries;
  }, [groupedByTheme]);

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

  const scrollSectionIds = useMemo(
    () =>
      isMemberSessions && memberSessionsToc.length > 0
        ? memberSessionsToc.map((x) => x.slug)
        : tableOfContents.map((item) => item.slug),
    [isMemberSessions, memberSessionsToc, tableOfContents]
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (let i = scrollSectionIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(scrollSectionIds[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(scrollSectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollSectionIds]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error) return <p className="max-w-screen-md mx-auto p-8 text-red-500">Error: {error}</p>;
  if (!tile) return <p className="max-w-screen-md mx-auto p-8 text-subtitle">No tile found.</p>;

  const tocEntries = isMemberSessions && memberSessionsToc.length > 0 ? memberSessionsToc : tableOfContents;

  function formatSessionDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function renderSessionItem(item: ListItem) {
    const dateLabel = item.date ? formatSessionDate(item.date) + " — " : "";
    const content = (
      <span className="text-brand-blue font-plex">
        {dateLabel}
        {item.title}
      </span>
    );
    if (item.link) {
      return (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block py-1.5 text-sm hover:text-brand-orange transition-colors border-b border-gray-100 last:border-b-0"
        >
          {content}
          <FaExternalLinkAlt className="inline-block ml-1.5 text-xs text-subtitle" />
        </a>
      );
    }
    return (
      <div
        key={item.id}
        className="py-1.5 text-sm border-b border-gray-100 last:border-b-0"
      >
        {content}
      </div>
    );
  }

  return (
    <div className="relative max-w-screen-xl mx-auto px-6 py-8">
      {/* Left Sidebar - Table of Contents */}
      {tocEntries.length > 0 && (
        <div className="hidden lg:block fixed left-8 top-24 w-48 h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="sticky top-4">
            <h3 className="text-sm font-semibold text-brand-blue mb-4 font-didot uppercase tracking-wider">
              Contents
            </h3>
            <nav className="space-y-1">
              {tocEntries.map((item) => {
                const itemSlug = "slug" in item ? item.slug : item.id;
                return (
                  <button
                    key={itemSlug}
                    onClick={() => scrollToSection(itemSlug)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-plex text-sm ${
                      activeSection === itemSlug
                        ? "bg-peach text-brand-blue font-medium border-l-3 border-brand-orange"
                        : "text-subtitle hover:text-brand-blue hover:bg-gray-100"
                    }`}
                  >
                    {item.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-3xl mx-auto">
        <BackToHome />

        {isMemberSessions && groupedByTheme ? (
          <>
            <h1 className="text-3xl leading-snug font-bold text-brand-blue font-didot">
              Feedforward Member Sessions
            </h1>
            <p className="mt-2 text-xl text-gray-700 font-plex font-medium">
              Readout Archive & Thematic Groupings
            </p>
            <p className="mt-1 text-base text-subtitle font-plex">
              Last updated: February 2026 &nbsp;&bull;&nbsp; Sessions from Jan 2025 – Feb 2026
            </p>

            {/* Search for member sessions */}
            <div className="mt-6 mb-4">
              <div className="relative max-w-xs">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input pl-11 pr-4 py-2.5 text-sm text-primary font-plex w-full"
                />
              </div>
            </div>

            <div className="space-y-10 mt-8">
              {MEMBER_SESSION_GROUPS.map((group) => {
                const bucket = groupedByTheme.byGroup[group.id];
                if (!bucket) return null;
                const hasDirect = (bucket.directItems?.length ?? 0) > 0;
                const hasSubGroups = bucket.subGroups && Object.values(bucket.subGroups).some((sg) => sg.items.length > 0);
                if (!hasDirect && !hasSubGroups) return null;

                return (
                  <section
                    key={group.id}
                    id={group.id}
                    className="scroll-mt-20"
                  >
                    <h2 className="text-xl font-bold text-brand-blue font-didot mb-1">
                      {group.emoji} {group.title}
                    </h2>
                    {group.description && (
<p className="text-base text-subtitle font-plex mb-4 max-w-2xl">
                      {group.description}
                    </p>
                    )}
                    {bucket.subGroups ? (
                      <div className="space-y-5">
                        {Object.entries(bucket.subGroups)
                          .filter(([, sg]) => sg.items.length > 0)
                          .map(([subId, sg]) => (
                            <div key={subId}>
                              <h3 className="text-base font-semibold text-brand-blue font-didot mb-2">
                                {sg.title}
                              </h3>
                              <div className="space-y-0 pl-0">
                                {sg.items.map((item) => renderSessionItem(item))}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {bucket.directItems?.map((item) => renderSessionItem(item))}
                      </div>
                    )}
                  </section>
                );
              })}

              {groupedByTheme.other.length > 0 && (
                <section id="other" className="scroll-mt-20">
                  <h2 className="text-xl font-bold text-brand-blue font-didot mb-4">
                    Other sessions
                  </h2>
                  <div className="space-y-0">
                    {groupedByTheme.other.map((item) => renderSessionItem(item))}
                  </div>
                </section>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl leading-snug capitalize font-bold text-brand-blue font-didot">
              {tile.title}
            </h1>

            {/* External Link Section */}
            {tile.link && (
          <div className="mt-4 bg-white border border-gray-200 p-5 rounded-xl mb-6">
            <a
              href={tile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-brand-blue hover:text-brand-orange transition-colors font-medium font-plex text-sm"
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
                      className="text-2xl font-bold text-brand-blue mb-4 font-didot scroll-mt-20"
                    >
                      {doc.subtitle}
                    </h2>
                  )}

                  {doc.content && (
                    <div className="prose prose-lg max-w-none text-gray-800 text-base font-plex leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({children}) => <h1 className="text-3xl font-bold text-brand-blue mb-4 font-didot">{children}</h1>,
                          h2: ({children}) => <h2 className="text-2xl font-bold text-brand-blue mb-3 font-didot">{children}</h2>,
                          h3: ({children}) => <h3 className="text-xl font-semibold text-brand-blue mb-2 font-didot">{children}</h3>,
                          h4: ({children}) => <h4 className="text-lg font-semibold text-brand-blue mb-2 font-didot">{children}</h4>,
                          p: ({children}) => <p className="mb-4 text-gray-800 text-base font-plex leading-relaxed">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="text-gray-800 text-base font-plex">{children}</li>,
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
                    className="search-input pl-11 pr-4 py-2.5 text-sm text-primary font-plex"
                  />
                </div>

                {/* Sort Toggle */}
                <button
                  onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                  className="inline-flex items-center px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-subtitle bg-white hover:bg-gray-50 transition-colors font-plex"
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
                  <h4 className="text-base font-semibold text-brand-blue mb-1 font-didot">{item.title}</h4>

                  {item.date && (
                    <p className="text-subtitle text-base mb-2 font-plex">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  )}

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-brand-blue hover:text-brand-orange transition-colors mb-2 text-base font-plex"
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
                            className="inline-flex items-center text-brand-blue hover:text-brand-orange transition-colors text-base font-plex"
                          >
                            Open Image <FaExternalLinkAlt className="ml-1 text-xs" />
                          </a>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-base font-medium text-primary font-plex">
                                {item.attachment.name || 'File Attachment'}
                              </p>
                              <p className="text-xs text-subtitle">
                                {item.attachment.mime && (
                                  <>
                                    {item.attachment.mime.includes('pdf') && '📄 PDF Document'}
                                    {item.attachment.mime.includes('powerpoint') && '📊 PowerPoint Presentation'}
                                    {item.attachment.mime.includes('presentationml') && '📊 PowerPoint Presentation'}
                                    {(item.attachment.mime.includes('word') || item.attachment.mime.includes('wordprocessing')) && '📝 Word Document'}
                                    {item.attachment.mime.includes('excel') && '📈 Excel Spreadsheet'}
                                    {item.attachment.mime.includes('sheet') && '📈 Excel Spreadsheet'}
                                    {!item.attachment.mime.includes('pdf') &&
                                     !item.attachment.mime.includes('powerpoint') &&
                                     !item.attachment.mime.includes('presentationml') &&
                                     !item.attachment.mime.includes('word') &&
                                     !item.attachment.mime.includes('wordprocessing') &&
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
                              download={item.attachment.name || undefined}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-blue hover:bg-secondary-blue rounded-lg transition-colors font-plex"
                            >
                              Download File <FaDownload className="ml-1 text-xs" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
              ) : (
                <div className="py-8 text-base text-subtitle font-plex">
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
          </>
        )}
      </div>
    </div>
  );
};

export default TilePage;
