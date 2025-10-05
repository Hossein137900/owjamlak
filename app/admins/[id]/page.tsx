import AdminDetailClient from "@/components/static/admins/adminDetailPage";
import { Admin } from "@/types/type";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminDetail({ params }: PageProps) {
  const { id } = await params;
  return <AdminDetailClient adminId={id} />;
}

function getImageUrl(
  imagePath: string | null | undefined,
  baseUrl: string
): string {
  if (!imagePath) return `${baseUrl}/assets/images/default-admin.jpg`;
  if (imagePath.startsWith("http")) return imagePath; // اگر URL خارجی باشه
  const cleanPath = imagePath.startsWith("/") ? imagePath : "/" + imagePath;
  return `${baseUrl}${cleanPath}`; // مثلاً https://oujamlak.ir/uploads/admins/...
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://oujamlak.ir";

  try {
    const response = await fetch(`${baseUrl}/api/admins/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        title: "مدیر یافت نشد | اوج املاک",
        description: "متأسفانه مدیر مورد نظر یافت نشد.",
      };
    }

    const data = await response.json();
    const admin: Admin = data.admin || data.admins?.[0] || data;

    if (!admin) {
      return {
        title: "مدیر یافت نشد | اوج املاک",
        description: "متأسفانه مدیر مورد نظر یافت نشد.",
      };
    }

    // لیبل‌ها و فرمت توضیحات
    const getPositionLabel = (position: string) => position || "مدیر";

    const formatDescription = (desc: string) => {
      if (!desc) return "اطلاعات کامل مدیر در اوج املاک.";
      return (
        desc.replace(/\r\n/g, " ").replace(/•/g, "").substring(0, 150).trim() +
        "..."
      );
    };

    // متا دیتا
    const title = `${admin.name} - ${getPositionLabel(
      admin.position
    )} | اوج املاک`;

    const description = `${getPositionLabel(admin.position)} - ${
      admin.name
    } در اوج املاک. ${formatDescription(admin.description || "")}`.trim();

    // URL تصویر (خام و مطلق)
    const imageUrl = getImageUrl(admin.image || null, baseUrl);

    const keywords = [
      admin.name,
      getPositionLabel(admin.position),
      "مدیر",
      "اوج املاک",
      admin.user?.phone || "",
      admin.email || "",
    ].filter(Boolean);

    return {
      title,
      description,
      keywords: keywords.join(", "),
      authors: [{ name: admin.name || "اوج املاک" }],
      openGraph: {
        title,
        description,
        type: "website",
        url: `${baseUrl}/admins/${admin._id}`,
        siteName: "اوج املاک",
        locale: "fa_IR",
        images: [
          {
            url: imageUrl, // حالا مستقیم https://oujamlak.ir/uploads/admins/...
            width: 1200,
            height: 630,
            alt: admin.name,
            type: admin.image?.endsWith(".webp") ? "image/webp" : "image/jpeg", // تشخیص فرمت
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
        canonical: `${baseUrl}/admins/${admin._id}`,
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
    console.log("Error generating metadata:", error);
    return {
      title: "خطا در بارگذاری مدیر | اوج املاک",
      description: "متأسفانه در بارگذاری اطلاعات مدیر خطایی رخ داده است.",
    };
  }
}
