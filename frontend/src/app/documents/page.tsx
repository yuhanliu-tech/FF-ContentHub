// app/documents/page.tsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { getAllDocuments } from "../../../lib/api";
import { Document } from "../../../lib/types";
import Loader from "../../components/Loader";
import BackToHome from "../../components/BackToHome";
import { FaSearch, FaExternalLinkAlt, FaDownload } from "react-icons/fa";
import { MEMBER_SESSION_GROUPS } from "../tiles/member-sessions-config";
import {
  CANONICAL_MEMBER_SESSIONS,
  type CanonicalSectionSession,
} from "./canonical-member-sessions";

/** Parse session title from Strapi document title (e.g. "Apr 2, 2025 call readout_Session Name"). */
function getSessionTitleFromDoc(title: string): string {
  const afterReadout = title.match(/call\s*readout[_:\s]+(.+)$/i);
  if (afterReadout?.[1]) return afterReadout[1].trim();
  return title;
}

/** Normalize for matching: lowercase, collapse spaces, remove smart quotes. */
function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** True if the Strapi document title (parsed session title) matches this canonical session. */
function docMatchesCanonicalSession(docTitle: string, canonical: CanonicalSectionSession): boolean {
  const docSession = getSessionTitleFromDoc(docTitle);
  const a = normalizeForMatch(canonical.title);
  const b = normalizeForMatch(docSession);
  return b.includes(a) || a.includes(b);
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
        // Still show the canonical list; View/Download links will appear when Strapi has documents
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  /** Map each canonical session to a Strapi document if one matches (by title). */
  const canonicalToDocument = useMemo(() => {
    const map = new Map<CanonicalSectionSession, Document | null>();
    const usedDocIds = new Set<string | number>();
    for (const session of CANONICAL_MEMBER_SESSIONS) {
      const matched = documents.find(
        (doc) =>
          !usedDocIds.has(doc.id) && docMatchesCanonicalSession(doc.title, session)
      );
      if (matched) {
        map.set(session, matched);
        usedDocIds.add(matched.id);
      } else {
        map.set(session, null);
      }
    }
    return map;
  }, [documents]);

  /** Filter canonical sessions by search (title, group, subgroup, description). */
  const filteredCanonicalSessions = useMemo(() => {
    if (!searchQuery.trim()) return CANONICAL_MEMBER_SESSIONS;
    const q = searchQuery.toLowerCase().trim();
    const groupMatches = (groupId: string, subGroupId?: string) => {
      const group = MEMBER_SESSION_GROUPS.find((g) => g.id === groupId);
      if (!group) return false;
      if (group.title.toLowerCase().includes(q)) return true;
      if (group.description?.toLowerCase().includes(q)) return true;
      if (subGroupId) {
        const sg = group.subGroups?.find((s) => s.id === subGroupId);
        if (sg?.title.toLowerCase().includes(q)) return true;
      }
      return false;
    };
    return CANONICAL_MEMBER_SESSIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) || groupMatches(s.groupId, s.subGroupId)
    );
  }, [searchQuery]);

  /** Group filtered canonical sessions by groupId / subGroupId (preserving order). */
  const groupedCanonical = useMemo(() => {
    const byGroup: Record<
      string,
      {
        subGroups?: Record<string, { title: string; sessions: CanonicalSectionSession[] }>;
        directSessions?: CanonicalSectionSession[];
      }
    > = {};
    for (const session of filteredCanonicalSessions) {
      const group = MEMBER_SESSION_GROUPS.find((g) => g.id === session.groupId);
      if (!group) continue;
      if (!byGroup[session.groupId]) {
        if (group.subGroups) {
          byGroup[session.groupId] = {
            subGroups: Object.fromEntries(
              group.subGroups.map((sg) => [sg.id, { title: sg.title, sessions: [] }])
            ),
          };
        } else {
          byGroup[session.groupId] = { directSessions: [] };
        }
      }
      const bucket = byGroup[session.groupId];
      if (session.subGroupId && bucket.subGroups?.[session.subGroupId]) {
        bucket.subGroups[session.subGroupId].sessions.push(session);
      } else if (bucket.directSessions) {
        bucket.directSessions.push(session);
      }
    }
    return { byGroup: byGroup };
  }, [filteredCanonicalSessions]);

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

      {filteredCanonicalSessions.length === 0 ? (
        <div className="text-subtitle p-12 text-center font-plex">
          {searchQuery ? "No sessions match your search" : "No sessions found"}
        </div>
      ) : (
        <div className="space-y-10 mt-8">
          {MEMBER_SESSION_GROUPS.map((group) => {
            const bucket = groupedCanonical.byGroup[group.id];
            if (!bucket) return null;
            const hasDirect = (bucket.directSessions?.length ?? 0) > 0;
            const hasSubGroups =
              bucket.subGroups &&
              Object.values(bucket.subGroups).some((sg) => sg.sessions.length > 0);
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
                      .filter(([, sg]) => sg.sessions.length > 0)
                      .map(([subId, sg]) => (
                        <div key={subId}>
                          <h3 className="text-base font-semibold text-brand-blue font-didot mb-2">
                            {sg.title}
                          </h3>
                          <ul className="space-y-2 list-none pl-0">
                            {sg.sessions.map((session, idx) => {
                              const doc = canonicalToDocument.get(session);
                              const fileUrl =
                                doc?.file?.url &&
                                `${process.env.NEXT_PUBLIC_STRAPI_URL}${doc.file.url}`;
                              const showLinkTbd = session.linkTbd && !fileUrl;
                              return (
                                <li
                                  key={`${session.groupId}-${session.subGroupId}-${idx}-${session.date}-${session.title.slice(0, 30)}`}
                                  className="flex flex-nowrap items-center gap-x-2 py-1.5 border-b border-gray-100 last:border-b-0"
                                >
                                  <span className="text-base text-primary font-plex shrink-0">
                                    {session.date} — {session.title}
                                    {showLinkTbd && (
                                      <span className="text-subtitle font-normal"> [link TBD]</span>
                                    )}
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
                    {bucket.directSessions?.map((session, idx) => {
                      const doc = canonicalToDocument.get(session);
                      const fileUrl =
                        doc?.file?.url &&
                        `${process.env.NEXT_PUBLIC_STRAPI_URL}${doc.file.url}`;
                      const showLinkTbd = session.linkTbd && !fileUrl;
                      return (
                        <li
                          key={`${session.groupId}-${idx}-${session.date}-${session.title.slice(0, 30)}`}
                          className="flex flex-nowrap items-center gap-x-2 py-1.5 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-base text-primary font-plex min-w-0 truncate">
                            {session.date} — {session.title}
                            {showLinkTbd && (
                              <span className="text-subtitle font-normal"> [link TBD]</span>
                            )}
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
        </div>
      )}

      <div className="mt-8 text-base text-subtitle font-plex">
        Total: {filteredCanonicalSessions.length} session
        {filteredCanonicalSessions.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default DocumentsPage;
