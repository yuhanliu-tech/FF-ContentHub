// lib/api.ts
import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_STRAPI_URL}`,
});

// Get all tiles
export const getAllTiles = async (
  page: number = 1,
  searchQuery: string = ""
) => {
  try {
    // If search query exists, filter tiles based on title
    const searchFilter = searchQuery
      ? `&filters[title][$containsi]=${searchQuery}`
      : ""; // Search filter with the title
    // Fetch tiles with pagination and populate the required fields
    const response = await api.get(
      `api/tiles?populate=*&pagination[page]=${page}&pagination[pageSize]=${process.env.NEXT_PUBLIC_PAGE_LIMIT}${searchFilter}`
    );
    return {
      tiles: response.data.data,
      pagination: response.data.meta.pagination, // Return data and include pagination data
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
      `api/tiles?filters[slug]=${slug}&populate=*`
    ); // Fetch a single tile using the slug parameter
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