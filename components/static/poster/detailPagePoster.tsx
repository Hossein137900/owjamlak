"use client";
import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
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
  FaEye,
} from "react-icons/fa";
import GalleryModal from "@/components/static/poster/galleryModal";
import { Poster } from "@/types/type";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { MdBalcony } from "react-icons/md";

const LeafletMap = dynamic(
  () => import("@/components/static/poster/leafletMap"),
  {
    ssr: false,
  }
);

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

interface PosterDetailClientProps {
  posterId: string;
}

export default function PosterDetailClient({
  posterId,
}: PosterDetailClientProps) {
  //   const params = useParams();
  const id = posterId;
  const [posterData, setPosterData] = useState<Poster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [[currentImageIndex, direction], setCurrentImage] = useState([0, 0]);
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
        // Check token validity
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
          // Check favorite if posterData exists
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
      // کلید برای ذخیره بازدید این آگهی
      const storageKey = `poster_viewed_${posterId}`;

      // اگر این آگهی قبلاً در این مرورگر دیده شده
      if (localStorage.getItem(storageKey)) {
        return; // دیگه کال نکن
      }

      try {
        const response = await fetch("/api/poster/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: posterId }),
        });

        const data = await response.json();
        if (data.success) {
          // ثبت بازدید در localStorage
          localStorage.setItem(storageKey, "true");
        }
      } catch (error) {
        console.error("Error incrementing view:", error);
      }
    };

    incrementView();
  }, [posterId]);

  // useEffect(() => {
  //   const checkToken = () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setHasValidToken(false);
  //       return;
  //     }

  //     try {
  //       // Basic token expiration check (assuming JWT format)
  //       const payload = JSON.parse(atob(token.split(".")[1]));
  //       const isExpired = payload.exp * 1000 < Date.now();
  //       setHasValidToken(!isExpired);
  //     } catch {
  //       setHasValidToken(false);
  //     }
  //   };

  //   checkToken();
  // }, []);

  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     try {
  //       const response = await fetch(`/api/auth/id`, {
  //         method: "GET",
  //         headers: {
  //           token: token ?? "",
  //         },
  //       });
  //       if (!response.ok) {
  //         return;
  //       }
  //       const data = await response.json();
  //       if (data) {
  //         setUserId(data.id);
  //       }
  //     } catch (error) {
  //       console.log("Error fetching poster:", error);
  //       setError("خطا در دریافت اطلاعات کاربر");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserInfo();
  // }, []);

  // useEffect(() => {
  //   const checkFavorite = async () => {
  //     const token = localStorage.getItem("token");
  //     if (token && posterData?._id) {
  //       try {
  //         const response = await fetch(`/api/auth/id`, {
  //           method: "GET",
  //           headers: {
  //             token: token,
  //           },
  //         });
  //         const user: { favorite?: string[] } = await response.json();
  //         if (user && user.favorite && Array.isArray(user.favorite)) {
  //           setIsFavorite(user.favorite.includes(posterData._id));
  //         }
  //       } catch {
  //         // handle error silently
  //       }
  //     }
  //   };
  //   checkFavorite();
  // }, [posterData?._id]);

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
        if (response.status === 404) {
          throw new Error("آگهی یافت نشد");
        }
        throw new Error(`خطا در دریافت اطلاعات آگهی: ${response.status}`);
      }

      const data = await response.json();

      const poster = data.poster || data.posters?.[0] || data;

      if (!poster) {
        throw new Error("آگهی یافت نشد");
      }

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
    // Handle scrolling to contact section after redirect
    if (
      typeof window !== "undefined" &&
      window.location.hash === "#contact-section"
    ) {
      setTimeout(() => {
        const element = document.getElementById("contact-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
    }
  }, [posterData]);

  // useEffect(() => {
  //   // فقط یک بار ویو اضافه کن
  //   const incrementView = async () => {
  //     try {
  //       await fetch("/api/poster/view", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ id: posterId }),
  //       });
  //     } catch (error) {
  //       console.log("Error incrementing view:", error);
  //     }
  //   };

  //   incrementView();
  // }, [posterId]);

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

  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
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
      // Keep old values for backward compatibility
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
      Office: "دفتر کار",
      Shop: "مغازه",
      industrial: "صنعتی",
      partnerShip: "مشارکت",
      preSale: "پیش فروش",
      // Keep old values for backward compatibility
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
          <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری ...</p>
        </div>
      </div>
    );
  }

  if (error || !posterData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
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
    posterData.parentType === "residentialRent" ||
    posterData.parentType === "commercialRent" ||
    posterData.parentType === "shortTermRent";

  // Handle images - support both string and object formats
  const images =
    posterData.images && posterData.images.length > 0
      ? posterData.images.map((img) => {
          if (typeof img === "string") {
            return img;
          }
          return img.url || "/assets/images/hero.jpg";
        })
      : ["/assets/images/hero.jpg"];

  return (
    <main
      className="p-4 md:p-10 max-w-7xl mt-20 mx-auto min-h-screen"
      dir="rtl"
    >
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
                { label: "آگهی‌ها", href: "/posters" },
                { label: posterData.title || "آگهی", href: `/poster/${id}` },
              ];

              return breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;

                return (
                  <li key={item.href} className="flex items-center">
                    {isLast ? (
                      <span className="flex items-center font-medium text-gray-600 cursor-default">
                        <span className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                          {item.label}
                        </span>
                      </span>
                    ) : (
                      <Link href={item.href} className="group">
                        <span className="flex items-center font-medium text-gray-700 hover:text-[#66308d] transition-colors duration-200">
                          <span className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-none group-hover:underline underline-offset-2">
                            {item.label}
                          </span>
                        </span>
                      </Link>
                    )}

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
              onClick={handleToggleFavorite}
              disabled={loadingFav}
              className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                isFavorite
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {loadingFav ? (
                <FiLoader className="animate-spin" />
              ) : isFavorite ? (
                <>
                  ❤️ <span className="text-sm">حذف علاقه‌مندی</span>
                </>
              ) : (
                <>
                  🤍 <span className="text-sm">افزودن علاقه‌مندی</span>
                </>
              )}
            </motion.button>
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
                    src={images[currentImageIndex] || "/assets/images/hero.jpg"}
                    alt={`تصویر ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/assets/images/hero.jpg";
                    }}
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

              {/* Gallery Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openGallery(currentImageIndex)}
                className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm hover:bg-black/70 transition-colors"
              >
                <FaImages className="inline mr-1" />
                مشاهده همه
              </motion.button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mb-6 w-full justify-center lg:justify-start overflow-x-auto">
              <div className="flex gap-2 mb-6">
                {images.slice(0, 4).map((img, index) => (
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
                      src={img || "/assets/images/hero.jpg"}
                      alt={`تصویر ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                      sizes="100px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/assets/images/hero.jpg";
                      }}
                    />
                  </motion.div>
                ))}

                {images.length > 4 && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-20 h-20 flex-shrink-0 cursor-pointer bg-gray-100 flex items-center justify-center rounded-md"
                    onClick={() => openGallery(0)}
                  >
                    <div className="flex flex-col items-center text-gray-600">
                      <FaImages className="text-xl mb-1" />
                      <span className="text-xs">+{images.length - 4}</span>
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
                  {posterData.buildingDate ? posterData.buildingDate : "نامشخص"}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                <FaBed className="w-5 h-5 text-green-600" />
                <span>اتاق خواب: {posterData.rooms}</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                <FaHome className="w-5 h-5 text-green-600" />
                <span>طبقه: {posterData.floor || "نامشخص"}</span>
              </div>
            </motion.div>

            {/* Property Type and Trade Type */}
            <motion.div variants={fadeIn} className="flex gap-3 flex-wrap">
              <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium">
                {getParentTypeLabel(posterData.parentType || "")}{" "}
              </div>
              <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
                {getTradeTypeLabel(posterData.tradeType || "")}{" "}
              </div>
              {posterData.convertible && isRentType && (
                <div className="bg-orange-50 text-orange-700 px-3 py-2 rounded-lg text-sm font-medium">
                  قابل تبدیل
                </div>
              )}
              {posterData.tag && (
                <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium">
                  {posterData.tag}
                </div>
              )}
            </motion.div>

            {/* Price Section */}
            <motion.div
              variants={fadeIn}
              className="bg-gray-50 p-5 rounded-xl space-y-3 text-gray-800 shadow-sm"
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
                  {/* {posterData.tradeType === "" && (
                    <div className="flex justify-between items-center text-orange-500 pt-1">
                      <span className="font-medium">نوع اجاره:</span>
                      <strong>اجاره کامل</strong>
                    </div>
                  )} */}
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
                      {posterData.parentType === "residentialSale" ||
                      posterData.parentType === "commercialSale"
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
              <div className="grid grid-cols-4 gap-4 text-gray-700">
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
                {posterData.balcony && (
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm"
                  >
                    <MdBalcony className="w-6 h-6 text-[#01ae9b] mb-2" />
                    <span className="text-sm">بالکن</span>
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
            <motion.div
              id="contact-section"
              variants={fadeIn}
              className="space-y-3"
            >
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">
                  اطلاعات تماس
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaUser className="text-[#01ae9b]" />
                  <span>{safeUser.name}</span>
                </div>
                {hasValidToken && posterData.contact && (
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <FaPhone className="text-[#01ae9b]" />
                    <span>{posterData.contact}</span>
                  </div>
                )}
              </div>
              {hasValidToken ? (
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleContact}
                    className="flex-1 bg-green-600 text-white text-center py-3 rounded-xl text-lg font-medium shadow-md hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <FaPhone /> تماس با آگهی دهنده
                  </motion.button>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-700 text-sm">
                    برای مشاهده اطلاعات تماس لطفاً وارد شوید
                  </p>
                  <Link
                    href="/auth"
                    className="text-green-900 text-sm font-medium mt-2"
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
            </motion.div>
          </motion.div>
        </div>

        {/* Map Section - Full Width */}
        <motion.div variants={fadeIn} className="mt-8">
          <h2 className="text-lg text-gray-700 font-semibold mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-green-600" />
            موقعیت جغرافیایی
          </h2>

          {/* Location Details */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 mb-2">آدرس ملک:</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {posterData.location || "آدرس مشخص نشده است"}
                </p>

                {/* Location Details */}
                {posterData.locationDetails && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 mb-3">
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
                      <div>محله: {posterData.locationDetails.neighborhood}</div>
                    )}
                  </div>
                )}

                {/* Coordinates Display */}
                {posterData.coordinates?.lat && posterData.coordinates?.lng && (
                  <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md inline-block">
                    مختصات: {posterData.coordinates.lat.toFixed(6)},{" "}
                    {posterData.coordinates.lng.toFixed(6)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          {posterData.coordinates?.lat && posterData.coordinates?.lng && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden z-10">
              <div className="h-80 relative z-10">
                <LeafletMap
                  lat={posterData.coordinates.lat}
                  lng={posterData.coordinates.lng}
                  title={posterData.title}
                  location={posterData.location || ""}
                  posterData={posterData}
                />
              </div>

              {/* Map Footer with Actions */}
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    برای بزرگنمایی روی نقشه کلیک کنید
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const googleMapsUrl = `https://www.google.com/maps?q=${posterData.coordinates.lat},${posterData.coordinates.lng}`;
                        window.open(googleMapsUrl, "_blank");
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Google Maps
                    </button>
                    <button
                      onClick={() => {
                        try {
                          let neshanUrl = "";

                          if (
                            posterData.coordinates?.lat &&
                            posterData.coordinates?.lng
                          ) {
                            const lat = Number(posterData.coordinates.lat);
                            const lng = Number(posterData.coordinates.lng);

                            if (
                              !isNaN(lat) &&
                              !isNaN(lng) &&
                              lat >= -90 &&
                              lat <= 90 &&
                              lng >= -180 &&
                              lng <= 180
                            ) {
                              neshanUrl = `https://neshan.org/maps/search#c${lat}-${lng}-17z-0p`;
                            }
                          }

                          if (!neshanUrl && posterData.location) {
                            const searchQuery = encodeURIComponent(
                              posterData.location
                            );
                            neshanUrl = `https://neshan.org/maps/search?q=${searchQuery}`;
                          }

                          if (!neshanUrl && posterData.title) {
                            const searchQuery = encodeURIComponent(
                              posterData.title
                            );
                            neshanUrl = `https://neshan.org/maps/search?q=${searchQuery}`;
                          }

                          if (neshanUrl) {
                            window.open(neshanUrl, "_blank");
                          } else {
                            console.warn(
                              "No location data available for Neshan map"
                            );
                            alert(
                              "اطلاعات موقعیت برای نمایش در نقشه موجود نیست"
                            );
                          }
                        } catch (error) {
                          console.log("Error opening Neshan map:", error);
                          alert("خطا در باز کردن نقشه نشان");
                        }
                      }}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                    >
                      نشان
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback for missing coordinates */}
          {(!posterData.coordinates?.lat || !posterData.coordinates?.lng) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <FaMapMarkerAlt className="text-yellow-500 text-2xl mx-auto mb-2" />
              <p className="text-yellow-700 text-sm">
                موقعیت جغرافیایی این ملک در نقشه ثبت نشده است
              </p>
            </div>
          )}
        </motion.div>
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
