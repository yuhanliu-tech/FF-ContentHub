// lib/types.ts
// export Interface for Image Data
export interface ImageData {
  url: string;
  mime?: string;
  alternativeText?: string;
  name?: string;
  size?: number;
}

export interface ListItem {
  id: number;
  title: string;
  date?: string;
  link?: string;
  attachment?: ImageData;
}

export interface Doc {
  id: number;
  subtitle?: string;
  content: string; // rich markdown content
  slug: string;
}

export interface Tile {
  id: number;
  title: string;
  slug: string;
  description: string;
  docs?: Doc[]; // Array of Doc content
  createdAt: string; // ISO date string
  cover: ImageData; // Featured image for the tile
  link: string; // External or internal link
  list_items?: ListItem[]; // Direct list items on the tile
  category: "archive" | "tool"; // Category enumeration
}

export interface HomepageHero {
  id: number;
  cover?: ImageData;
  description?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Logo {
  id: number;
  logo?: ImageData[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}