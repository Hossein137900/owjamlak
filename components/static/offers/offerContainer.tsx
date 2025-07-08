"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReportageBox from "@/components/static/poster/posterBox";
import { Poster } from "@/types/type";

const OffersPage = () => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredPosters, setFilteredPosters] = useState<Poster[]>([]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>("all");

  const fetchInvestmentPosters = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/poster");

      if (!response.ok) {
        throw new Error("Failed to fetch posters");
      }

      const data = await response.json();

      // Filter posters that have type === "investment"
      const investmentPosters = data.posters.filter(
        (poster: Poster) => poster.type === "investment"
      );

      setPosters(investmentPosters);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری آگهی‌ها");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPosters = () => {
    let filtered = [...posters];

    // Filter by property type
    if (propertyTypeFilter !== "all") {
      filtered = filtered.filter(
        (poster) => poster.propertyType === propertyTypeFilter
      );
    }

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

  useEffect(() => {
    fetchInvestmentPosters();
  }, []);

  useEffect(() => {
    filterAndSortPosters();
  }, [posters, sortBy, propertyTypeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01ae9b]"></div>
          </div>
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
              onClick={fetchInvestmentPosters}
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
    <div className="min-h-screen mt-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 mt-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-[#01ae9b]">فرصت‌های </span>
            <span className="text-gray-800">سرمایه‌گذاری</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            بهترین فرصت‌های سرمایه‌گذاری در بازار املاک را کشف کنید
          </p>
        </motion.div>

        {/* Filters and Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Property Type Filter */}
              <select
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
              >
                <option value="all">همه انواع ملک</option>
                <option value="residential">مسکونی</option>
                <option value="commercial">تجاری</option>
                <option value="administrative">اداری</option>
                <option value="industrial">صنعتی</option>
                <option value="old">کلنگی</option>
              </select>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent"
              >
                <option value="newest">جدیدترین</option>
                <option value="oldest">قدیمی‌ترین</option>
                <option value="price-high">قیمت (بالا به پایین)</option>
                <option value="price-low">قیمت (پایین به بالا)</option>
                <option value="area-large">متراژ (بزرگ به کوچک)</option>
                <option value="area-small">متراژ (کوچک به بزرگ)</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-gray-600">
              {filteredPosters.length} فرصت سرمایه‌گذاری یافت شد
            </div>
          </div>
        </motion.div>

        {/* Posters Grid */}
        {filteredPosters.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPosters.map((poster, index) => (
              <motion.div
                key={poster._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
                    bedrooms: poster.rooms,
                    bathrooms: poster.floor || 0,
                    yearBuilt: new Date(poster.buildingDate).getFullYear(),
                  }}
                  imagePath={
                    poster.images && poster.images.length > 0
                      ? poster.images.find((img) => img.mainImage)?.url ||
                        poster.images[0]?.url
                      : undefined
                  }
                  isInvestment={poster.type === "investment"}
                  posterType={poster.tradeType}
                  propertyType={poster.propertyType}
                  tradeType={poster.tradeType}
                  convertible={poster.convertible}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="text-gray-500 text-lg mb-4">
              هیچ فرصت سرمایه‌گذاری‌ای یافت نشد
            </div>
            <p className="text-gray-400">
              لطفاً فیلترهای خود را تغییر دهید یا بعداً دوباره تلاش کنید
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        {filteredPosters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-16 bg-gradient-to-r from-[#01ae9b] to-[#018a7a] rounded-xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-4">
              آیا فرصت سرمایه‌گذاری مناسب پیدا نکردید؟
            </h3>
            <p className="text-lg mb-6">
              با مشاوران ما تماس بگیرید تا بهترین فرصت‌ها را برای شما پیدا کنیم
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contactUs"
                className="bg-white text-[#01ae9b] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                تماس با ما
              </a>
              <a
                href="/services/realEstateConsultation"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-[#01ae9b] transition-colors"
              >
                مشاوره رایگان
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
