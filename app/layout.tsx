import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import { ray } from "@/next-persian-fonts/ray";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import FooterMobile from "@/components/global/mobileFooter";
import Head from "next/head";
import ChatWidget from "@/components/global/chatWidget";
import CanonicalUrl from "../components/global/CanonicalUrl";

export const metadata: Metadata = {
  title: "املاک اوج | خرید و فروش ملک در تهران",
  description:
    "خرید و فروش آپارتمان، ویلا و زمین با بهترین شرایط در املاک اوج. مشاوره تخصصی املاک در تهران و کرج.",
  keywords:
    "خرید آپارتمان تهران, فروش ویلا کرج, املاک اوج, زمین تهران, مشاوره املاک",
  robots: "index, follow",
  manifest: "/site.webmanifest",
  openGraph: {
    title: "املاک اوج | خرید و فروش ملک در تهران",
    description:
      "املاک اوج، مرجع خرید و فروش ملک در تهران. بهترین فایل‌های آپارتمان، ویلا و زمین.",
    url: "https://example.com",
    siteName: "املاک اوج",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "املاک اوج",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "املاک اوج | خرید و فروش ملک",
    description:
      "مرجع خرید و فروش آپارتمان، ویلا و زمین در تهران با بهترین شرایط.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://example.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/favicon-48x48.png"
        />

        {/* Apple Touch Icon */}
        <link
          rel="apple-touch-icon"
          sizes="160x160"
          href="/apple-touch-icon.png"
        />

        {/* Android / PWA */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Script id="structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "املاک اوج",
          url: "https://oujamlak.com/",
          logo: "https://oujamlak.com/logo.png",
          description: "مرجع خرید و فروش ملک در تهران و کرج",
          address: {
            "@type": "PostalAddress",
            addressLocality: "تهران",
            addressCountry: "IR",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+989122266681",
            contactType: "مشاوره فروش",
          },
        })}
      </Script>
      <body className={ray.className}>
        <Navbar />
        <CanonicalUrl />
        <ChatWidget />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              zIndex: 999999,
            },
          }}
        />{" "}
        {children}
        <FooterMobile />
        <Footer />
      </body>
    </html>
  );
}
