"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReportageBox from "@/components/static/poster/posterBox";
import { Poster } from "@/types/type";
import {
  FiLoader,
  FiChevronDown,
  FiChevronUp,
  FiTrendingUp,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import Link from "next/link";

const OffersPage = () => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredPosters, setFilteredPosters] = useState<Poster[]>([]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [propertyTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPosters, setTotalPosters] = useState(0);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const LIMIT = 20;

  const fetchInvestmentPosters = async (page = 1, append = false) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: LIMIT.toString(),
        type: "investment",
      });

      const response = await fetch(`/api/poster?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch posters");
      }

      const data = await response.json();
      const investmentPosters = data.posters.filter(
        (poster: Poster) => poster.type === "investment"
      );

      if (append) {
        setPosters((prev) => [...prev, ...investmentPosters]);
      } else {
        setPosters(investmentPosters);
      }

      setTotalPosters(
        data.pagination?.totalPosters || investmentPosters.length
      );
      setHasMore(
        data.pagination?.hasNextPage || investmentPosters.length === LIMIT
      );
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری آگهیها");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const filterAndSortPosters = () => {
    const filtered = [...posters];

    // Sort posters
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "price-high":
        filtered.sort((a, b) => (b.totalPrice || 0) - (a.totalPrice || 0));
        break;
      case "price-low":
        filtered.sort((a, b) => (a.totalPrice || 0) - (b.totalPrice || 0));
        break;
      case "area-large":
        filtered.sort((a, b) => b.area - a.area);
        break;
      case "area-small":
        filtered.sort((a, b) => a.area - b.area);
        break;
      default:
        break;
    }

    setFilteredPosters(filtered);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchInvestmentPosters(currentPage + 1, true);
    }
  };

  const toggleTextExpansion = () => {
    setIsTextExpanded(!isTextExpanded);
  };

  useEffect(() => {
    fetchInvestmentPosters(1, false);
  }, []);

  useEffect(() => {
    filterAndSortPosters();
  }, [posters, sortBy, propertyTypeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری آگهیها...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button
              onClick={() => fetchInvestmentPosters(1, false)}
              className="bg-[#01ae9b] text-white px-6 py-2 rounded-lg hover:bg-[#018a7a] transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen mt-20 bg-gradient-to-br from-gray-50 to-white"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-12 mt-8"
        >
          <h1 className="md:text-5xl text-2xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#01ae9b] to-teal-600 bg-clip-text text-transparent">
              فرصت های{" "}
            </span>
            <span className="text-gray-800">سرمایه گذاری</span>
          </h1>
          <p className="text-gray-600 text-sm px-4 md:text-base max-w-3xl mx-auto leading-relaxed">
            بهترین فرصتهای سرمایهگذاری در بازار املاک را کشف کنید و آینده مالی
            خود را تضمین کنید
          </p>
        </motion.div>

        {/* Expandable Text Box */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-12 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center ">
              <div className="w-8 h-8 md:w-12 md:h-12 ml-1 bg-gradient-to-r from-[#01ae9b] to-teal-600 rounded-full flex items-center justify-center">
                <FiTrendingUp className="text-white text-xl" />
              </div>
              <h2 className="md:text-2xl text-base text-nowrap font-bold text-gray-800">
                چرا سرمایه گذاری در املاک؟
              </h2>
            </div>
            <button
              onClick={toggleTextExpansion}
              className="flex items-center text-xs gap-2 text-nowrap bg-[#01ae9b] text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors duration-300"
            >
              <span>{isTextExpanded ? "بستن" : "ادامه مطلب"}</span>
              {isTextExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            سرمایه گذاری در بخش املاک یکی از مطمئنترین و پرسودترین روشهای سرمایه
            گذاری محسوب میشود. با رشد مداوم جمعیت و توسعه شهری، تقاضا برای املاک
            همواره در حال افزایش است.
          </p>

          <motion.div
            initial={false}
            animate={{
              height: isTextExpanded ? "auto" : 0,
              opacity: isTextExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                در پلتفرم اوج، ما بهترین فرصتهای سرمایه گذاری را برای شما انتخاب
                کرده ایم. هر ملک با دقت بررسی شده و پتانسیل رشد قیمت و درآمدزایی
                آن تحلیل شده است.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                  <h3 className="font-bold text-green-800 mb-2">رشد ارزش</h3>
                  <p className="text-green-700 text-sm">
                    املاک در مناطق پرتقاضا با رشد ارزش بالا
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                  <h3 className="font-bold text-blue-800 mb-2">درآمد ثابت</h3>
                  <p className="text-blue-700 text-sm">
                    امکان کسب درآمد ماهانه از طریق اجاره
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                  <h3 className="font-bold text-purple-800 mb-2">
                    امنیت سرمایه
                  </h3>
                  <p className="text-purple-700 text-sm">
                    حفظ ارزش سرمایه در برابر تورم
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters and Sort */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-12 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
              >
                <option value="newest">جدیدترین</option>
                <option value="oldest">قدیمی ترین</option>
                <option value="price-high">قیمت (بالا به پایین)</option>
                <option value="price-low">قیمت (پایین به بالا)</option>
                <option value="area-large">متراژ (بزرگ به کوچک)</option>
                <option value="area-small">متراژ (کوچک به بزرگ)</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-gray-600">
              {filteredPosters.length} از {totalPosters} فرصت سرمایه گذاری
            </div>
          </div>
        </motion.div>

        {/* Posters Grid */}
        {filteredPosters.length > 0 ? (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, stagger: 0.1, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
          >
            {filteredPosters.map((poster, index) => (
              <motion.div
                key={poster._id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <ReportageBox
                  id={poster._id}
                  title={poster.title}
                  location={poster.location}
                  price={{
                    totalPrice: poster.totalPrice,
                    depositRent: poster.depositRent,
                    rentPrice: poster.rentPrice,
                    pricePerMeter: poster.pricePerMeter,
                  }}
                  features={{
                    area: poster.area,
                    buildingDate: poster.buildingDate,
                    rooms: poster.rooms,
                    floor: poster.floor,
                  }}
                  images={poster.images}
                  parentType={poster.parentType}
                  tradeType={poster.tradeType}
                  type={poster.type}
                  status={poster.status}
                  convertible={poster.convertible}
                  storage={poster.storage}
                  parking={poster.parking}
                  lift={poster.lift}
                  balcony={poster.balcony}
                  views={poster.views}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">
              هیچ فرصت سرمایه گذاریای یافت نشد
            </div>
            <p className="text-gray-400">
              لطفاً فیلترهای خود را تغییر دهید یا بعداً دوباره تلاش کنید
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredPosters.length > 0 && hasMore && (
          <div className="text-center mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
              disabled={loadingMore}
              className="bg-gradient-to-r from-[#01ae9b] to-teal-600 hover:from-teal-600 hover:to-[#01ae9b] text-white px-10 py-4 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  درحال بارگذاری
                </>
              ) : (
                `مشاهده بیشتر (${Math.min(
                  LIMIT,
                  totalPosters - filteredPosters.length
                )} مورد)`
              )}
            </motion.button>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#01ae9b] to-teal-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="md:text-4xl text-2xl font-bold mb-6">
            آماده شروع سرمایه گذاری هستید؟
          </h2>
          <p className="text-sm md:text-base mb-8 opacity-90 max-w-3xl mx-auto">
            با مشاوران متخصص ما در تماس باشید و بهترین فرصتهای سرمایه گذاری را
            کشف کنید. ما در هر مرحله از سرمایه گذاری کنار شما هستیم.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">+۵۰۰۰</div>
              <div className="opacity-90">املاک سرمایه گذاری</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">+۲۵۰۰</div>
              <div className="opacity-90">سرمایه گذار موفق</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">۲۴/۷</div>
              <div className="opacity-90">پشتیبانی تخصصی</div>
            </div>
          </div>

          <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
            <Link href="/consultant">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white cursor-pointer text-[#01ae9b] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2 justify-center"
              >
                <FiPhone />
                تماس با مشاور
              </motion.button>
            </Link>
            <Link href="/services/realEstateConsultation">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 cursor-pointer border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#01ae9b] transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <FiMail />
                درخواست مشاوره
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
