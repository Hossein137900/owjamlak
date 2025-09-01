import OwjAdComponent from "@/components/static/about/aboutHero";
import AboutUsHero from "@/components/static/about/aboutUsHero";
import AboutUsStats from "@/components/static/about/aboutUsStats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره ما | اوج املاک",
  description:
    "با اوج املاک بیشتر آشنا شوید. ما تیمی حرفه‌ای در زمینه خرید، فروش و اجاره ملک در تهران و سراسر ایران هستیم. هدف ما ایجاد تجربه‌ای امن و مطمئن برای معاملات ملکی شماست.",
  keywords: [
    "درباره اوج املاک",
    "تیم مشاوران املاک",
    "املاک تهران",
    "مشاور املاک حرفه‌ای",
    "خرید و فروش ملک",
    "رهن و اجاره",
  ],
  authors: [{ name: "Ouj Amlak" }],
  creator: "Ouj Amlak",
  publisher: "Ouj Amlak",

  openGraph: {
    title: "درباره ما | اوج املاک",
    description:
      "با تیم اوج املاک آشنا شوید؛ همراه مطمئن شما در خرید، فروش و اجاره ملک در تهران و سراسر ایران.",
    url: "https://oujamlak.com/aboutUs",
    siteName: "Ouj Amlak",
    images: [
      {
        url: "https://oujamlak.com/og-image.jpg", // پیشنهاد: یه عکس اختصاصی برای صفحه درباره ما بسازید (1200x630)
        width: 1200,
        height: 630,
        alt: "تیم اوج املاک",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "درباره ما | اوج املاک",
    description:
      "با تیم اوج املاک آشنا شوید؛ مشاوران حرفه‌ای شما در مسیر خرید، فروش و اجاره ملک.",
    images: ["https://oujamlak.com/og-image.jpg"],
  },

  alternates: {
    canonical: "https://oujamlak.com/aboutUs",
  },

  metadataBase: new URL("https://oujamlak.com"),
};

export default function AboutPage() {
  return (
    <section className="w-full bg-white " dir="rtl">
      <OwjAdComponent />
      <div className="px-4 md:px-20">
        <AboutUsHero />

        <AboutUsStats />
      </div>
    </section>
  );
}
