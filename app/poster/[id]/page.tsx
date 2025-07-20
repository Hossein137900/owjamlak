import PosterDetailClient from "@/components/static/poster/detailPagePoster";
import { Poster } from "@/types/type";
import { Metadata } from "next";

interface PageProps {
  params: {
    id: string;
  };
}

export default function PosterDetail({ params }: PageProps) {
  return <PosterDetailClient posterId={params.id} />;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/poster/id`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          id: params.id,
        },
        // Add cache control for better performance
        // next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

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

    // Helper functions for metadata
    const getParentTypeLabel = (type: string) => {
      const typeLabels: { [key: string]: string } = {
        residentialRent: "اجاره مسکونی",
        residentialSale: "فروش مسکونی",
        commercialRent: "اجاره تجاری",
        commercialSale: "فروش تجاری",
        shortTermRent: "اجاره کوتاه مدت",
        ConstructionProject: "پروژه ساختمانی",
      };
      return typeLabels[type] || type;
    };

    const getTradeTypeLabel = (type: string) => {
      const typeLabels: { [key: string]: string } = {
        House: "خانه",
        Villa: "ویلا",
        Old: "کلنگی",
        Office: "دفتر کار",
        Shop: "مغازه",
        industrial: "صنعتی",
        partnerShip: "مشارکت",
        preSale: "پیش فروش",
      };
      return typeLabels[type] || type;
    };

    const formatPrice = (amount: number) => {
      if (amount === 0) return "توافقی";
      if (amount >= 1000000000) {
        return `${(amount / 1000000000).toFixed(1)} میلیارد`;
      }
      if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)} میلیون`;
      }
      return amount.toLocaleString("fa-IR");
    };

    const isRentType =
      poster.parentType === "residentialRent" ||
      poster.parentType === "commercialRent" ||
      poster.parentType === "shortTermRent";

    // Generate price text for description
    const priceText = isRentType
      ? `رهن: ${formatPrice(poster.depositRent || 0)} - اجاره: ${formatPrice(
          poster.rentPrice || 0
        )} تومان`
      : `قیمت: ${formatPrice(poster.totalPrice || 0)} تومان`;

    // Generate title
    const title = `${poster.title} | ${getParentTypeLabel(
      poster.parentType || ""
    )} ${getTradeTypeLabel(poster.tradeType || "")} | اوج املاک`;

    // Generate description
    const description = `${getParentTypeLabel(
      poster.parentType || ""
    )} ${getTradeTypeLabel(poster.tradeType || "")} در ${
      poster.location || "تهران"
    } - ${poster.area} متر - ${poster.rooms} خواب - ${priceText}. ${
      poster.description ? poster.description.substring(0, 100) + "..." : ""
    }`;

    // Handle images - support both string and object formats
    const images =
      poster.images && poster.images.length > 0
        ? poster.images.map((img) => {
            if (typeof img === "string") {
              return img;
            }
            return img.url || "/assets/images/hero.jpg";
          })
        : ["/assets/images/hero.jpg"];

    // Generate keywords
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
      authors: [
        {
          name: poster.user?.name || "اوج املاک",
        },
      ],
      openGraph: {
        title,
        description,
        type: "article",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/poster/${poster._id}`,
        siteName: "اوج املاک",
        locale: "fa_IR",
        images: [
          {
            url: images[0],
            width: 1200,
            height: 630,
            alt: poster.title,
            type: "image/jpeg",
          },
          ...images.slice(1, 4).map((img) => ({
            url: img,
            width: 800,
            height: 600,
            alt: `تصویر ${poster.title}`,
            type: "image/jpeg",
          })),
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [images[0]],
        creator: "@owjamlak",
        site: "@owjamlak",
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/poster/${poster._id}`,
      },
      other: {
        "property:type": getParentTypeLabel(poster.parentType || ""),
        "property:trade_type": getTradeTypeLabel(poster.tradeType || ""),
        "property:location": poster.location || "",
        "property:area": poster.area?.toString() || "",
        "property:rooms": poster.rooms?.toString() || "",
        "property:price": isRentType
          ? `${poster.depositRent || 0}/${poster.rentPrice || 0}`
          : (poster.totalPrice || 0).toString(),
        "property:coordinates": poster.coordinates
          ? `${poster.coordinates.lat},${poster.coordinates.lng}`
          : "",
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
