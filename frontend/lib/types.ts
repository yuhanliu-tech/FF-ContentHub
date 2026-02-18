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
  link_to_single_type: boolean; // Boolean indicating if tile should link to single type page
  list_items?: ListItem[]; // Direct list items on the tile
  category: "archive" | "tool"| "dashboard"; // Category enumeration
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

export interface ExpertBio {
  id: number;
  name: string;
  slug?: string;
  title: string;
  photo?: ImageData;
  bio: string; // rich text content
  advisory_topics?: string | null; // optional richtext: focus areas / example advisory session topics
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ExpertNet {
  id: number;
  title?: string;
  description?: string; // rich text content
  expert_bios?: ExpertBio[]; // Relation to ExpertBio content
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Document {
  id: number;
  title: string;
  file: ImageData;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

/** User identity for app personalization (Discord or mock). id is string for Discord compatibility. */
export interface AppUser {
  id: string;
  username: string;
  avatarUrl?: string;
}

export type AppointmentStatus =
  | "requested"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface Appointment {
  id?: number;
  documentId?: string;
  expert: number | ExpertBio;
  user?: number;
  preferred_date: string;
  preferred_time?: string | null;
  message?: string | null;
  status: AppointmentStatus;
  createdAt?: string;
  updatedAt?: string;
}
