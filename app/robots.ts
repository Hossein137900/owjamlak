import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/addBlog/", "/auth/"],
      },
    ],
    sitemap: "https://oujamlak.com/sitemap.xml",
  };
}
