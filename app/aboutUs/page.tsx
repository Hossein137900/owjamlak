import OwjAdComponent from "@/components/static/about/aboutHero";
import AboutUsHero from "@/components/static/about/aboutUsHero";
import AboutUsStats from "@/components/static/about/aboutUsStats";
import SimpleMarquee from "@/components/static/about/marquee";
import PdfDownload from "@/components/static/about/pdfDownload";
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
    url: "https://oujamlak.ir/aboutUs",
    siteName: "Ouj Amlak",
    images: [
      {
        url: "https://oujamlak.ir/og-image.jpg", // پیشنهاد: یه عکس اختصاصی برای صفحه درباره ما بسازید (1200x630)
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
    images: ["https://oujamlak.ir/og-image.jpg"],
  },

  alternates: {
    canonical: "https://oujamlak.ir/aboutUs",
  },

  metadataBase: new URL("https://oujamlak.ir"),
};

export default function AboutPage() {
  return (
    <section className="w-full bg-white " dir="rtl">
      <OwjAdComponent />
      <div className="px-4 md:px-20">
        <AboutUsHero />

        <AboutUsStats />
        <SimpleMarquee
          images={[
            "/assets/images/madarek/madrak1.jpg",
            "/assets/images/madarek/madrak2.jpg",
            "/assets/images/madarek/madrak3.jpg",
            "/assets/images/madarek/madrak4.jpg",
            "/assets/images/madarek/madrak5.jpg",
            "/assets/images/madarek/madrak6.jpg",
            "/assets/images/madarek/madrak7.jpg",
          ]}
          speed={10} // هر چی عدد کمتر باشه سریع‌تر میشه
          pauseOnHover={false}
          imageHeight={250}
        />

        <div className="py-12">
          <PdfDownload
            bookImage="/assets/images/bookimage.jpg"
            pdfUrl="/assets/files/book.pdf"
            title="راهنمای جامع خرید و فروش املاک"
            description="با این کتاب، یاد بگیرید چگونه داستان‌های جذاب برای مشتریان خود بسازید و فروش خود را افزایش دهید!"
          />
        </div>
      </div>
    </section>
  );
}
