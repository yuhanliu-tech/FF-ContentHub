// app/expert-net/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { getExpertNet } from "../../../lib/api";
import { ExpertNet, ExpertBio } from "../../../lib/types";
import Loader from "../../components/Loader";

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
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: expertNet.description }}
          />
        </div>
      )}

      {/* Expert Bios Section */}
      {expertNet.expert_bios && expertNet.expert_bios.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-brand-blue mb-6">Expert Bios</h2>
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
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: selectedExpert.bio }}
                />
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