"use client";
import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiHome,
  FiCalendar,
  FiLoader,
  FiX,
  FiTag,
} from "react-icons/fi";
import ReportageBox from "./posterBox";
import { Filters, Poster } from "@/types/type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function PosterListContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  );
  const [limit] = useState<number>(parseInt(searchParams.get("limit") || "3"));
  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("query") || "",
    parentType: searchParams.get("parentType") || "",
    tradeType: searchParams.get("tradeType") || "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    rooms: "",
    location: "",
    // parentType: "",
  });
  const [mobileFilters, setMobileFilters] = useState({
    search: searchParams.get("query") || "",
    parentType: searchParams.get("parentType") || "",
    tradeType: searchParams.get("tradeType") || "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    rooms: "",
    location: "",
  });

  const [tempMobileFilters, setTempMobileFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
  });

  const [tempFilters, setTempFilters] = useState({
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minArea: filters.minArea,
    maxArea: filters.maxArea,
  });

  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [cameFromSearch, setCameFromSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // detecte the page scrolling or Not and set the isScrolling state for filter button
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  const updateURL = (
    p = page,
    l = limit,
    parent = filters.parentType,
    trade = filters.tradeType,
    query = filters.search
  ) => {
    const params = new URLSearchParams();
    if (parent) params.set("parentType", parent);
    if (trade) params.set("tradeType", trade);
    if (query) params.set("query", query);
    if (p) params.set("page", String(p));
    if (l) params.set("limit", String(l));
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Apply filters
  const filteredPos = useMemo(() => {
    let filtered = [...posters];

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

    if (filters.parentType) {
      filtered = filtered.filter((p) => p.parentType === filters.parentType);
    }
    if (filters.tradeType) {
      filtered = filtered.filter((p) => p.tradeType === filters.tradeType);
    }
    if (filters.minPrice) {
      filtered = filtered.filter((p) => {
        const isRentType =
          p.parentType === "residentialRent" ||
          p.parentType === "commercialRent";
        const priceToCheck = isRentType
          ? p.depositRent || 0
          : p.totalPrice || 0;
        return priceToCheck >= +filters.minPrice;
      });
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => {
        const isRentType =
          p.parentType === "residentialRent" ||
          p.parentType === "commercialRent";
        const priceToCheck = isRentType
          ? p.depositRent || 0
          : p.totalPrice || 0;
        return priceToCheck <= +filters.maxPrice;
      });
    }
    if (filters.minArea) {
      filtered = filtered.filter((p) => p.area >= +filters.minArea);
    }
    if (filters.maxArea) {
      filtered = filtered.filter((p) => p.area <= +filters.maxArea);
    }
    if (filters.rooms) {
      if (filters.rooms === "5") {
        filtered = filtered.filter((p) => p.rooms >= 5);
      } else {
        filtered = filtered.filter((p) => p.rooms === +filters.rooms);
      }
    }
    if (filters.location) {
      filtered = filtered.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    return filtered;
  }, [posters, filters]);

  // ✅ تشخیص اینکه کاربر از جستجو آمده
  useEffect(() => {
    const queryFromURL = searchParams.get("query");
    if (queryFromURL) {
      setCameFromSearch(true);
      // فوکوس روی اینپوت جستجو بعد از لود شدن کامپوننت
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 500);
    }
  }, [searchParams]);

  useEffect(() => {
    if (showFiltersMobile) {
      setMobileFilters(filters);
      setTempMobileFilters({
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minArea: filters.minArea,
        maxArea: filters.maxArea,
      });
    }
  }, [showFiltersMobile]);

  useEffect(() => {
    const uniqueById = (items: Poster[]) => {
      const map = new Map();
      items.forEach((item) => map.set(item._id, item));
      return Array.from(map.values());
    };

    const fetchData = async () => {
      setLoading(page === 1);
      setIsFetchingMore(page > 1);

      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          ...(filters.parentType && { parentType: filters.parentType }),
          ...(filters.tradeType && { tradeType: filters.tradeType }),
          ...(filters.search && { query: filters.search }),
        });

        const res = await fetch(`/api/poster?${query.toString()}`);
        const data = await res.json();

        // Check if response has pagination (normal mode) vs suggestions mode
        if (data.pagination) {
          setHasNextPage(data.pagination.hasNextPage);

          if (page === 1) {
            setPosters(data.posters || []);
          } else {
            setPosters((prev) =>
              uniqueById([...prev, ...(data.posters || [])])
            );
          }
        } else {
          // Handle error case or suggestions mode
          setHasNextPage(false);
          if (page === 1) {
            setPosters([]);
          }
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    };

    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
  }, [page, limit, filters.parentType, filters.tradeType, filters.search]);

  useEffect(() => {
    const handleScroll = () => {
      if (isFetchingMore || loading || !hasNextPage) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // اگر کاربر به 300px مونده به آخر صفحه رسید
      if (scrollTop + windowHeight >= fullHeight - 500) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetchingMore, loading, hasNextPage]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    setPage(1); // فیلتر جدید = برگرد به صفحه ۱
    updateURL(
      1,
      limit,
      key === "parentType" ? value : updated.parentType,
      key === "tradeType" ? value : updated.tradeType,
      key === "search" ? value : updated.search
    );
  };

  const handleInputChangeSuggestion = async (value: string) => {
    setInputValue(value);

    if (value.trim().length >= 2) {
      setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/poster?query=${encodeURIComponent(
              value
            )}&suggestionsOnly=true`
          );
          const data = await res.json();
          setSuggestions(data.suggestions || []);
        } catch (e) {
          console.error("Suggestion fetch error", e);
        }
      }, 500);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    setSuggestions([]);

    handleFilterChange("search", text); // همون تابعی که فیلترها رو آپدیت می‌کنه
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      parentType: "",
      tradeType: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      rooms: "",
      location: "",
    });
    setTempFilters({
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
    });
    setPage(1);
    updateURL(1, limit, "", "", "");
  };

  const formatPosterForReportageBox = (poster: Poster) => {
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
        rooms: poster.rooms,
        floor: poster.floor,
        buildingDate: poster.buildingDate,
      },
      images: poster.images || [],
      isNew:
        new Date(poster.createdAt) >
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isSpecialOffer: poster.tag === "ویژه" || poster.tag === "فوری",
      isInvestment: poster.type === "investment",
      posterType: poster.type,
      parentType: poster.parentType,
      tradeType: poster.tradeType,
      convertible: poster.convertible || false,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">... در حال بارگذاری آگهی‌ها</p>
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
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800">
                  آگهی‌های املاک
                </h1>
                {cameFromSearch && filters.search && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#01ae9b] to-[#00BC9B] text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
                  >
                    <FiTag size={14} />
                    <span>جستجو برای: {filters.search.slice(0, 20)}...</span>
                  </motion.div>
                )}
              </div>
              <p className="text-gray-600 mt-1">
                {filteredPos.length} آگهی از {posters.length} آگهی موجود
              </p>
            </div>

            <div className="items-center gap-3 hidden lg:flex">
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
                className={` hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
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

      <div className="max-w-7xl mx-auto px-4  ">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <AnimatePresence>
            {!showFilters && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:w-80 bg-white rounded-xl shadow-lg border border-gray-100 h-fit hidden md:block sticky top-6 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#01ae9b] to-[#66308d] p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      فیلترها
                    </h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium"
                    >
                      پاک کردن
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-4">
                  {/* Search */}
                  <div className="p-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-1">
                      <svg
                        className="w-4 h-4 text-[#01ae9b]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      جستجو
                      {cameFromSearch && filters.search && (
                        <span className="text-xs bg-[#01ae9b] text-white px-2 py-1 rounded-full font-medium">
                          فعال
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="جستجو در عنوان، توضیحات و موقعیت..."
                        value={inputValue}
                        onChange={(e) =>
                          handleInputChangeSuggestion(e.target.value)
                        }
                        className={`w-full px-4 py-1 text-black placeholder:text-sm bg-white border-2 rounded-md transition-all duration-300 placeholder:text-gray-400 ${
                          cameFromSearch && filters.search
                            ? "border-[#01ae9b] ring-4 ring-[#01ae9b]/10 bg-[#01ae9b]/5"
                            : "border-gray-200 focus:border-[#01ae9b] focus:ring-4 focus:ring-[#01ae9b]/10 hover:border-gray-300"
                        }`}
                      />
                      {suggestions.length > 0 && (
                        <ul className="absolute z-20 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl mt-2 max-h-60 overflow-auto">
                          {suggestions.map((sugg, idx) => (
                            <li
                              key={idx}
                              onClick={() => handleSuggestionClick(sugg)}
                              className="px-4 py-3 hover:bg-[#01ae9b]/10 text-black cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              {sugg}
                            </li>
                          ))}
                          <li
                            className="px-4 py-3 text-center text-sm text-[#01ae9b] cursor-pointer hover:bg-gray-50 font-medium border-t-2 border-gray-200"
                            onClick={() => handleSuggestionClick(inputValue)}
                          >
                            نمایش همه نتایج برای {inputValue}
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="  p-2  ">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-1">
                      <svg
                        className="w-4 h-4 text-[#01ae9b]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      نوع ملک
                    </label>
                    <select
                      value={filters.parentType}
                      onChange={(e) =>
                        handleFilterChange("parentType", e.target.value)
                      }
                      className="w-full px-4 py-1 text-black bg-white border-2 border-gray-200 rounded-md focus:border-[#01ae9b] focus:ring-4 focus:ring-[#01ae9b]/10 hover:border-gray-300 transition-all duration-200"
                    >
                      <option value="">همه انواع</option>
                      <option value="residentialRent">مسکونی اجاره</option>
                      <option value="residentialSale">مسکونی فروش</option>
                      <option value="commercialRent">تجاری اجاره</option>
                      <option value="commercialSale">تجاری فروش</option>
                      <option value="shortTermRent">اجاره کوتاه مدت</option>
                      <option value="ConstructionProject">
                        پروژه ساختمانی
                      </option>
                    </select>
                  </div>

                  {/* Trade Type */}
                  <div className=" p-2 ">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-1">
                      <svg
                        className="w-4 h-4 text-[#01ae9b]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      نوع معامله
                    </label>
                    <select
                      value={filters.tradeType}
                      onChange={(e) =>
                        handleFilterChange("tradeType", e.target.value)
                      }
                      className="w-full px-4 py-1 text-black bg-white border-2 border-gray-200 rounded-md focus:border-[#01ae9b] focus:ring-4 focus:ring-[#01ae9b]/10 hover:border-gray-300 transition-all duration-200"
                    >
                      <option value="">همه انواع</option>
                      <option value="House">خانه</option>
                      <option value="Villa">ویلا</option>
                      <option value="Old">کلنگی</option>
                      <option value="Office">اداری</option>
                      <option value="Shop">مغازه</option>
                      <option value="industrial">صنعتی</option>
                      <option value="partnerShip">مشارکت</option>
                      <option value="preSale">پیش‌فروش</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="p-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-1">
                      <svg
                        className="w-4 h-4 text-[#01ae9b]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      محدوده قیمت (تومان)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-white px-1">
                          از
                        </span>
                        <input
                          type="number"
                          placeholder="حداقل"
                          value={tempFilters.minPrice}
                          onChange={(e) =>
                            setTempFilters((prev) => ({
                              ...prev,
                              minPrice: e.target.value,
                            }))
                          }
                          onBlur={(e) =>
                            handleFilterChange("minPrice", e.target.value)
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            handleFilterChange(
                              "minPrice",
                              e.currentTarget.value
                            )
                          }
                          className="w-full pl-10 pr-3 py-1 text-black bg-white border-2 border-gray-200 rounded-md focus:border-[#01ae9b] focus:ring-4 focus:ring-[#01ae9b]/10 hover:border-gray-300 transition-all duration-200"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-white px-1">
                          تا
                        </span>
                        <input
                          type="number"
                          placeholder="حداکثر"
                          value={tempFilters.maxPrice}
                          onChange={(e) =>
                            setTempFilters((prev) => ({
                              ...prev,
                              maxPrice: e.target.value,
                            }))
                          }
                          onBlur={(e) =>
                            handleFilterChange("maxPrice", e.target.value)
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            handleFilterChange(
                              "maxPrice",
                              e.currentTarget.value
                            )
                          }
                          className="w-full pl-10 pr-3 py-1 text-black bg-white border-2 border-gray-200 rounded-md focus:border-[#01ae9b] focus:ring-4 focus:ring-[#01ae9b]/10 hover:border-gray-300 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Area Range */}
                  <div className=" p-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-1">
                      <svg
                        className="w-4 h-4 text-[#01ae9b]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                      محدوده متراژ (متر مربع)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-white px-1">
                          از
                        </span>
                        <input
                          type="number"
                          placeholder="حداقل"
                          value={tempFilters.minArea}
                          onChange={(e) =>
                            setTempFilters((prev) => ({
                              ...prev,
                              minArea: e.target.value,
                            }))
                          }
                          onBlur={(e) =>
                            handleFilterChange("minArea", e.target.value)
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            handleFilterChange("minArea", e.currentTarget.value)
                          }
                          className="w-full pl-10 pr-3 py-1 text-black bg-white border-2 border-gray-200 rounded-md focus:border-[#01ae9b] focus:ring-4 focus:ring-[#01ae9b]/10 hover:border-gray-300 transition-all duration-200"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-white px-1">
                          تا
                        </span>
                        <input
                          type="number"
                          placeholder="حداکثر"
                          value={tempFilters.maxArea}
                          onChange={(e) =>
                            setTempFilters((prev) => ({
                              ...prev,
                              maxArea: e.target.value,
                            }))
                          }
                          onBlur={(e) =>
                            handleFilterChange("maxArea", e.target.value)
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            handleFilterChange("maxArea", e.currentTarget.value)
                          }
                          className="w-full pl-10 pr-3 py-1 text-black bg-white border-2 border-gray-200 rounded-md focus:border-[#01ae9b] focus:ring-4 focus:ring-[#01ae9b]/10 hover:border-gray-300 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div className=" p-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-1">
                      <svg
                        className="w-4 h-4 text-[#01ae9b]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0"
                        />
                      </svg>
                      تعداد اتاق
                    </label>
                    <select
                      value={filters.rooms}
                      onChange={(e) =>
                        handleFilterChange("rooms", e.target.value)
                      }
                      className="w-full px-4 py-1 text-black bg-white border-2 border-gray-200 rounded-md focus:border-[#01ae9b] focus:ring-4 focus:ring-[#01ae9b]/10 hover:border-gray-300 transition-all duration-200"
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
                  {/* <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                      <svg className="w-4 h-4 text-[#01ae9b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      منطقه
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="نام منطقه یا محله..."
                        value={inputValue}
                        onChange={(e) =>
                          handleInputChangeSuggestion(e.target.value)
                        }
                        className="w-full text-black pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                      />
                      {inputValue.trim() !== "" && (
                        <ul className="absolute -top-14 z-10 w-full bg-white border rounded-lg shadow-md mt-1 max-h-60 overflow-auto">
                          <li
                            className="px-4 py-2 text-black cursor-pointer hover:bg-[#01ae9b]/10"
                            onClick={() => handleSuggestionClick(inputValue)}
                          >
                            {inputValue.trim()}
                          </li>
                        </ul>
                      )}
                    </div>
                  </div> */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Summary */}
            <div
              className={`bg-white rounded-xl shadow-sm p-4 mb-6 transition-all duration-300 ${
                cameFromSearch && filters.search
                  ? "ring-2 ring-[#01ae9b]/20 border border-[#01ae9b]/30"
                  : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiHome size={18} />
                    <span className="font-medium">
                      {filteredPos.length} آگهی یافت شد
                    </span>
                  </div>
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
            {filteredPos.length === 0 ? (
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
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                <AnimatePresence>
                  {filteredPos.map((poster, index) => (
                    <motion.div
                      key={`${poster._id}-${index}`}
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

            {isFetchingMore && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-2">
                  <FiLoader className="w-6 h-6 text-[#01ae9b] animate-spin" />
                  <span className="text-gray-600">
                    در حال بارگذاری بیشتر...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="fixed bottom-15 left-1/2 -translate-x-1/2 md:hidden z-30">
          <button
            onClick={() => setShowFiltersMobile(true)}
            className={`flex items-center justify-center gap-2 px-6 py-3 backdrop-blur-sm text-white rounded-full shadow-lg hover:bg-[#01ae9b] transition-all duration-300 ${
              isScrolling
                ? "bg-[#01ae9b]/15 backdrop-blur-sm"
                : "bg-[#01ae9b]/80"
            }`}
          >
            <FiFilter size={20} />
            <span>فیلترها</span>
          </button>
        </div>

        {/* Mobile Filter Panel */}
        <AnimatePresence>
          {showFiltersMobile && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0  bg-black z-40"
                onClick={() => setShowFiltersMobile(false)}
              />

              {/* Panel */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 20, duration: 0.2 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-xl max-h-[85vh] overflow-y-auto"
              >
                {/* Handle indicator */}
                <div className="flex justify-center pt-3 sticky top-0 bg-white z-10">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                  <h3 className="text-lg font-bold text-gray-800">فیلترها</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-[#01ae9b] hover:text-[#018a7a]"
                    >
                      پاک کردن
                    </button>
                    <button
                      onClick={() => setShowFiltersMobile(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6 pb-24">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      جستجو
                      {cameFromSearch && mobileFilters.search && (
                        <span className="mr-2 text-xs bg-[#01ae9b] text-white px-2 py-0.5 rounded-full">
                          فعال
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <FiSearch
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                          cameFromSearch && mobileFilters.search
                            ? "text-[#01ae9b]"
                            : "text-gray-400"
                        }`}
                      />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="جستجو در عنوان، توضیحات و موقعیت..."
                        value={inputValue}
                        onChange={(e) =>
                          handleInputChangeSuggestion(e.target.value)
                        }
                        className={`w-full pr-10 text-black pl-4 py-2 border rounded-lg transition-all duration-300 ${
                          cameFromSearch && mobileFilters.search
                            ? "border-[#01ae9b] ring-2 ring-[#01ae9b]/20 bg-[#01ae9b]/5"
                            : "border-gray-300 focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                        }`}
                      />
                      {suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border rounded-lg shadow-md mt-1 max-h-60 overflow-auto">
                          {suggestions.map((sugg, idx) => (
                            <li
                              key={idx}
                              onClick={() => handleSuggestionClick(sugg)}
                              className="px-4 py-2 hover:bg-[#01ae9b]/10 text-black cursor-pointer"
                            >
                              {sugg}
                            </li>
                          ))}
                          <li
                            className="px-4 py-2 text-center text-sm text-[#01ae9b] cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSuggestionClick(inputValue)}
                          >
                            نمایش همه نتایج برای {inputValue}
                          </li>
                        </ul>
                      )}
                      {mobileFilters.search && (
                        <button
                          onClick={() =>
                            setMobileFilters({
                              ...mobileFilters,
                              search: "",
                            })
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <FiX size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع ملک
                    </label>
                    <select
                      value={
                        showFiltersMobile
                          ? mobileFilters.parentType
                          : filters.parentType
                      }
                      onChange={(e) =>
                        showFiltersMobile
                          ? setMobileFilters({
                              ...mobileFilters,
                              parentType: e.target.value,
                            })
                          : handleFilterChange("parentType", e.target.value)
                      }
                      className="w-full p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                    >
                      <option value="">همه انواع</option>
                      <option value="residentialRent">مسکونی اجاره</option>
                      <option value="residentialSale">مسکونی فروش</option>
                      <option value="commercialRent">تجاری اجاره</option>
                      <option value="commercialSale">تجاری فروش</option>
                      <option value="shortTermRent">اجاره کوتاه مدت</option>
                      <option value="ConstructionProject">
                        پروژه ساختمانی
                      </option>
                    </select>
                  </div>

                  {/* Trade Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع معامله
                    </label>
                    <select
                      value={
                        showFiltersMobile
                          ? mobileFilters.tradeType
                          : filters.tradeType
                      }
                      onChange={(e) =>
                        showFiltersMobile
                          ? setMobileFilters({
                              ...mobileFilters,
                              tradeType: e.target.value,
                            })
                          : handleFilterChange("tradeType", e.target.value)
                      }
                      className="w-full p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                    >
                      <option value="">همه انواع</option>
                      <option value="House">خانه</option>
                      <option value="Villa">ویلا</option>
                      <option value="Old">کلنگی</option>
                      <option value="Office">اداری</option>
                      <option value="Shop">مغازه</option>
                      <option value="industrial">صنعتی</option>
                      <option value="partnerShip">مشارکت</option>
                      <option value="preSale">پیش‌فروش</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      محدوده قیمت (تومان)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                          از
                        </span>
                        <input
                          type="number"
                          placeholder="حداقل"
                          value={tempMobileFilters.minPrice}
                          onChange={(e) =>
                            setTempMobileFilters((prev) => ({
                              ...prev,
                              minPrice: e.target.value,
                            }))
                          }
                          className="w-full pl-8 pr-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                          تا
                        </span>
                        <input
                          type="number"
                          placeholder="حداکثر"
                          value={tempMobileFilters.maxPrice}
                          onChange={(e) =>
                            setTempMobileFilters((prev) => ({
                              ...prev,
                              maxPrice: e.target.value,
                            }))
                          }
                          className="w-full pl-8 pr-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Area Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      محدوده متراژ (متر مربع)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                          از
                        </span>
                        <input
                          type="number"
                          placeholder="حداقل"
                          value={tempMobileFilters.minArea}
                          onChange={(e) =>
                            setTempMobileFilters((prev) => ({
                              ...prev,
                              minArea: e.target.value,
                            }))
                          }
                          className="w-full pl-8 pr-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                          تا
                        </span>
                        <input
                          type="number"
                          placeholder="حداکثر"
                          value={tempMobileFilters.maxArea}
                          onChange={(e) =>
                            setTempMobileFilters((prev) => ({
                              ...prev,
                              maxArea: e.target.value,
                            }))
                          }
                          className="w-full pl-8 pr-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تعداد اتاق
                    </label>
                    <select
                      value={
                        showFiltersMobile ? mobileFilters.rooms : filters.rooms
                      }
                      onChange={(e) =>
                        showFiltersMobile
                          ? setMobileFilters({
                              ...mobileFilters,
                              rooms: e.target.value,
                            })
                          : handleFilterChange("rooms", e.target.value)
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
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      منطقه
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="نام منطقه یا محله..."
                        value={
                          showFiltersMobile
                            ? mobileFilters.location
                            : filters.location
                        }
                        onChange={(e) =>
                          showFiltersMobile
                            ? setMobileFilters({
                                ...mobileFilters,
                                location: e.target.value,
                              })
                            : handleFilterChange("location", e.target.value)
                        }
                        className="w-full text-black pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
                      />
                    </div>
                  </div> */}
                  {/* Apply Button */}
                  <div className=" p-4 bg-white border-b z-50">
                    <button
                      onClick={() => {
                        // اعمال فیلترها وقتی کاربر دکمه را می‌زند
                        const updatedMobileFilters = {
                          ...mobileFilters,
                          minPrice: tempMobileFilters.minPrice,
                          maxPrice: tempMobileFilters.maxPrice,
                          minArea: tempMobileFilters.minArea,
                          maxArea: tempMobileFilters.maxArea,
                        };
                        setFilters(updatedMobileFilters);
                        setTempFilters({
                          minPrice: tempMobileFilters.minPrice,
                          maxPrice: tempMobileFilters.maxPrice,
                          minArea: tempMobileFilters.minArea,
                          maxArea: tempMobileFilters.maxArea,
                        });
                        setShowFiltersMobile(false);
                      }}
                      className="w-full py-3 bg-[#01ae9b] text-white rounded-lg hover:bg-[#018a7a] transition-colors font-medium"
                    >
                      اعمال فیلترها ({filteredPos.length})
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Loading component
function PosterListLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
        <p className="text-gray-600">درحال بارگذاری</p>
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
const PosterListPage = () => {
  return (
    <Suspense fallback={<PosterListLoading />}>
      <PosterListContent />
    </Suspense>
  );
};

export default PosterListPage;
