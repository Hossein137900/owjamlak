import type { Metadata } from "next";
import BlogContainer from "@/components/static/blogs/blogContainer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "وبلاگ اوج | مقالات و راهنمای خرید و فروش ملک",
  description:
    "در وبلاگ اوج املاک جدیدترین مقالات، نکات حقوقی، راهنمای خرید و فروش، اجاره و سرمایه‌گذاری در بازار مسکن ایران را بخوانید. با مشاوران حرفه‌ای ما همراه باشید.",
  keywords: [
    "وبلاگ املاک",
    "مقالات املاک",
    "خرید ملک",
    "فروش آپارتمان",
    "سرمایه گذاری در املاک",
    "نکات حقوقی ملک",
    "مشاور املاک",
    "رهن و اجاره",
  ],
  openGraph: {
    title: "وبلاگ اوج | مقالات و راهنمای خرید و فروش ملک",
    description:
      "جدیدترین مقالات و راهنمای خرید، فروش و سرمایه‌گذاری در املاک ایران را در وبلاگ اوج بخوانید.",
    url: "https://oujamlak.ir/blogs",
    siteName: "Ouj Amlak",
    images: [
      {
        url: "https://oujamlak.ir/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "وبلاگ اوج املاک",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "وبلاگ اوج | مقالات و راهنمای خرید و فروش ملک",
    description:
      "مقالات تخصصی درباره خرید، فروش، اجاره و سرمایه‌گذاری در املاک ایران با مشاوران اوج.",
    images: ["https://oujamlak.ir/og-image.jpg"],
  },
  alternates: {
    canonical: "https://oujamlak.ir/blogs",
  },
  metadataBase: new URL("https://oujamlak.ir"),
};

const BlogsPage = () => {
  return (
    <main className="">
      <BlogContainer />
    </main>
  );
};

export default BlogsPage;
