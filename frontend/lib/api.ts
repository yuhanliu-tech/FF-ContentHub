// lib/api.ts
import axios, { AxiosInstance } from "axios";
import { getAuthToken } from "./auth";

export const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_STRAPI_URL}`,
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all tiles
export const getAllTiles = async (searchQuery: string = "") => {
  try {
    // If search query exists, filter tiles based on title
    const searchFilter = searchQuery
      ? `&filters[title][$containsi]=${searchQuery}`
      : ""; // Search filter with the title
    // Fetch all tiles and populate the required fields including nested list_items and docs
    const response = await api.get(
      `api/tiles?populate[0]=cover&populate[1]=list_items.attachment&populate[2]=docs${searchFilter}`
    );
    return {
      tiles: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching tiles:", error);
    throw new Error("Server error"); // Error handling
  }
};

// Get tile by slug
export const getTileBySlug = async (slug: string) => {
  try {
    const response = await api.get(
      `api/tiles?filters[slug]=${slug}&populate[0]=cover&populate[1]=list_items.attachment&populate[2]=docs`
    ); // Fetch a single tile using the slug parameter with proper nested population
    if (response.data.data.length > 0) {
      // If tile exists
      return response.data.data[0]; // Return the tile data
    }
    throw new Error("Tile not found.");
  } catch (error) {
    console.error("Error fetching tile:", error);
    throw new Error("Server error");
  }
};

// Get homepage hero content
export const getHomepageHero = async () => {
  try {
    const response = await api.get(
      "api/homepage-hero?populate=cover"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching homepage hero:", error);
    throw new Error("Server error");
  }
};

// Get logo content
export const getLogo = async () => {
  try {
    const response = await api.get(
      "api/logo?populate=logo"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching logo:", error);
    throw new Error("Server error");
  }
};

// Get all users
export const getUsers = async () => {
  try {
    const response = await api.get("api/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Server error");
  }
};

// Get all documents
export const getAllDocuments = async () => {
  try {
    const response = await api.get("api/documents?populate=file");
    return { documents: response.data.data };
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Server error");
  }
};

// Get expert-net content
export const getExpertNet = async () => {
  try {
    const response = await api.get(
      "api/expert-net?populate[expert_bios][populate]=photo"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching expert-net:", error);
    throw new Error("Server error");
  }
};

// Get a single expert by slug (for dedicated profile pages).
// If no expert has that slug in Strapi yet, falls back to matching by name-derived slug
// so profile pages work before you've re-saved each Expert-Bio in the admin.
export const getExpertBySlug = async (slug: string) => {
  try {
    const response = await api.get(
      `api/expert-bios?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=photo`
    );
    const data = response.data?.data;
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    // Fallback: fetch expert-net and find by slug derived from name (for when slug isn't set in Strapi yet)
    const expertNet = await getExpertNet();
    const bios = expertNet?.expert_bios ?? [];
    const slugFromName = (name: string) =>
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "");
    const match = bios.find(
      (bio: { name?: string; slug?: string }) =>
        (bio.slug && bio.slug === slug) || slugFromName(bio.name ?? "") === slug
    );
    return match ?? null;
  } catch (error) {
    console.error("Error fetching expert by slug:", error);
    throw new Error("Server error");
  }
};

// --- Appointments (expert booking) ---

export const createAppointment = async (data: {
  expert: number;
  preferred_date: string;
  preferred_time?: string;
  message?: string;
}) => {
  try {
    const response = await api.post("api/appointments", {
      data: {
        expert: data.expert,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time ?? null,
        message: data.message ?? null,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const msg =
      error && typeof error === "object" && "response" in error
        ? (error as { response?: { data?: { error?: { message?: string } } } })
            .response?.data?.error?.message
        : null;
    console.error("Error creating appointment:", error);
    throw new Error(msg ?? "Failed to submit booking request");
  }
};

export const getMyAppointments = async () => {
  try {
    const response = await api.get(
      "api/appointments?populate[expert][populate]=photo"
    );
    return response.data.data ?? [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Failed to load your appointments");
  }
};
