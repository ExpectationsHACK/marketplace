// Domain types mirroring the target Prisma schema.
// Kept as plain TS types so the mock-data layer below can be swapped for
// real API/DB calls later without touching component code.

export type Role = "USER" | "ADMIN" | "MODERATOR";
export type Plan = "FREE" | "PRO" | "BUSINESS";
export type ListingStatus = "ACTIVE" | "SOLD" | "EXPIRED" | "REMOVED";
export type Category =
  | "FOR_SALE"
  | "HOUSING"
  | "JOBS"
  | "SERVICES"
  | "GIGS"
  | "COMMUNITY";

export interface GeoLocation {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  phone: string;
  email?: string;
  verified: boolean;
  trustScore: number; // 0-100
  role: Role;
  memberSince: string; // ISO date
  responseTime?: string; // e.g. "usually replies within an hour"
}

export type DomainStatus = "NONE" | "PENDING" | "VERIFIED";

export interface Storefront {
  id: string;
  ownerId: string;
  slug: string;
  name: string;
  bio: string;
  logoUrl: string;
  coverUrl: string;
  whatsappNumber: string;
  category: string;
  city: string;
  isVerified: boolean;
  plan: Plan;
  productIds: string[];
  followers: number;
  responseRate: number; // 0-100
  customDomain?: string; // e.g. "kwamesneaks.com" — reserved for backend DNS/SSL verification
  domainStatus: DomainStatus; // stays NONE/PENDING on the frontend; VERIFIED is backend-only
}

export interface Product {
  id: string;
  storefrontId: string;
  title: string;
  price: number;
  currency: string;
  images: string[];
  inStock: boolean;
  category: string;
  description: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  category: Category;
  title: string;
  description: string;
  price?: number;
  currency: string;
  images: string[];
  location: GeoLocation;
  status: ListingStatus;
  createdAt: string;
  expiresAt?: string;
  featured?: boolean;
}

export interface Review {
  id: string;
  fromUserId: string;
  toUserId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  attachments?: string[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  listingId?: string;
  participantIds: string[];
  messages: Message[];
}
