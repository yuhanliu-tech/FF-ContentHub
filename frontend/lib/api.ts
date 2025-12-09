// lib/api.ts
import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_STRAPI_URL}`,
});

// Get all tiles
export const getAllTiles = async (searchQuery: string = "") => {
  try {
    // If search query exists, filter tiles based on title
    const searchFilter = searchQuery
      ? `&filters[title][$containsi]=${searchQuery}`
      : ""; // Search filter with the title
    // Fetch all tiles and populate the required fields including nested list_items
    const response = await api.get(
      `api/tiles?populate[0]=cover&populate[1]=list_items.attachment&populate[2]=content${searchFilter}`
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
      `api/tiles?filters[slug]=${slug}&populate[0]=cover&populate[1]=list_items.attachment&populate[2]=content`
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