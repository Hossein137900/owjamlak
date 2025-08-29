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
    _id: string;
  }>;
  buildingDate: string | number; // Date as string from API
  area: number;
  rooms: number;
  parentType:
    | "residentialRent"
    | "residentialSale"
    | "commercialRent"
    | "commercialSale"
    | "shortTermRent"
    | "ConstructionProject";
  tradeType:
    | "House"
    | "Villa"
    | "Old"
    | "Office"
    | "Shop"
    | "industrial"
    | "partnerShip"
    | "preSale";
  totalPrice: number;
  pricePerMeter: number;
  depositRent?: number; // Optional - only for rent types
  convertible?: boolean; // Optional - for convertible deposits
  rentPrice?: number; // Optional - only for rent types
  location: string;
  favoritesCount?: number;
  consultant?: {
    _id: string;
  };
  // Add coordinates for map functionality
  coordinates: {
    lat: number;
    lng: number;
  };
  // Add detailed location information
  locationDetails?: {
    province?: string;
    city?: string;
    district?: string;
    neighborhood?: string;
    fullAddress?: string;
  };
  contact: string;
  storage: boolean;
  floor?: number; // Optional
  parking: boolean;
  lift: boolean;
  balcony: boolean;
  isApproved: boolean;
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
  video?: string; // Optional video filename
}

export interface Filters {
  search: string;
  // propertyType: string;
  tradeType: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  rooms: string;
  location: string;
  parentType: string;
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
  favorites?: string[];
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

export interface RealStateRequest {
  _id: string;
  name: string;
  lastName: string;
  phone: string;
  email: string | null;
  description: string;
  type: "Apartment" | "Villa" | "EmptyEarth" | "Commercial" | "Other";
  serviceType: "Buy" | "Sell" | "Rent" | "Mortgage" | "Pricing";
  budget: number | null;
  status?: "pending" | "processed" | "rejected";
  createdAt?: string;
  __v?: number;
}
export interface EmployRequest {
  _id: string;
  name: string;
  lastName: string;
  phone: string;
  email: string | null;
  description: string;
  file: string;
  type: "Consultation" | "LegalConsultation" | "Investor" | "Others";
  education: "Diploma" | "Bachelor" | "Master" | "Phd";
  status: "pending" | "processed" | "rejected";
  createdAt: string;
}
export interface LegalRequest {
  _id: string;
  name: string;
  lastName: string;
  phone: string;
  email?: string;
  description: string;
  type: "Contract" | "Solve" | "DocumentReview" | "Other";
}
export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  contentHtml: string;
  seoTitle: string;
  images: string[];
  tags: string[];
  tableOfContents: string[];
}
