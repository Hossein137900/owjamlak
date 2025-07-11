"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  FaEye, // Add eye icon for views
} from "react-icons/fa";
import GalleryModal from "@/components/static/poster/galleryModal";
import { Poster } from "@/types/type";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export default function PropertyDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [posterData, setPosterData] = useState<Poster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [[currentImageIndex, direction], setCurrentImage] = useState([0, 0]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Function to generate a unique viewer identifier
  const generateViewerIdentifier = () => {
    // Use a combination of browser fingerprint and timestamp
    const browserInfo =
      navigator.userAgent + navigator.language + screen.width + screen.height;
    const hash = btoa(browserInfo).slice(0, 16);
    return hash;
  };

  // Function to increment view count
  const incrementView = async (posterId: string) => {
    try {
      const viewerIdentifier = generateViewerIdentifier();

      // Check if already viewed in this session
      const sessionKey = `viewed_poster_${posterId}`;
      if (sessionStorage.getItem(sessionKey)) {
        return; // Already viewed in this session
      }

      const response = await fetch("/api/poster?action=view", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          posterId: posterId,
          viewerIdentifier: viewerIdentifier,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Mark as viewed in this session
        sessionStorage.setItem(sessionKey, "true");

        // Update local state with the view count from the API response
        setPosterData((prev) =>
          prev ? { ...prev, views: data.views } : null
        );
      } else if (!data.success && data.message === "Already viewed.") {
        // Already viewed, do nothing further.
        // Optionally, you could ensure the local state is correct.
        setPosterData((prev) =>
          prev ? { ...prev, views: data.views } : null
        );
      }
    } catch (error) {
      console.error("Error incrementing view:", error);
    }
  };
  const fetchPosterData = async () => {
    if (!id) {
      setError("شناسه آگهی معتبر نیست");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/poster/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("آگهی یافت نشد");
        }
        throw new Error("خطا در دریافت اطلاعات آگهی");
      }

      const data = await response.json();
      console.log(data, "dddddddddddddddd");
      setPosterData(data);
      // Increment view count after successfully fetching poster data
      await incrementView(id);
    } catch (err) {
      console.error("Error fetching poster:", err);
      setError(err instanceof Error ? err.message : "خطا در بارگذاری آگهی");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosterData();
  }, [id]);

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

  // Format view count
  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString("fa-IR");
  };

  const getPropertyTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
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
      buy: "خرید",
      sell: "فروش",
      rent: "اجاره",
      fullRent: "اجاره کامل",
      mortgage: "رهن",
    };
    return typeLabels[type] || type;
  };

  // Function to handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setCurrentImage([index, index > currentImageIndex ? 1 : -1]);
  };

  // Functions to handle slider navigation
  const nextImage = () => {
    if (posterData?.images && posterData.images.length > 0) {
      const newIndex = (currentImageIndex + 1) % posterData.images.length;
      setCurrentImage([newIndex, 1]);
    }
  };

  const prevImage = () => {
    if (posterData?.images && posterData.images.length > 0) {
      const newIndex =
        (currentImageIndex - 1 + posterData.images.length) %
        posterData.images.length;
      setCurrentImage([newIndex, -1]);
    }
  };

  // Functions for gallery modal
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
        alert("لینک کپی شد!");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01ae9b] mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !posterData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={fetchPosterData}
            className="bg-[#01ae9b] text-white px-6 py-2 rounded-lg hover:bg-[#018a7a] transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  const safeUser = {
    _id: posterData.user?._id || "",
    name: posterData.user?.name || "نامشخص",
    phone: posterData.user?.phone || "",
  };

  const isRentType =
    posterData.tradeType === "rent" || posterData.tradeType === "fullRent";

  // Map image objects to their URLs
  const images =
    posterData.images && posterData.images.length > 0
      ? posterData.images.map((img) =>
          typeof img === "string" ? img : img.url
        )
      : ["/assets/images/hero.jpg"];

  return (
    <main
      className="p-4 md:p-10 max-w-6xl mt-20 mx-auto min-h-screen"
      dir="rtl"
    >
      {/* Breadcrumb */}
      {/* Breadcrumb */}
      <div className="relative" dir="rtl">
        <nav
          aria-label="Breadcrumb"
          className="w-full absolute -top-5 sm:-top-10 right-2"
        >
          <ol className="flex items-center flex-wrap gap-1 text-sm">
            {(() => {
              const breadcrumbItems = [
                { label: "خانه", href: "/" },
                { label: "آگهی‌ها", href: "/poster" },
                { label: posterData.title || "آگهی", href: `/poster/${id}` },
              ];

              return breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;

                return (
                  <li key={item.href} className="flex items-center">
                    {/* Breadcrumb Item */}
                    {isLast ? (
                      // Current page (non-clickable)
                      <span className="flex items-center font-medium text-gray-600 cursor-default">
                        <span className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                          {item.label}
                        </span>
                      </span>
                    ) : (
                      // Clickable breadcrumb
                      <Link href={item.href} className="group">
                        <span className="flex items-center font-medium text-gray-700 hover:text-[#66308d] transition-colors duration-200">
                          <span className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-none group-hover:underline underline-offset-2">
                            {item.label}
                          </span>
                        </span>
                      </Link>
                    )}

                    {/* Separator */}
                    {!isLast && (
                      <div className="flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-gray-400 mx-1 sm:mx-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </li>
                );
              });
            })()}
          </ol>
        </nav>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mb-6 mt-6"
      >
        <motion.div
          variants={fadeIn}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4"
        >
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl text-black font-bold mb-2">
              {posterData.title || "عنوان آگهی"}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FaClock />
                <span>
                  {posterData.createdAt
                    ? new Date(posterData.createdAt).toLocaleDateString("fa-IR")
                    : "تاریخ نامشخص"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaUser />
                <span>{safeUser.name}</span>
              </div>
              {/* Add Views Display */}
              <div className="flex items-center gap-1">
                <FaEye className="text-gray-500" />
                <span>{formatViews(posterData.views || 0)} بازدید</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-2 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="flex items-center gap-1 text-blue-500 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
            >
              <FaShare /> <span className="text-sm">اشتراک</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.p
          variants={fadeIn}
          className="text-gray-600 flex items-center gap-2 mb-6"
        >
          <FaMapMarkerAlt className="text-green-600" />
          {posterData.location || "موقعیت نامشخص"}
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Section - Images */}
          <motion.div variants={fadeIn}>
            {/* Main Image with Slider */}
            <div className="rounded-lg overflow-hidden mb-4 relative h-[300px] md:h-[400px] group">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentImageIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute w-full h-full"
                >
                  <Image
                    // src={images[currentImageIndex]}
                    src={"/assets/images/hero2.png"}
                    alt={`تصویر ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <motion.button
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 text-gray-800 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={prevImage}
                  >
                    <FaChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 text-gray-800 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={nextImage}
                  >
                    <FaChevronRight size={20} />
                  </motion.button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mb-6 w-full justify-center lg:justify-start overflow-x-auto">
              <div className="flex gap-2 mb-6">
                {images.slice(0, 3).map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-20 h-20 flex-shrink-0 cursor-pointer ${
                      currentImageIndex === index
                        ? "ring-2 ring-green-500 ring-offset-2"
                        : ""
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <Image
                      // src={img}
                      src={"/assets/images/hero2.png"}
                      alt={`تصویر ${img}`}
                      fill
                      className="object-cover rounded-md"
                      sizes="100px"
                    />
                  </motion.div>
                ))}

                {images.length > 3 && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-20 h-20 flex-shrink-0 cursor-pointer bg-gray-100 flex items-center justify-center rounded-md"
                    onClick={() => openGallery(0)}
                  >
                    <div className="flex flex-col items-center text-gray-600">
                      <FaImages className="text-xl mb-1" />
                      <span className="text-xs">همه تصاویر</span>
                      <span className="text-xs">({images.length})</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Section - Details */}
          <motion.div variants={staggerContainer} className="space-y-6">
            {/* Property Details Grid */}
            <motion.div
              variants={fadeIn}
              className="grid grid-cols-2 gap-4 text-gray-700"
            >
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                <FaRulerCombined className="w-5 h-5 text-green-600" />
                <span>متراژ: {posterData.area} متر</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                <FaCalendarAlt className="w-5 h-5 text-green-600" />
                <span>
                  سال ساخت:{" "}
                  {new Date(posterData.buildingDate).toLocaleDateString(
                    "fa-IR"
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                <FaBed className="w-5 h-5 text-green-600" />
                <span>اتاق خواب: {posterData.rooms}</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                <FaHome className="w-5 h-5 text-green-600" />
                <span> طبقه :{posterData.floor}</span>
              </div>
            </motion.div>

            {/* Property Type and Trade Type */}
            <motion.div variants={fadeIn} className="flex gap-3">
              <div className="bg-gray-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium">
                {getPropertyTypeLabel(posterData.propertyType || "residential")}
              </div>
              <div className="bg-gray-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
                {getTradeTypeLabel(posterData.tradeType || "sell")}
              </div>
              {posterData.convertible && isRentType && (
                <div className="bg-gray-50 text-orange-700 px-3 py-2 rounded-lg text-sm font-medium">
                  قابل تبدیل
                </div>
              )}
            </motion.div>

            {/* Price Section */}
            <motion.div
              variants={fadeIn}
              className=" p-5 rounded-xl space-y-3 text-gray-800 shadow-sm"
            >
              {isRentType ? (
                <>
                  {(posterData.depositRent ?? 0) > 0 && (
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-medium">رهن:</span>
                      <strong className="text-lg text-[#01ae9b]">
                        {formatPrice(posterData.depositRent ?? 0)} تومان
                      </strong>
                    </div>
                  )}
                  {(posterData.rentPrice ?? 0) > 0 && (
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-medium">اجاره ماهانه:</span>
                      <strong className="text-lg text-gray-600">
                        {formatPrice(posterData.rentPrice ?? 0)} تومان
                      </strong>
                    </div>
                  )}
                  {posterData.tradeType === "fullRent" && (
                    <div className="flex justify-between items-center text-orange-500 pt-1">
                      <span className="font-medium">نوع اجاره:</span>
                      <strong>اجاره کامل</strong>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-gray-500 pt-1">
                    <span className="font-medium">رهن و اجاره:</span>
                    <strong>
                      {posterData.convertible ? "قابل تبدیل" : "غیر قابل تبدیل"}
                    </strong>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium">
                      {posterData.tradeType === "buy"
                        ? "قیمت خرید:"
                        : "قیمت فروش:"}
                    </span>
                    <strong className="text-xl text-[#01ae9b]">
                      {posterData.totalPrice > 0
                        ? `${formatPrice(posterData.totalPrice)} تومان`
                        : "توافقی"}
                    </strong>
                  </div>
                  {posterData.pricePerMeter > 0 && (
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="font-medium">قیمت هر متر:</span>
                      <strong>
                        {formatPrice(posterData.pricePerMeter)} تومان
                      </strong>
                    </div>
                  )}
                </>
              )}
            </motion.div>

            {/* Features and Amenities */}
            <motion.div variants={fadeIn}>
              <h2 className="text-lg text-gray-700 font-semibold mb-4">
                ویژگی‌ها و امکانات
              </h2>
              <div className="grid grid-cols-3 gap-4 text-gray-700">
                {posterData.storage && (
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm"
                  >
                    <FaWarehouse className="w-6 h-6 text-[#01ae9b] mb-2" />
                    <span className="text-sm">انباری</span>
                  </motion.div>
                )}
                {posterData.parking && (
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm"
                  >
                    <FaParking className="w-6 h-6 text-[#01ae9b] mb-2" />
                    <span className="text-sm">پارکینگ</span>
                  </motion.div>
                )}
                {posterData.lift && (
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm"
                  >
                    <FaElementor className="w-6 h-6 text-[#01ae9b] mb-2" />
                    <span className="text-sm">آسانسور</span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              variants={fadeIn}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <h3 className="font-semibold text-gray-700 mb-2">توضیحات</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {posterData.description ||
                  "توضیحات تکمیلی برای این آگهی ارائه نشده است."}
              </p>
            </motion.div>

            {/* Contact Section */}
            <motion.div variants={fadeIn} className="space-y-3">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">
                  اطلاعات تماس
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaUser className="text-[#01ae9b]" />
                  <span>{safeUser.name}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleContact}
                  className="flex-1 bg-green-600 text-white text-center py-3 rounded-xl text-lg font-medium shadow-md hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <FaPhone /> اطلاعات تماس
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && images && (
          <GalleryModal
            images={images}
            currentIndex={galleryIndex}
            onClose={closeGallery}
            onNext={nextGalleryImage}
            onPrev={prevGalleryImage}
            onSelectImage={(index) => setGalleryIndex(index)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
