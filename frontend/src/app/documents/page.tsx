// app/documents/page.tsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { getAllDocuments } from "../../../lib/api";
import { Document } from "../../../lib/types";
import Loader from "../../components/Loader";
import BackToHome from "../../components/BackToHome";
import { FaSearch, FaExternalLinkAlt, FaDownload } from "react-icons/fa";
import {
  MEMBER_SESSION_GROUPS,
  assignToThematicGroup,
} from "../tiles/member-sessions-config";

/** Parse optional date and session title from document title (e.g. "Apr 2, 2025 call readout_Session Name"). */
function parseDocumentTitle(
  title: string,
  publishedAt: string
): { date: Date; sessionTitle: string } {
  const published = new Date(publishedAt);
  // Match "Mon DD, YYYY" or "Mon DD YYYY" or "Mon DD,YYYY" at start
  const dateMatch = title.match(
    /^(\w{3,4})\s+(\d{1,2}),?\s*(\d{4})/
  );
  let date = published;
  if (dateMatch) {
    const parsed = new Date(
      `${dateMatch[1]} ${dateMatch[2]}, ${dateMatch[3]}`
    );
    if (!isNaN(parsed.getTime())) date = parsed;
  }
  // Session title: after "call readout_" or "call readout " or similar
  let sessionTitle = title;
  const afterReadout = title.match(
    /call\s*readout[_:\s]+(.+)$/i
  );
  if (afterReadout?.[1]) {
    sessionTitle = afterReadout[1].trim();
  }
  return { date, sessionTitle };
}

function formatSessionDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** True if this doc's thematic group or subgroup title/description contains the search string. */
function docMatchesGroupSearch(
  searchLower: string,
  assigned: { groupId: string; subGroupId?: string } | null
): boolean {
  if (!assigned) return false;
  const group = MEMBER_SESSION_GROUPS.find((g) => g.id === assigned.groupId);
  if (!group) return false;
  if (group.title.toLowerCase().includes(searchLower)) return true;
  if (group.description?.toLowerCase().includes(searchLower)) return true;
  if (assigned.subGroupId) {
    const sg = group.subGroups?.find((s) => s.id === assigned.subGroupId);
    if (sg?.title.toLowerCase().includes(searchLower)) return true;
  }
  return false;
}

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  function isPdfDocument(doc: Document): boolean {
    const mime = (doc.file?.mime ?? doc.file?.mimeType ?? "").toString().toLowerCase();
    if (!mime) return false;
    if (mime.includes("audio") || mime.includes("mpeg") || mime.includes("mp3") || mime.includes("ogg") || mime.includes("wav")) return false;
    return mime.includes("pdf");
  }

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getAllDocuments();
        setDocuments(data.documents.filter(isPdfDocument));
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const searchLower = searchQuery.toLowerCase().trim();
    return documents.filter((doc) => {
      const titleMatch = doc.title.toLowerCase().includes(searchLower);
      const assigned = assignToThematicGroup(doc.title);
      const groupMatch = docMatchesGroupSearch(searchLower, assigned);
      return titleMatch || groupMatch;
    });
  }, [documents, searchQuery]);

  const groupedByTheme = useMemo(() => {
    const byGroup: Record<
      string,
      {
        subGroups?: Record<string, { title: string; items: Document[] }>;
        directItems?: Document[];
      }
    > = {};
    const other: Document[] = [];

    for (const doc of filteredDocuments) {
      const assigned = assignToThematicGroup(doc.title);
      if (!assigned) {
        other.push(doc);
        continue;
      }
      const group = MEMBER_SESSION_GROUPS.find((g) => g.id === assigned.groupId);
      if (!group) {
        other.push(doc);
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
      if (
        assigned.subGroupId &&
        bucket.subGroups?.[assigned.subGroupId]
      ) {
        bucket.subGroups[assigned.subGroupId].items.push(doc);
      } else if (bucket.directItems) {
        bucket.directItems.push(doc);
      }
    }

    const sortByDateDesc = (a: Document, b: Document) => {
      const da = parseDocumentTitle(a.title, a.publishedAt).date.getTime();
      const db = parseDocumentTitle(b.title, b.publishedAt).date.getTime();
      return db - da;
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
  }, [filteredDocuments]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <BackToHome />

      <h1 className="text-3xl leading-snug font-bold text-brand-blue font-didot">
        Feedforward Member Sessions
      </h1>
      <p className="mt-2 text-xl text-gray-700 font-plex font-medium">
        Readout Archive & Thematic Groupings
      </p>
      <p className="mt-1 text-base text-subtitle font-plex">
        Last updated: February 2026 &nbsp;&bull;&nbsp; Sessions from Jan 2025 – Feb 2026
      </p>

      <div className="mt-6 mb-6 max-w-xl">
        <div className="relative rounded-xl border-2 border-gray-200 bg-white shadow-md shadow-gray-200/50 focus-within:border-brand-blue focus-within:shadow-[0_0_0_4px_rgba(26,63,105,0.12)] focus-within:ring-0 transition-all duration-200 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" aria-hidden />
          <div className="flex items-center gap-3 pl-5 pr-4 py-3">
            <FaSearch className="shrink-0 text-brand-blue/70 text-lg" aria-hidden />
            <input
              type="text"
              placeholder="Search by title or section (e.g. State of AI, Model Updates)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 py-1 text-base font-plex text-primary placeholder:text-subtitle bg-transparent border-0 focus:outline-none focus:ring-0"
              aria-label="Search documents by title or section"
            />
          </div>
        </div>
        <p className="mt-2 text-sm text-subtitle font-plex">
          Matches document titles and section names (e.g. State of AI, Coding Agents, Enterprise).
        </p>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-subtitle p-12 text-center font-plex">
          {searchQuery ? "No documents match your search" : "No documents found"}
        </div>
      ) : (
        <div className="space-y-10 mt-8">
          {MEMBER_SESSION_GROUPS.map((group) => {
            const bucket = groupedByTheme.byGroup[group.id];
            if (!bucket) return null;
            const hasDirect = (bucket.directItems?.length ?? 0) > 0;
            const hasSubGroups =
              bucket.subGroups &&
              Object.values(bucket.subGroups).some((sg) => sg.items.length > 0);
            if (!hasDirect && !hasSubGroups) return null;

            return (
              <section key={group.id} id={group.id} className="scroll-mt-20">
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
                          <ul className="space-y-2 list-none pl-0">
                            {sg.items.map((doc) => {
                              const { date, sessionTitle } = parseDocumentTitle(
                                doc.title,
                                doc.publishedAt
                              );
                              const fileUrl = doc.file?.url
                                ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${doc.file.url}`
                                : null;
                              return (
                                <li
                                  key={String(doc.id)}
                                  className="flex flex-nowrap items-center gap-x-2 py-1.5 border-b border-gray-100 last:border-b-0"
                                >
                                  <span className="text-base text-primary font-plex shrink-0">
                                    {formatSessionDate(date)} — {sessionTitle}
                                  </span>
                                  {fileUrl && (
                                    <span className="flex shrink-0 items-center gap-2">
                                      <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-brand-blue hover:text-brand-orange text-xs font-medium"
                                      >
                                        <FaExternalLinkAlt size={10} />
                                        View
                                      </a>
                                      <a
                                        href={fileUrl}
                                        download
                                        className="inline-flex items-center gap-1 text-brand-orange hover:opacity-85 text-xs font-medium"
                                      >
                                        <FaDownload size={10} />
                                        Download
                                      </a>
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                  </div>
                ) : (
                  <ul className="space-y-2 list-none pl-0">
                    {bucket.directItems?.map((doc) => {
                      const { date, sessionTitle } = parseDocumentTitle(
                        doc.title,
                        doc.publishedAt
                      );
                      const fileUrl = doc.file?.url
                        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${doc.file.url}`
                        : null;
                      return (
                        <li
                          key={String(doc.id)}
                          className="flex flex-nowrap items-center gap-x-2 py-1.5 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-base text-primary font-plex min-w-0 truncate">
                            {formatSessionDate(date)} — {sessionTitle}
                          </span>
                          {fileUrl && (
                            <span className="flex shrink-0 items-center gap-2">
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-brand-blue hover:text-brand-orange text-xs font-medium"
                              >
                                <FaExternalLinkAlt size={10} />
                                View
                              </a>
                              <a
                                href={fileUrl}
                                download
                                className="inline-flex items-center gap-1 text-brand-orange hover:opacity-85 text-xs font-medium"
                              >
                                <FaDownload size={10} />
                                Download
                              </a>
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}

          {groupedByTheme.other.length > 0 && (
            <section id="other" className="scroll-mt-20">
              <h2 className="text-xl font-bold text-brand-blue font-didot mb-4">
                Other sessions
              </h2>
              <ul className="space-y-2 list-none pl-0">
                {groupedByTheme.other.map((doc) => {
                  const { date, sessionTitle } = parseDocumentTitle(
                    doc.title,
                    doc.publishedAt
                  );
                  const fileUrl = doc.file?.url
                    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${doc.file.url}`
                    : null;
                  return (
                    <li
                      key={String(doc.id)}
                      className="flex flex-nowrap items-center gap-x-2 py-1.5 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-base text-primary font-plex min-w-0 truncate">
                        {formatSessionDate(date)} — {sessionTitle}
                      </span>
                      {fileUrl && (
                        <span className="flex shrink-0 items-center gap-2">
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-brand-blue hover:text-brand-orange text-xs font-medium"
                          >
                            <FaExternalLinkAlt size={10} />
                            View
                          </a>
                          <a
                            href={fileUrl}
                            download
                            className="inline-flex items-center gap-1 text-brand-orange hover:opacity-85 text-xs font-medium"
                          >
                            <FaDownload size={10} />
                            Download
                          </a>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      )}

      <div className="mt-8 text-base text-subtitle font-plex">
        Total: {filteredDocuments.length} document
        {filteredDocuments.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default DocumentsPage;
