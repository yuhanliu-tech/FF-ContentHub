// app/expert-net/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { getExpertNet } from "../../../lib/api";
import { ExpertNet, ExpertBio } from "../../../lib/types";
import Loader from "../../components/Loader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ExpertNetPage = () => {
  const [expertNet, setExpertNet] = useState<ExpertNet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<ExpertBio | null>(null);

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

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 p-8 text-center">{error}</div>;
  if (!expertNet) return <div className="text-gray-500 p-8 text-center">No expert net content found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      {expertNet.title && (
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brand-blue mb-4">
            {expertNet.title}
          </h1>
        </div>
      )}

      {/* Description Section */}
      {expertNet.description && (
        <div className="mb-8">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({children}) => <h1 className="text-3xl font-bold text-brand-blue mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-2xl font-bold text-brand-blue mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-semibold text-brand-blue mb-2">{children}</h3>,
                h4: ({children}) => <h4 className="text-lg font-semibold text-brand-blue mb-2">{children}</h4>,
                p: ({children}) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                li: ({children}) => <li className="text-gray-700">{children}</li>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-brand-blue pl-4 italic text-gray-600 mb-4 bg-gray-50 py-2">{children}</blockquote>,
                code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                pre: ({children}) => <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                a: ({children, href}) => <a href={href} className="text-brand-blue hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
              }}
            >
              {expertNet.description}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Expert Bios Section */}
      {expertNet.expert_bios && expertNet.expert_bios.length > 0 && (
        <div className="mb-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {expertNet.expert_bios.map((bio: ExpertBio) => (
              <div 
                key={bio.id} 
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedExpert(bio)}
              >
                {/* Photo */}
                {bio.photo && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${bio.photo.url}`}
                      alt={bio.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                )}
                {/* Name */}
                <h3 className="text-lg font-semibold text-brand-blue mb-2 text-center">
                  {bio.name}
                </h3>
                {/* Title */}
                <p className="text-gray-600 text-center text-sm">
                  {bio.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expert Bio Popup */}
      {selectedExpert && (
        <div className="fixed inset-0 bg-brand-blue bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-brand-blue inline">{selectedExpert.name}</h2>
                <span className="text-lg text-gray-600 ml-2">{selectedExpert.title}</span>
              </div>
              <button
                onClick={() => setSelectedExpert(null)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 grid md:grid-cols-2 gap-8">
              {/* Left Column - Photo and Title */}
              <div className="flex flex-col items-center">
                {/* Photo */}
                {selectedExpert.photo && (
                  <div className="mb-4">
                    <img
                      src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${selectedExpert.photo.url}`}
                      alt={selectedExpert.name}
                      className="w-48 h-48 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              {/* Right Column - Bio */}
              <div className="flex items-start">
                <div className="prose prose-sm max-w-none text-gray-700">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({children}) => <h1 className="text-2xl font-bold text-brand-blue mb-3">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-bold text-brand-blue mb-2">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-semibold text-brand-blue mb-2">{children}</h3>,
                      h4: ({children}) => <h4 className="text-base font-semibold text-brand-blue mb-2">{children}</h4>,
                      p: ({children}) => <p className="mb-3 text-gray-700 leading-relaxed text-sm">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                      li: ({children}) => <li className="text-gray-700 text-sm">{children}</li>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-brand-blue pl-3 italic text-gray-600 mb-3 bg-gray-50 py-2 text-sm">{children}</blockquote>,
                      code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                      pre: ({children}) => <pre className="bg-gray-900 text-white p-3 rounded-lg overflow-x-auto mb-3 text-sm">{children}</pre>,
                      strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                      em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                      a: ({children, href}) => <a href={href} className="text-brand-blue hover:underline text-sm" target="_blank" rel="noopener noreferrer">{children}</a>,
                    }}
                  >
                    {selectedExpert.bio}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metadata Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-sm text-gray-500 space-y-1">
          <p>Last Updated: {new Date(expertNet.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpertNetPage;