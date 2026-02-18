// app/expert-net/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getExpertNet } from "../../../lib/api";
import { ExpertNet, ExpertBio } from "../../../lib/types";
import { slugFromName } from "../../../lib/expertAdvisoryTopics";
import Loader from "../../components/Loader";
import BackToHome from "../../components/BackToHome";
import { FaUser, FaArrowRight, FaCalendarCheck } from "react-icons/fa";

function expertSlug(bio: ExpertBio): string {
  return (bio.slug && bio.slug.trim()) ? bio.slug.trim() : slugFromName(bio.name);
}

const ExpertNetPage = () => {
  const [expertNet, setExpertNet] = useState<ExpertNet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpertNet = async () => {
      try {
        const data = await getExpertNet();
        if (data && data.publishedAt) {
          setExpertNet(data);
        } else {
          setError("Expert-Net content is not yet published");
        }
      } catch (err) {
        console.error("Error fetching expert net:", err);
        setError("Failed to load expert net content");
      } finally {
        setLoading(false);
      }
    };
    fetchExpertNet();
  }, []);

  /** Strip markdown to plain text for preview excerpts */
  const plainText = (md: string) =>
    md
      .replace(/#{1,6}\s+/g, "")
      .replace(/\*{1,3}(.*?)\*{1,3}/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[`~>|]/g, "")
      .replace(/\n{2,}/g, " ")
      .replace(/\n/g, " ")
      .trim();

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
  if (!expertNet)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">No expert net content found</p>
      </div>
    );

  const bios = expertNet.expert_bios ?? [];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* ─── Header (main-page style: title + elegant orange line) ─── */}
        <section className="max-w-6xl mx-auto px-6 pt-8 pb-2 card-animate-in">
          <BackToHome label="Content Hub" />
          {expertNet.title && (
            <h1 className="text-2xl md:text-3xl font-semibold text-brand-blue font-poppins mt-4">
              {expertNet.title}
            </h1>
          )}
          <p className="text-base text-subtitle font-inter mt-2 mb-6">
            To ask questions or book an expert session, email{" "}
            <a
              href="mailto:maddie@feedforward.ai"
              className="text-subtitle hover:underline underline-offset-2"
            >
              maddie@feedforward.ai
            </a>
            .
          </p>
          <div className="gradient-divider mb-14" />
        </section>

        {/* ─── Card Grid ────────────────────────────────────── */}
        {bios.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-20">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {bios.map((bio: ExpertBio, idx: number) => {
                const excerpt = plainText(bio.bio);
                const slug = expertSlug(bio);

                return (
                  <div
                    key={bio.id}
                    className="expert-card card-animate-in group block relative"
                    style={
                      { "--delay": `${idx * 100}ms` } as React.CSSProperties
                    }
                  >
                  <Link
                    href={`/expert-net/${slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={`View ${bio.name} profile`}
                  />
                    {/* Photo */}
                    {bio.photo ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${bio.photo.url}`}
                        alt={bio.name}
                        className="expert-card__img"
                      />
                    ) : (
                      <div className="expert-card__img bg-secondary-blue flex items-center justify-center">
                        <FaUser className="text-white/30 text-6xl" />
                      </div>
                    )}

                    {/* Gradient scrim */}
                    <div className="expert-card__scrim" />

                    {/* Round avatar – upper left */}
                    <div
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        left: "0.75rem",
                        zIndex: 30,
                        pointerEvents: "auto",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget.querySelector("[data-avatar]") as HTMLElement;
                        if (el) el.style.animation = "avatarSpin 0.6s ease forwards";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget.querySelector("[data-avatar]") as HTMLElement;
                        if (el) el.style.animation = "none";
                      }}
                    >
                      {bio.photo ? (
                        <img
                          data-avatar
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${bio.photo.url}`}
                          alt={bio.name}
                          style={{
                            width: "3.5rem",
                            height: "3.5rem",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "3px solid #e9a059",
                            outline: "2.5px solid rgba(255,255,255,0.8)",
                            boxShadow: "0 3px 14px rgba(0,0,0,0.3)",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div
                          data-avatar
                          style={{
                            width: "3.5rem",
                            height: "3.5rem",
                            borderRadius: "50%",
                            border: "3px solid #e9a059",
                            outline: "2.5px solid rgba(255,255,255,0.8)",
                            boxShadow: "0 3px 14px rgba(0,0,0,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#536c89",
                          }}
                        >
                          <FaUser style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem" }} />
                        </div>
                      )}
                    </div>

                    {/* Content overlay */}
                    <div className="expert-card__content text-white">
                      {/* Always-visible: name + title */}
                      <h3 className="text-xl font-bold font-poppins leading-snug">
                        {bio.name}
                      </h3>
                      <p className="mt-1 text-sm text-brand-orange font-medium font-inter">
                        {bio.title}
                      </p>

                      {/* Revealed on hover */}
                      <div className="expert-card__detail">
                        <div className="mt-4 h-px w-10 bg-brand-orange/60" />

                        <p className="mt-4 text-sm text-white/75 leading-relaxed font-inter line-clamp-4">
                          {excerpt.slice(0, 180)}
                          {excerpt.length > 180 ? "..." : ""}
                        </p>

                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-orange tracking-wide uppercase font-inter">
                          View Profile <FaArrowRight size={10} />
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/expert-net/${slug}#book-session`}
                      className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-3 py-2 text-xs font-semibold text-white font-inter hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaCalendarCheck size={12} /> Book session
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer metadata */}
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <div className="border-t border-gray-200 pt-6 text-sm text-subtitle font-inter">
            Last Updated:{" "}
            {new Date(expertNet.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertNetPage;
