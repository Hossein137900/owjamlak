"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  FaHome,
  FaMapMarkerAlt,
  FaBed,
  FaRulerCombined,
  FaCalendarAlt,
  FaWarehouse,
  FaParking,
  FaElementor,
  FaPhone,
  FaShare,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
  FaUser,
  FaClock,
  FaEye,
} from "react-icons/fa";
import { MdBalcony } from "react-icons/md";
import { FiLoader, FiPlay } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import GalleryModal from "@/components/static/poster/galleryModal";
import { Poster } from "@/types/type";

const LeafletMap = dynamic(
  () => import("@/components/static/poster/leafletMap"),
  { ssr: false }
);

interface PosterDetailClientProps {
  posterId: string;
}

export default function PosterDetailClient({
  posterId,
}: PosterDetailClientProps) {
  const id = posterId;
  const [posterData, setPosterData] = useState<Poster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [[currentImageIndex], setCurrentImage] = useState([0, 0]);

  // Reset to index 0 when poster data changes to ensure video shows first
  useEffect(() => {
    if (posterData) {
      setCurrentImage([0, 0]);
    }
  }, [posterData]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [userId, setUserId] = useState("");
  const [hasValidToken, setHasValidToken] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setHasValidToken(false);
        setLoading(false);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        setHasValidToken(!isExpired);

        if (isExpired) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/auth/id`, {
          method: "GET",
          headers: { token },
        });

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();
        if (data) {
          setUserId(data.id);
          if (
            posterData?._id &&
            data.favorite &&
            Array.isArray(data.favorite)
          ) {
            setIsFavorite(data.favorite.includes(posterData._id));
          }
        }
      } catch (error) {
        console.log("Error fetching user info:", error);
        setHasValidToken(false);
        setError("خطا در دریافت اطلاعات کاربر");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [posterData?._id]);

  useEffect(() => {
    if (!posterId) return;

    const incrementView = async () => {
      const storageKey = `poster_viewed_${posterId}`;
      if (localStorage.getItem(storageKey)) return;

      try {
        const response = await fetch("/api/poster/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: posterId }),
        });

        const data = await response.json();
        if (data.success) {
          localStorage.setItem(storageKey, "true");
        }
      } catch (error) {
        console.error("Error incrementing view:", error);
      }
    };

    incrementView();
  }, [posterId]);

  const fetchPosterData = async () => {
    if (!id) {
      setError("شناسه آگهی معتبر نیست");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(`/api/poster/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("آگهی یافت نشد");
        throw new Error(`خطا در دریافت اطلاعات آگهی: ${response.status}`);
      }

      const data = await response.json();
      const poster = data.poster || data.posters?.[0] || data;

      if (!poster) throw new Error("آگهی یافت نشد");

      setPosterData(poster);
    } catch (err) {
      console.log("Error fetching poster:", err);
      setError(err instanceof Error ? err.message : "خطا در بارگذاری آگهی");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosterData();
  }, [id]);

  useEffect(() => {
    if (window.location.hash === "#contact-section") {
      setTimeout(() => {
        const element = document.getElementById("contact-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
    }
  }, [posterData]);

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast("لطفاً ابتدا وارد شوید");
        return;
      }
      if (!posterData?._id) return;

      setLoadingFav(true);
      const method = isFavorite ? "DELETE" : "POST";
      const res = await fetch("/api/favorite", {
        method,
        headers: {
          token: token,
          posterid: posterData._id,
          userId: userId,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setIsFavorite(!isFavorite);
      } else {
        console.log("خطا:", data.message);
      }
    } catch (e) {
      console.log("Error toggling favorite", e);
    } finally {
      setLoadingFav(false);
    }
  };

  const formatPrice = (amount: number) => {
    if (amount === 0) return "توافقی";
    if (amount >= 1000000000)
      return `${(amount / 1000000000).toFixed(1)} میلیارد`;
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)} میلیون`;
    return amount.toLocaleString("fa-IR");
  };

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toLocaleString("fa-IR");
  };

  const getParentTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      residentialRent: "اجاره مسکونی",
      residentialSale: "فروش مسکونی",
      commercialRent: "اجاره تجاری",
      commercialSale: "فروش تجاری",
      shortTermRent: "اجاره کوتاه مدت",
      ConstructionProject: "پروژه ساختمانی",
      residential: "مسکونی",
      commercial: "تجاری",
      administrative: "اداری",
      industrial: "صنعتی",
      old: "کلنگی",
    };
    return typeLabels[type] || type;
  };

  const getTradeTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      House: "خانه",
      Villa: "ویلا",
      Old: "کلنگی",
      Office: "اداری",
      Shop: "مغازه",
      industrial: "صنعتی",
      partnerShip: "مشارکت",
      preSale: "پیش فروش",
      buy: "خرید",
      sell: "فروش",
      rent: "اجاره",
      fullRent: "اجاره کامل",
      mortgage: "رهن",
    };
    return typeLabels[type] || type;
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImage([index, index > currentImageIndex ? 1 : -1]);
  };

  const nextImage = () => {
    if (mediaItems.length > 0) {
      const newIndex = (currentImageIndex + 1) % mediaItems.length;
      setCurrentImage([newIndex, 1]);
    }
  };

  const prevImage = () => {
    if (mediaItems.length > 0) {
      const newIndex =
        (currentImageIndex - 1 + mediaItems.length) % mediaItems.length;
      setCurrentImage([newIndex, -1]);
    }
  };

  const openGallery = (startIndex: number = 0) => {
    setGalleryIndex(startIndex);
    setIsGalleryOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextGalleryImage = () => {
    if (posterData?.images && posterData.images.length > 0) {
      setGalleryIndex(
        (prevIndex) => (prevIndex + 1) % posterData.images.length
      );
    }
  };

  const prevGalleryImage = () => {
    if (posterData?.images && posterData.images.length > 0) {
      setGalleryIndex(
        (prevIndex) =>
          (prevIndex - 1 + posterData.images.length) % posterData.images.length
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share && posterData) {
      try {
        await navigator.share({
          title: posterData.title,
          text: posterData.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("لینک کپی شد!");
      } catch (err) {
        console.log("Error copying to clipboard:", err);
      }
    }
  };

  const handleContact = () => {
    if (posterData?.user?.phone) {
      window.open(`tel:${posterData.user.phone}`);
    }
  };
  const safeUser = {
    _id: posterData?.user?._id || "",
    name: posterData?.user?.name || "نامشخص",
    phone: posterData?.user?.phone || "",
  };

  const isRentType =
    posterData?.parentType === "residentialRent" ||
    posterData?.parentType === "commercialRent" ||
    posterData?.parentType === "shortTermRent";

  const images =
    posterData?.images && posterData?.images.length > 0
      ? posterData?.images.map((img) =>
          typeof img === "string" ? img : img.url || "/assets/images/hero.jpg"
        )
      : ["/assets/images/hero.jpg"];

  // Create media array with video first (if exists) then images
  const mediaItems = [];
  if (
    posterData?.video &&
    posterData.video !== "undefined" &&
    posterData.video.trim() !== ""
  ) {
    // Extract userId from poster data or use current user
    const videoUserId = posterData.user?._id || posterData.consultant || userId;
    mediaItems.push({
      type: "video",
      src: `/api/poster/video/${videoUserId}/${posterData.video}`,
      poster: images[0],
    });
  }
  images.forEach((img) => {
    mediaItems.push({ type: "image", src: img });
  });

  // Always start with index 0 (video first if exists, otherwise first image)
  const displayImageIndex = currentImageIndex;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-10 h-10 sm:w-12 sm:h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">درحال بارگذاری</p>
        </div>
      </div>
    );
  }

  if (error || !posterData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-base sm:text-lg mb-4">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <main
      className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mt-12 sm:mt-16 md:mt-20 mx-auto min-h-screen w-full overflow-x-hidden"
      dir="rtl"
    >
      {/* Breadcrumb */}
      <div className="relative" dir="rtl">
        <nav
          aria-label="Breadcrumb"
          className="w-full absolute -top-4 sm:-top-5 md:-top-6 lg:-top-8 right-0 px-2 sm:px-3 md:px-0"
        >
          <ol className="flex items-center flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-0">
            {(() => {
              const breadcrumbItems = [
                { label: "خانه", href: "/" },
                { label: "آگهی‌ها", href: "/poster" },
                { label: posterData.title || "آگهی", href: `/poster/${id}` },
              ];

              return breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                return (
                  <li
                    key={item.href}
                    className="flex mt-5 md:mt-0 items-center"
                  >
                    {isLast ? (
                      <span className="flex items-center font-medium text-gray-600 cursor-default">
                        <span className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-[160px] lg:max-w-[200px]">
                          {item.label}
                        </span>
                      </span>
                    ) : (
                      <Link href={item.href} className="group">
                        <span className="flex items-center font-medium text-gray-700 hover:text-[#66308d] transition-colors duration-200">
                          <span className="truncate max-w-[70px] sm:max-w-[100px] md:max-w-[140px] lg:max-w-[180px] group-hover:underline underline-offset-2">
                            {item.label}
                          </span>
                        </span>
                      </Link>
                    )}
                    {!isLast && (
                      <svg
                        className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-gray-400 mx-1 sm:mx-1.5 md:mx-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </li>
                );
              });
            })()}
          </ol>
        </nav>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-4 sm:mb-6 mt-8 sm:mt-6"
        id="main-content"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 sm:mb-4">
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-black font-bold mb-2">
              {posterData.title || "عنوان آگهی"}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FaClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>
                  {posterData.createdAt
                    ? new Date(posterData.createdAt).toLocaleDateString("fa-IR")
                    : "تاریخ نامشخص"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaUser className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{safeUser.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{formatViews(posterData.views || 0)} بازدید</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3 mt-2 md:mt-0">
            <button
              onClick={handleToggleFavorite}
              disabled={loadingFav}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full transition-colors text-xs sm:text-sm ${
                isFavorite
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {loadingFav ? (
                <FiLoader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : isFavorite ? (
                <>
                  ❤️ <span>حذف علاقه‌مندی</span>
                </>
              ) : (
                <>
                  🤍 <span>افزودن علاقه‌مندی</span>
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-blue-500 bg-blue-50 px-2 sm:px-3 py-1 rounded-full hover:bg-blue-100 transition-colors text-xs sm:text-sm"
            >
              <FaShare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>اشتراک</span>
            </button>
          </div>
        </div>

        <p className="text-gray-600 flex items-center gap-2 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base">
          <FaMapMarkerAlt className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
          {posterData.location || "موقعیت نامشخص"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-0 sm:px-2 md:px-0">
          {/* Left Section - Images */}
          <div>
            {/* Main Media Slider (Video + Images) */}
            <div className="rounded-lg overflow-hidden mb-3 sm:mb-4 relative aspect-[16/9] sm:aspect-video w-full group">
              <div className="absolute w-full h-full">
                {mediaItems[displayImageIndex]?.type === "video" ? (
                  <video
                    src={mediaItems[displayImageIndex].src}
                    controls
                    preload="metadata"
                    className="w-full h-full object-cover"
                    onLoadedMetadata={() => {
                      console.log("Video loaded");
                    }}
                  >
                    مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                  </video>
                ) : (
                  <Image
                    src={
                      mediaItems[displayImageIndex]?.src ||
                      "/assets/images/hero.jpg"
                    }
                    alt={`تصویر ${displayImageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 50vw"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/assets/images/hero.jpg";
                    }}
                  />
                )}
              </div>
              {mediaItems.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1.5 sm:p-2 text-gray-800 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={prevImage}
                  >
                    <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1.5 sm:p-2 text-gray-800 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={nextImage}
                  >
                    <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </>
              )}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">
                {displayImageIndex + 1} / {mediaItems.length}
              </div>
              <button
                onClick={() => openGallery(displayImageIndex)}
                className="absolute top-2 left-2 bg-black/50 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs hover:bg-black/70 transition-colors"
              >
                <FaImages className="inline ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                مشاهده همه
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mb-4 sm:mb-6 w-full overflow-x-auto">
              {mediaItems
                .slice(0, window.innerWidth >= 1024 ? 5 : 3)
                .map((item, index) => (
                  <div
                    key={index}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 cursor-pointer ${
                      currentImageIndex === index
                        ? " opacity-100  "
                        : "opacity-70 hover:opacity-100 transition-opacity"
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    {item.type === "video" ? (
                      <div className="relative w-full h-full">
                        <video
                          src={item.src}
                          className="w-full h-full object-cover rounded-md"
                          preload="metadata"
                          aria-label={posterData.title || "ویدیو از ملک"}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
                          <div className="text-white text-lg">
                            <FiPlay />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={item.src || "/assets/images/hero.jpg"}
                        alt={`تصویر ${posterData.title || "ملک"} ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                        sizes="80px"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/assets/images/hero.jpg";
                        }}
                      />
                    )}
                  </div>
                ))}
              {mediaItems.length > 4 && (
                <div
                  className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 cursor-pointer bg-gray-100 flex items-center justify-center rounded-md"
                  onClick={() => openGallery(0)}
                >
                  <div className="flex flex-col items-center text-gray-600">
                    <FaImages className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                    <span className="text-xs">+{mediaItems.length - 4}</span>
                  </div>
                </div>
              )}
            </div>
            {/* Description */}
            <div className="bg-white p-2 hidden lg:block sm:p-3 md:p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2 text-xs sm:text-sm md:text-base">
                توضیحات
              </h3>
              <p className="text-gray-600 whitespace-break-spaces text-xs sm:text-lg md:text-base font-bold leading-relaxed">
                {posterData.description ||
                  "توضیحات تکمیلی برای این آگهی ارائه نشده است."}
              </p>
            </div>
          </div>

          {/* Right Section - Details */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            {/* Property Details Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 text-gray-700">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-2 sm:p-3 rounded-lg shadow-sm text-xs sm:text-sm">
                <FaRulerCombined className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                <span>متراژ: {posterData.area} متر</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-2 sm:p-3 rounded-lg shadow-sm text-xs sm:text-sm">
                <FaCalendarAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                <span>سال ساخت: {posterData.buildingDate || "نامشخص"}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-2 sm:p-3 rounded-lg shadow-sm text-xs sm:text-sm">
                <FaBed className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                <span>اتاق خواب: {posterData.rooms}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-2 sm:p-3 rounded-lg shadow-sm text-xs sm:text-sm">
                <FaHome className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                <span>طبقه: {posterData.floor || "نامشخص"}</span>
              </div>
            </div>

            {/* Property Type and Trade Type */}
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <div className="bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium">
                {getParentTypeLabel(posterData.parentType || "")}
              </div>
              <div className="bg-green-50 text-green-700 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium">
                {getTradeTypeLabel(posterData.tradeType || "")}
              </div>
              {posterData.convertible && isRentType && (
                <div className="bg-orange-50 text-orange-700 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium">
                  قابل تبدیل
                </div>
              )}
              {posterData.tag && (
                <div className="bg-purple-50 text-purple-700 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium">
                  {posterData.tag}
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-xl space-y-2 sm:space-y-3 text-gray-800 shadow-sm">
              {isRentType ? (
                <>
                  {(posterData.depositRent ?? 0) > 0 && (
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-medium text-xs sm:text-sm">
                        رهن:
                      </span>
                      <strong className="text-sm sm:text-base text-[#01ae9b]">
                        {formatPrice(posterData.depositRent ?? 0)} تومان
                      </strong>
                    </div>
                  )}
                  {(posterData.rentPrice ?? 0) > 0 && (
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-medium text-xs sm:text-sm">
                        اجاره ماهانه:
                      </span>
                      <strong className="text-sm sm:text-base text-gray-600">
                        {formatPrice(posterData.rentPrice ?? 0)} تومان
                      </strong>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-gray-500 pt-1 text-xs sm:text-sm">
                    <span className="font-medium">رهن و اجاره:</span>
                    <strong>
                      {posterData.convertible ? "قابل تبدیل" : "غیر قابل تبدیل"}
                    </strong>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium text-xs sm:text-sm">
                      {posterData.parentType === "residentialSale" ||
                      posterData.parentType === "commercialSale"
                        ? "قیمت خرید:"
                        : "قیمت فروش:"}
                    </span>
                    <strong className="text-sm sm:text-base md:text-lg text-[#01ae9b]">
                      {posterData.totalPrice > 0
                        ? `${formatPrice(posterData.totalPrice)} تومان`
                        : "توافقی"}
                    </strong>
                  </div>
                  {posterData.pricePerMeter > 0 && (
                    <div className="flex justify-between items-center text-gray-600 text-xs sm:text-sm">
                      <span className="font-medium">قیمت هر متر:</span>
                      <strong>
                        {formatPrice(posterData.pricePerMeter)} تومان
                      </strong>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Features and Amenities */}
            <div className="-mb-4">
              <h2 className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold  sm:mb-4">
                ویژگی‌ها و امکانات
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2 sm:gap-3 text-gray-700">
                {posterData.storage && (
                  <div className="flex flex-col items-center bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                    <FaWarehouse className="w-4 h-4 sm:w-5 sm:h-5 text-[#01ae9b] mb-1 sm:mb-2" />
                    <span className="text-xs sm:text-sm">انباری</span>
                  </div>
                )}
                {posterData.parking && (
                  <div className="flex flex-col items-center bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                    <FaParking className="w-4 h-4 sm:w-5 sm:h-5 text-[#01ae9b] mb-1 sm:mb-2" />
                    <span className="text-xs sm:text-sm">پارکینگ</span>
                  </div>
                )}
                {posterData.lift && (
                  <div className="flex flex-col items-center bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                    <FaElementor className="w-4 h-4 sm:w-5 sm:h-5 text-[#01ae9b] mb-1 sm:mb-2" />
                    <span className="text-xs sm:text-sm">آسانسور</span>
                  </div>
                )}
                {posterData.balcony && (
                  <div className="flex flex-col items-center bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                    <MdBalcony className="w-4 h-4 sm:w-5 sm:h-5 text-[#01ae9b] mb-1 sm:mb-2" />
                    <span className="text-xs sm:text-sm">بالکن</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-2 block lg:hidden mt-8 sm:p-3 md:p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2 text-base sm:text-lg md:text-base">
                توضیحات
              </h3>
              <p className="text-gray-600 whitespace-break-spaces text-sm sm:text-lg md:text-base font-bold leading-relaxed">
                {posterData.description ||
                  "توضیحات تکمیلی برای این آگهی ارائه نشده است."}
              </p>
            </div>

            {/* Contact Section */}
            <div
              id="contact-section"
              className="space-y-2 lg:mt-11 sm:space-y-3"
            >
              <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2 text-xs sm:text-sm md:text-base">
                  اطلاعات تماس
                </h3>
                <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm md:text-base">
                  <FaUser className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#01ae9b]" />
                  <span>{safeUser.name}</span>
                </div>
                {hasValidToken && posterData.contact && (
                  <div className="flex items-center gap-2 text-gray-600 mt-2 text-xs sm:text-sm md:text-base">
                    <FaPhone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#01ae9b]" />
                    <span>{posterData.contact}</span>
                  </div>
                )}
              </div>
              {hasValidToken ? (
                <button
                  onClick={handleContact}
                  className="w-full bg-green-600 text-white text-center py-2 sm:py-2.5 md:py-3 rounded-xl text-sm sm:text-base md:text-lg font-medium shadow-md hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <FaPhone className="w-4 h-4 sm:w-5 sm:h-5" />
                  تماس با آگهی دهنده
                </button>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3 md:p-4 text-center">
                  <p className="text-yellow-700 text-xs sm:text-sm">
                    برای مشاهده اطلاعات تماس لطفاً وارد شوید
                  </p>
                  <Link
                    href="/auth"
                    className="text-green-900 text-xs sm:text-sm font-medium mt-2 inline-block"
                    onClick={() => {
                      localStorage.setItem("contactRedirect", "true");
                      localStorage.setItem(
                        "contactRedirectUrl",
                        `/poster/${posterId}#contact-section`
                      );
                    }}
                  >
                    ورود به حساب کاربری
                  </Link>
                </div>
              )}
            </div>
            <h2 className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
              موقعیت جغرافیایی
            </h2>
            <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg border border-gray-200 mb-3 sm:mb-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-2 text-xs sm:text-sm md:text-base">
                    آدرس ملک:
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3">
                    {posterData.location || "آدرس مشخص نشده است"}
                  </p>
                  {posterData.locationDetails && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                      {posterData.locationDetails.province && (
                        <div>استان: {posterData.locationDetails.province}</div>
                      )}
                      {posterData.locationDetails.city && (
                        <div>شهر: {posterData.locationDetails.city}</div>
                      )}
                      {posterData.locationDetails.district && (
                        <div>منطقه: {posterData.locationDetails.district}</div>
                      )}
                      {posterData.locationDetails.neighborhood && (
                        <div>
                          محله: {posterData.locationDetails.neighborhood}
                        </div>
                      )}
                    </div>
                  )}
                  {posterData.coordinates?.lat &&
                    posterData.coordinates?.lng && (
                      <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md inline-block">
                        مختصات: {posterData.coordinates.lat.toFixed(6)},{" "}
                        {posterData.coordinates.lng.toFixed(6)}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section - Full Width */}
        <div className="mt-4 sm:mt-6 md:mt-8">
          {posterData.coordinates?.lat && posterData.coordinates?.lng && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="h-56 sm:h-64 md:h-80 relative">
                <LeafletMap
                  lat={posterData.coordinates.lat}
                  lng={posterData.coordinates.lng}
                  title={posterData.title}
                  location={posterData.location || ""}
                  posterData={posterData}
                />
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="text-xs sm:text-sm text-gray-600">
                    برای بزرگنمایی روی نقشه کلیک کنید
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const googleMapsUrl = `https://www.google.com/maps?q=${posterData.coordinates.lat},${posterData.coordinates.lng}`;
                        window.open(googleMapsUrl, "_blank");
                      }}
                      className="px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Google Maps
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(!posterData.coordinates?.lat || !posterData.coordinates?.lng) &&
            !posterData.location && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3 md:p-4 text-center">
                <FaMapMarkerAlt className="text-yellow-500 text-lg sm:text-xl md:text-2xl mx-auto mb-2" />
                <p className="text-yellow-700 text-xs sm:text-sm">
                  موقعیت جغرافیایی این ملک در نقشه ثبت نشده است
                </p>
              </div>
            )}
        </div>
      </motion.div>

      {isGalleryOpen && images && (
        <GalleryModal
          images={images}
          currentIndex={galleryIndex}
          onClose={closeGallery}
          onNext={nextGalleryImage}
          onPrev={prevGalleryImage}
          onSelectImage={(index) => setGalleryIndex(index)}
          title={posterData.title}
        />
      )}
    </main>
  );
}
