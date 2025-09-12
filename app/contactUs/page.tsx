import type { Metadata } from "next";
import ContactFaq from "@/components/static/contact/contact-faq";
import ContactForm from "@/components/static/contact/contact-form";
import ContactHero from "@/components/static/contact/contact-hero";
import ContactInfo from "@/components/static/contact/contact-info";
import ContactMap from "@/components/static/contact/contact-map";

export const metadata: Metadata = {
  title: "تماس با ما | اوج املاک",
  description:
    "با تیم اوج املاک در تماس باشید. آماده پاسخگویی به سوالات، درخواست‌ها و مشاوره در زمینه خرید، فروش و اجاره ملک هستیم.",
  keywords: [
    "تماس با اوج املاک",
    "اطلاعات تماس املاک",
    "مشاوره املاک",
    "پشتیبانی املاک",
    "آدرس املاک اوج",
    "شماره تماس مشاور املاک",
  ],
  openGraph: {
    title: "تماس با ما | اوج املاک",
    description:
      "با تیم اوج املاک در تماس باشید و سوالات یا درخواست‌های خود را مطرح کنید. مشاوران ما آماده پاسخگویی هستند.",
    url: "https://oujamlak.ir/contactUs",
    siteName: "Ouj Amlak",
    type: "website",
    images: [
      {
        url: "https://oujamlak.ir/og-image.jpg", // پیشنهاد: تصویر اختصاصی صفحه تماس
        width: 1200,
        height: 630,
        alt: "تماس با اوج املاک",
      },
    ],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "تماس با ما | اوج املاک",
    description:
      "با تیم اوج املاک در تماس باشید و درخواست مشاوره یا سوالات خود را مطرح کنید. پشتیبانی حرفه‌ای برای معاملات ملکی شما.",
    images: ["https://oujamlak.ir/og-image.jpg"],
  },
  alternates: {
    canonical: "https://oujamlak.ir/contactUs",
  },
  metadataBase: new URL("https://oujamlak.ir"),
};

export default function ContactPage() {
  return (
    <main dir="rtl">
      <ContactHero />
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ContactInfo />
        </div>
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
      <ContactMap />
      <ContactFaq />
    </main>
  );
}
