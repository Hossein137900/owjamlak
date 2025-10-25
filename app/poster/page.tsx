import type { Metadata } from "next";
import PosterListPage from "@/components/static/poster/posterList";

export const metadata: Metadata = {
  title: "آگهی های املاک | اوج املاک ایران",
  description:
    "لیست کامل آگهی های خرید، فروش و اجاره ملک در سراسر ایران. از آپارتمان تا ویلا و زمین را در اوج املاک ایران مشاهده کنید.",
  keywords: [
    "آگهی املاک",
    "خرید آپارتمان",
    "فروش ویلا",
    "اجاره ملک",
    "املاک تجاری",
    "آگهی ملک ایران",
  ],
  openGraph: {
    title: "آگهی های املاک | اوج املاک ایران",
    description:
      "مشاهده تمامی آگهی های خرید، فروش و اجاره ملک در ایران با اوج املاک. فرصتی عالی برای سرمایه گذاری و خرید ملک.",
    url: "https://oujamlak.ir/poster",
    siteName: "Ouj Amlak",
    type: "website",
    images: [
      {
        url: "https://oujamlak.ir/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "آگهی های املاک اوج املاک ایران",
      },
    ],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "آگهی های املاک | اوج املاک ایران",
    description:
      "آخرین آگهی های املاک برای خرید، فروش و اجاره در سراسر ایران را در اوج املاک مشاهده کنید.",
    images: ["https://oujamlak.ir/assets/images/poster-cover.jpg"],
  },
  alternates: {
    canonical: "https://oujamlak.ir/poster",
  },
  metadataBase: new URL("https://oujamlak.ir"),
};

export default function PosterPage() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "آگهی های املاک | اوج املاک ایران",
      description: "صفحهی لیست کامل آگهی های املاک ایران شامل خرید، فروش و اجاره ملک.",
      url: "https://oujamlak.ir/poster",
      inLanguage: "fa-IR",
      publisher: {
        "@type": "Organization",
        name: "اوج املاک ایران",
        url: "https://oujamlak.ir",
        logo: { "@type": "ImageObject", url: "https://oujamlak.ir/assets/images/logo.png" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: "https://oujamlak.ir" },
        { "@type": "ListItem", position: 2, name: "آگهی ها", item: "https://oujamlak.ir/poster" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "اوج املاک ایران",
      url: "https://oujamlak.ir",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://oujamlak.ir/poster?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <>
      <PosterListPage />
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
