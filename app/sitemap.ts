import { Blog, Consultant, Poster } from "@/types/type";
import { MetadataRoute } from "next";

const BASE_URL = "https://oujamlak.ir";

// Static pages configuration
const staticPages = [
  { url: "", priority: 1.0, changeFrequency: "daily" as const },
  { url: "/aboutUs", priority: 0.8, changeFrequency: "monthly" as const },
  { url: "/auth", priority: 0.5, changeFrequency: "yearly" as const },
  { url: "/blogs", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/consultant", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/contactUs", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/offers", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/poster", priority: 0.9, changeFrequency: "hourly" as const },
  { url: "/services", priority: 0.8, changeFrequency: "monthly" as const },
  {
    url: "/services/Collaboration",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    url: "/services/legalConsultation",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    url: "/services/realEstateConsultation",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  { url: "/terms", priority: 0.5, changeFrequency: "yearly" as const },
  { url: "/videos", priority: 0.6, changeFrequency: "weekly" as const },
];

// Fetch dynamic data
async function fetchBlogs() {
  try {
    const response = await fetch(`${BASE_URL}/api/blog`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const blogs = await response.json();
    return Array.isArray(blogs) ? blogs : [];
  } catch {
    return [];
  }
}

async function fetchConsultants() {
  try {
    const response = await fetch(`${BASE_URL}/api/consultants`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const consultants = await response.json();
    return Array.isArray(consultants) ? consultants : [];
  } catch {
    return [];
  }
}

async function fetchPosters() {
  try {
    const response = await fetch(`${BASE_URL}/api/poster`, {
      next: { revalidate: 1800 },
    });
    if (!response.ok) return [];
    const posters = await response.json();
    return Array.isArray(posters) ? posters : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get current date for lastModified
  const now = new Date();

  // Static pages
  const staticUrls = staticPages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Dynamic blog pages
  const blogs = await fetchBlogs();
  const blogUrls = blogs.map((blog: Blog) => ({
    url: `${BASE_URL}/blogs/${blog.id}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic consultant pages
  const consultants = await fetchConsultants();
  const consultantUrls = consultants.map((consultant: Consultant) => ({
    url: `${BASE_URL}/consultant/${consultant._id}`,
    lastModified: consultant.updatedAt ? new Date(consultant.updatedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic poster pages
  const posters = await fetchPosters();
  const posterUrls = posters.map((poster: Poster) => ({
    url: `${BASE_URL}/poster/${poster._id}`,
    lastModified: poster.updatedAt ? new Date(poster.updatedAt) : now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...blogUrls, ...consultantUrls, ...posterUrls];
}
