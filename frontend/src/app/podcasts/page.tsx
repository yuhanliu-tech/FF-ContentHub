// app/podcasts/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getAllDocuments } from "../../../lib/api";
import { Document } from "../../../lib/types";
import Loader from "../../components/Loader";
import BackToHome from "../../components/BackToHome";
import { FaPlay, FaSearch, FaHeadphones } from "react-icons/fa";

const PodcastsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const data = await getAllDocuments();
        setDocuments(data.documents);
      } catch (err) {
        console.error("Error fetching podcasts:", err);
        setError("Failed to load podcasts");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const podcastDocs = useMemo(
    () =>
      documents.filter(
        (doc) => doc.file?.mime && doc.file.mime.startsWith("audio/")
      ),
    [documents]
  );

  const filteredPodcasts = useMemo(() => {
    if (!searchQuery) return podcastDocs;
    return podcastDocs.filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [podcastDocs, searchQuery]);

  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <BackToHome />
      {/* Header */}
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-brand-blue font-poppins">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-brand-orange/90 text-white shadow-md">
              <FaHeadphones size={16} />
            </span>
            Podcasts
          </h1>
          <p className="mt-3 text-subtitle font-inter max-w-xl text-sm md:text-base">
            Dive into Feedforward conversations, interviews and explainers.
            Hit play and keep browsing &mdash; the player stays right where you
            left it.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-xs">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search episodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input w-full pl-11 pr-4 py-2.5 text-sm font-inter text-primary bg-white"
          />
        </div>
      </header>

      {/* Empty state */}
      {filteredPodcasts.length === 0 ? (
        <div className="text-subtitle p-12 text-center font-inter bg-white/70 rounded-2xl border border-card">
          {searchQuery
            ? "No podcasts match your search."
            : "No podcasts available yet. New episodes will appear here."}
        </div>
      ) : (
        <section className="space-y-4">
          {filteredPodcasts.map((podcast) => {
            const fileUrl = podcast.file?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${podcast.file.url}`
              : null;

            return (
              <article
                key={podcast.id}
                className="group rounded-2xl bg-white/90 border border-card shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center">
                  {/* Left: meta + title */}
                  <div className="flex-1 px-6 py-4 md:py-5">
                    <div className="flex items-center gap-3 text-xs font-inter text-subtitle mb-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-peach/60 text-brand-blue font-medium">
                        <FaPlay size={9} />
                        Episode
                      </span>
                      <span>{formatDate(podcast.publishedAt)}</span>
                    </div>

                    <h2 className="text-lg md:text-xl font-semibold text-brand-blue font-poppins mb-1 line-clamp-2">
                      {podcast.title}
                    </h2>

                    {podcast.file?.name && (
                      <p className="text-xs text-subtitle font-inter">
                        File: {podcast.file.name}
                      </p>
                    )}
                  </div>

                  {/* Right: player */}
                  <div className="w-full md:w-[320px] bg-brand-blue/95 px-5 py-4 flex items-center gap-4">
                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-brand-orange text-white shadow-md group-hover:scale-105 transition-transform">
                      <FaPlay size={14} />
                    </div>

                    <div className="flex-1">
                      {fileUrl ? (
                        <audio
                          controls
                          className="w-full accent-brand-orange [&::-webkit-media-controls-panel]:bg-transparent"
                        >
                          <source src={fileUrl} type={podcast.file?.mime} />
                          Your browser does not support the audio element.
                        </audio>
                      ) : (
                        <p className="text-xs text-white/80 font-inter">
                          Audio file missing
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <p className="mt-4 text-xs text-subtitle font-inter">
            Showing {filteredPodcasts.length} podcast
            {filteredPodcasts.length !== 1 ? "s" : ""}.
          </p>
        </section>
      )}
    </div>
  );
};

export default PodcastsPage;

