import { ReactNode } from "react";

export interface Offer {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  price: string;
  discountedPrice?: string;
  discount?: string;
  type: string;
  category: string;
  features: string[];
  expiryDate: string;
  featured: boolean;
  icon: ReactNode;
  size?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: boolean;
  createdAt?: string;
}

export interface Poster {
  _id: string;
  views: number;
  title: string;
  description: string;
  images: Array<{
    alt: string;
    url: string;
    mainImage: boolean;
  }>;
  buildingDate: string; // Date as string from API
  area: number;
  rooms: number;
  propertyType:
    | "residential"
    | "administrative"
    | "commercial"
    | "industrial"
    | "old";
  tradeType: "rent" | "fullRent" | "buy" | "sell";
  totalPrice: number;
  pricePerMeter: number;
  depositRent?: number; // Optional - only for rent types
  convertible?: boolean; // Optional - for convertible deposits
  rentPrice?: number; // Optional - only for rent types
  location: string;
  contact: string;
  storage: boolean;
  floor?: number; // Optional
  parking: boolean;
  lift: boolean;
  tag: string;
  user: {
    _id: string;
    name: string;
    phone: string;
    role?: "admin" | "user" | "superadmin" | "consultant";
  };
  type: "normal" | "investment";
  createdAt: string;
  updatedAt: string;
  status: "active" | "pending" | "sold" | "rented";
}

export interface Filters {
  search: string;
  propertyType: string;
  tradeType: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  rooms: string;
  location: string;
}

export interface ConsultantChampion {
  _id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  rating: number;
  totalSales: number;
  experience?: number;
  phone: string;
  email: string;
  isTopConsultant?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id?: string;
  name: string;
  password: string;
  phone: string;
  role: "admin" | "user" | "superadmin" | "consultant";
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Consultant {
  name: string;
  _id: string;
  phone: string;
  whatsapp: string;
  email?: string;
  image: string;
  experienceYears: number;
  posterCount: number;
  workAreas: string[];
  specialties: string[];
  rating?: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
