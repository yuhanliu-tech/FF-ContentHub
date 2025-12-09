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

export interface Tile {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: any; // dynamic zone content
  createdAt: string; // ISO date string
  cover: ImageData; // Featured image for the tile
  link: string; // External or internal link
  list_items?: ListItem[]; // Direct list items on the tile
}