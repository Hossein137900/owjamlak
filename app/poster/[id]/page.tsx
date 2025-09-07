import PosterDetailClient from "@/components/static/poster/detailPagePoster";
import { Poster } from "@/types/type";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PosterDetail({ params }: PageProps) {
  const { id } = await params;
  return <PosterDetailClient posterId={id} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://oujamlak.com";

  try {
    const response = await fetch(`${baseUrl}/api/poster/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        title: "آگهی یافت نشد | اوج املاک",
        description: "متأسفانه آگهی مورد نظر یافت نشد.",
      };
    }

    const data = await response.json();
    const poster: Poster = data.poster || data.posters?.[0] || data;

    if (!poster) {
      return {
        title: "آگهی یافت نشد | اوج املاک",
        description: "متأسفانه آگهی مورد نظر یافت نشد.",
      };
    }

    // لیبل‌ها
    const typeLabels: Record<string, string> = {
      residentialRent: "اجاره مسکونی",
      residentialSale: "فروش مسکونی",
      commercialRent: "اجاره تجاری",
      commercialSale: "فروش تجاری",
      shortTermRent: "اجاره کوتاه مدت",
      ConstructionProject: "پروژه ساختمانی",
    };

    const tradeLabels: Record<string, string> = {
      House: "خانه",
      Villa: "ویلا",
      Old: "کلنگی",
      Office: "دفتر کار",
      Shop: "مغازه",
      industrial: "صنعتی",
      partnerShip: "مشارکت",
      preSale: "پیش فروش",
    };

    const getParentTypeLabel = (type: string) => typeLabels[type] || type;
    const getTradeTypeLabel = (type: string) => tradeLabels[type] || type;

    // فرمت قیمت
    const formatPrice = (amount: number) => {
      if (amount === 0) return "توافقی";
      if (amount >= 1_000_000_000)
        return `${(amount / 1_000_000_000).toFixed(1)} میلیارد`;
      if (amount >= 1_000_000)
        return `${(amount / 1_000_000).toFixed(1)} میلیون`;
      return amount.toLocaleString("fa-IR");
    };

    const isRentType =
      poster.parentType === "residentialRent" ||
      poster.parentType === "commercialRent" ||
      poster.parentType === "shortTermRent";

    const priceText = isRentType
      ? `رهن: ${formatPrice(poster.depositRent || 0)} - اجاره: ${formatPrice(
          poster.rentPrice || 0
        )} تومان`
      : `قیمت: ${formatPrice(poster.totalPrice || 0)} تومان`;

    // متا دیتا
    const title = `${poster.title} | ${getParentTypeLabel(
      poster.parentType || ""
    )} ${getTradeTypeLabel(poster.tradeType || "")} | اوج املاک`;

    const description = `${getParentTypeLabel(
      poster.parentType || ""
    )} ${getTradeTypeLabel(poster.tradeType || "")} در ${
      poster.location || "تهران"
    } - ${poster.area} متر - ${poster.rooms} خواب - ${priceText}. ${
      poster.description ? poster.description.substring(0, 100) + "..." : ""
    }`;

    // انتخاب تصویر مستقیم از Cloudinary
    const defaultImage = `${baseUrl}/assets/images/hero.jpg`;
    const imageUrl = poster.images?.length
      ? typeof poster.images[0] === "string"
        ? (poster.images[0] as string).startsWith("http")
          ? (poster.images[0] as string) // مستقیم از Cloudinary
          : `${baseUrl}${poster.images[0] as string}`
        : poster.images[0]?.url || defaultImage
      : defaultImage;

    const keywords = [
      poster.title,
      getParentTypeLabel(poster.parentType || ""),
      getTradeTypeLabel(poster.tradeType || ""),
      poster.location || "",
      "املاک",
      "خرید",
      "فروش",
      "اجاره",
      "رهن",
      "اوج املاک",
      `${poster.area} متر`,
      `${poster.rooms} خواب`,
    ].filter(Boolean);

    return {
      title,
      description,
      keywords: keywords.join(", "),
      authors: [{ name: poster.user?.name || "اوج املاک" }],
      openGraph: {
        title,
        description,
        type: "article",
        url: `${baseUrl}/poster/${poster._id}`,
        siteName: "اوج املاک",
        locale: "fa_IR",
        images: [
          {
            url: imageUrl,
            width: 1200, // سایز واقعی تصویر رو چک کن
            height: 630,
            alt: poster.title,
            type: "image/jpeg",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `${baseUrl}/poster/${poster._id}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "خطا در بارگذاری آگهی | اوج املاک",
      description: "متأسفانه در بارگذاری اطلاعات آگهی خطایی رخ داده است.",
    };
  }
}
