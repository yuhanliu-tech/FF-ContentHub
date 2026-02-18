// app/documents/page.tsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { getAllDocuments } from "../../../lib/api";
import { Document } from "../../../lib/types";
import Loader from "../../components/Loader";
import BackToHome from "../../components/BackToHome";
import { FaSearch, FaExternalLinkAlt, FaDownload } from "react-icons/fa";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getAllDocuments();
        setDocuments(data.documents);
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
    if (!searchQuery) return documents;
    return documents.filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [documents, searchQuery]);

  const formatFileSize = (sizeInKB: number): string => {
    if (sizeInKB >= 1024) {
      return `${(sizeInKB / 1024).toFixed(1)} MB`;
    }
    return `${Math.round(sizeInKB)} KB`;
  };

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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <BackToHome />
      <h1 className="flex items-center gap-3 text-2xl font-bold text-brand-blue font-poppins mb-8">
        <span className="inline-block w-2 h-2 rounded-full bg-brand-orange" />
        Documents
      </h1>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input w-full pl-11 pr-4 py-2.5 text-sm font-inter text-primary"
        />
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-subtitle p-12 text-center font-inter">
          {searchQuery ? "No documents match your search" : "No documents found"}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto polished-table bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-brand-blue text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold font-inter">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-inter">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-inter">
                    Size
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold font-inter">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => {
                  const fileUrl = doc.file?.url
                    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${doc.file.url}`
                    : null;

                  return (
                    <tr
                      key={doc.id}
                      className="border-b border-gray-100"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-primary font-inter">
                        {doc.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-subtitle font-inter">
                        {new Date(doc.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-subtitle font-inter">
                        {doc.file?.size
                          ? formatFileSize(doc.file.size)
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        {fileUrl && (
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-blue text-white rounded-lg hover:bg-secondary-blue transition-colors text-xs font-medium"
                            >
                              <FaExternalLinkAlt size={10} />
                              View
                            </a>
                            <a
                              href={fileUrl}
                              download
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-orange text-white rounded-lg hover:opacity-85 transition-opacity text-xs font-medium"
                            >
                              <FaDownload size={10} />
                              Download
                            </a>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5 text-sm text-subtitle font-inter">
            Total: {filteredDocuments.length} document
            {filteredDocuments.length !== 1 ? "s" : ""}
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentsPage;
