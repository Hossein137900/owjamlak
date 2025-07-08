"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiMapPin,
  FiHome,
  FiCalendar,
  FiLoader,
} from "react-icons/fi";
import ReportageBox from "./posterBox";
import { Filters, Poster } from "@/types/type";

const PosterListPage = () => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [filteredPosters, setFilteredPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    propertyType: "",
    tradeType: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    rooms: "",
    location: "",
  });

  // Fetch all posters
  useEffect(() => {
    const fetchPosters = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/poster");

        if (!response.ok) {
          throw new Error("خطا در دریافت آگهی‌ها");
        }

        const data = await response.json();
        console.log(data);
        setPosters(data.posters);
        setFilteredPosters(data.posters);
      } catch (err) {
        console.log(err)
        // setError(err.message || "خطا در دریافت اطلاعات");
        console.error("Error fetching posters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosters();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...posters];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (poster) =>
          poster.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          poster.location
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          poster.description
            .toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    // Property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(
        (poster) => poster.propertyType === filters.propertyType
      );
    }

    // Trade type filter
    if (filters.tradeType) {
      filtered = filtered.filter(
        (poster) => poster.tradeType === filters.tradeType
      );
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(
        (poster) => poster.totalPrice >= parseInt(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (poster) => poster.totalPrice <= parseInt(filters.maxPrice)
      );
    }

    // Area range filter
    if (filters.minArea) {
      filtered = filtered.filter(
        (poster) => poster.area >= parseInt(filters.minArea)
      );
    }
    if (filters.maxArea) {
      filtered = filtered.filter(
        (poster) => poster.area <= parseInt(filters.maxArea)
      );
    }

    // Rooms filter
    if (filters.rooms) {
      filtered = filtered.filter(
        (poster) => poster.rooms === parseInt(filters.rooms)
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((poster) =>
        poster.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredPosters(filtered);
  }, [filters, posters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      propertyType: "",
      tradeType: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      rooms: "",
      location: "",
    });
  };

  const formatPosterForReportageBox = (poster: Poster) => {
    const mainImage =
      poster.images.find((img) => img.mainImage) || poster.images[0];

    return {
      id: poster._id,
      title: poster.title,
      location: poster.location,
      price: {
        totalPrice: poster.totalPrice,
        depositRent: poster.depositRent,
        rentPrice: poster.rentPrice,
        pricePerMeter: poster.pricePerMeter,
      },
      features: {
        area: poster.area,
        bedrooms: poster.rooms,
        bathrooms: Math.ceil(poster.rooms / 2), // Estimate bathrooms
        yearBuilt: new Date(poster.buildingDate).getFullYear(),
      },
      imagePath: mainImage?.url || "/assets/images/default-property.jpg",
      isNew:
        new Date(poster.createdAt) >
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days
      isSpecialOffer: poster.tag === "ویژه" || poster.tag === "فوری",
      isInvestment: poster.type === "investment",
      posterType: poster.type,
      propertyType: poster.propertyType,
      tradeType: poster.tradeType,
      convertible: poster.convertible || false,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری آگهی‌ها...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiHome className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            خطا در بارگذاری
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#01ae9b] text-white rounded-lg hover:bg-[#018a7a] transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20" dir="rtl">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                آگهی‌های املاک
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredPosters.length} آگهی از {posters.length} آگهی موجود
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-[#01ae9b] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-[#01ae9b] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiList size={20} />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-[#01ae9b] text-white border-[#01ae9b]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FiFilter size={18} />
                <span>فیلتر</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:w-80 bg-white rounded-xl shadow-sm p-6 h-fit"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">فیلترها</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#01ae9b] hover:text-[#018a7a] transition-colors"
                  >
                    پاک کردن همه
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      جستجو
                    </label>
                    <div className="relative">
                      <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="جستجو در عنوان، توضیحات یا مکان..."
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                        className="w-full pr-10 text-black pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع ملک
                    </label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) =>
                        handleFilterChange("propertyType", e.target.value)
                      }
                      className="w-full p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                    >
                      <option value="">همه انواع</option>
                      <option value="residential">مسکونی</option>
                      <option value="commercial">تجاری</option>
                      <option value="administrative">اداری</option>
                      <option value="industrial">صنعتی</option>
                      <option value="old">کلنگی</option>
                    </select>
                  </div>

                  {/* Trade Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع معامله
                    </label>
                    <select
                      value={filters.tradeType}
                      onChange={(e) =>
                        handleFilterChange("tradeType", e.target.value)
                      }
                      className="w-full p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                    >
                      <option value="">همه انواع</option>
                      <option value="buy">خرید</option>
                      <option value="sell">فروش</option>
                      <option value="rent">اجاره</option>
                      <option value="fullRent">اجاره کامل</option>
                      <option value="mortgage">رهن</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      محدوده قیمت (تومان)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="حداقل"
                        value={filters.minPrice}
                        onChange={(e) =>
                          handleFilterChange("minPrice", e.target.value)
                        }
                        className="p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="حداکثر"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          handleFilterChange("maxPrice", e.target.value)
                        }
                        className="p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Area Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      محدوده متراژ (متر مربع)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="حداقل"
                        value={filters.minArea}
                        onChange={(e) =>
                          handleFilterChange("minArea", e.target.value)
                        }
                        className="p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="حداکثر"
                        value={filters.maxArea}
                        onChange={(e) =>
                          handleFilterChange("maxArea", e.target.value)
                        }
                        className="p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Rooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تعداد اتاق
                    </label>
                    <select
                      value={filters.rooms}
                      onChange={(e) =>
                        handleFilterChange("rooms", e.target.value)
                      }
                      className="w-full p-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                    >
                      <option value="">همه</option>
                      <option value="1">1 اتاق</option>
                      <option value="2">2 اتاق</option>
                      <option value="3">3 اتاق</option>
                      <option value="4">4 اتاق</option>
                      <option value="5">5+ اتاق</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      منطقه
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="نام منطقه یا محله..."
                        value={filters.location}
                        onChange={(e) =>
                          handleFilterChange("location", e.target.value)
                        }
                        className="w-full text-black pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Summary */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiHome size={18} />
                    <span>{filteredPosters.length} آگهی یافت شد</span>
                  </div>
                  {filters.search && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>برای:</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {filters.search}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <FiCalendar className="text-gray-400" size={16} />
                  <span className="text-sm text-gray-500">
                    آخرین بروزرسانی: {new Date().toLocaleDateString("fa-IR")}
                  </span>
                </div>
              </div>
            </div>

            {/* Posters Grid/List */}
            {filteredPosters.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-12 text-center"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiHome className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  آگهی‌ای یافت نشد
                </h3>
                <p className="text-gray-600 mb-6">
                  با فیلترهای انتخابی شما آگهی‌ای موجود نیست. لطفاً فیلترها را
                  تغییر دهید.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#01ae9b] text-white rounded-lg hover:bg-[#018a7a] transition-colors"
                >
                  پاک کردن فیلترها
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                <AnimatePresence>
                  {filteredPosters.map((poster, index) => (
                    <motion.div
                      key={poster._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={viewMode === "list" ? "w-full" : ""}
                    >
                      <ReportageBox
                        {...formatPosterForReportageBox(poster)}
                        className={viewMode === "list" ? "flex-row" : ""}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Load More Button (if needed for pagination) */}
            {filteredPosters.length > 0 && filteredPosters.length >= 20 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-12"
              >
                <button className="px-8 py-3 bg-white border-2 border-[#01ae9b] text-[#01ae9b] rounded-lg hover:bg-[#01ae9b] hover:text-white transition-colors duration-200 font-medium">
                  مشاهده آگهی‌های بیشتر
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 left-6 md:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-14 h-14 bg-[#01ae9b] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#018a7a] transition-colors"
        >
          <FiFilter size={24} />
        </button>
      </div>
    </div>
  );
};

export default PosterListPage;
