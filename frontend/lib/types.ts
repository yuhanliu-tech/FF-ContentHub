// lib/types.ts
// export Interface for Image Data
export interface ImageData {
  url: string;
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
}