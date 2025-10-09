"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiAward,
  FiTrendingUp,
  FiStar,
  FiPhone,
  FiUsers,
} from "react-icons/fi";
import Link from "next/link";

interface TopConsultant {
  _id: string;
  name: string;
  phone: string;
  title: string;
  description: string;
  rating: number;
  totalSales: number;
  experience: number;
  rank: number;
  image?: string;
}

const TopConsultants: React.FC = () => {
  const [consultants, setConsultants] = useState<TopConsultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopConsultants();
  }, []);

  const fetchTopConsultants = async () => {
    try {
      const res = await fetch("/api/consultant-champion");
      if (res.ok) {
        const data = await res.json();
        setConsultants(data.consultants || []);
      }
    } catch {
      setError("خطا در بارگذاری");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01ae9b] mx-auto mb-4"></div>
          <p className="text-gray-600">درحال بارگذاری مشاوران برتر...</p>
        </div>
      </section>
    );
  }

  if (error || consultants.length === 0) {
    return null;
  }

  const getRankStyle = (rank: number) => {
    const styles = {
      1: {
        badge: "from-yellow-400 via-yellow-500 to-yellow-600",
        ring: "ring-yellow-400/50",
        bg: "from-yellow-50 to-amber-50",
        shadow: "shadow-2xl shadow-yellow-400/20",
        text: "رتبه اول",
        height: "md:scale-110",
        order: "md:order-2",
        crown: true,
      },
      2: {
        badge: "from-gray-300 via-gray-400 to-gray-500",
        ring: "ring-gray-300/50",
        bg: "from-gray-50 to-slate-50",
        shadow: "shadow-xl shadow-gray-300/20",
        text: "رتبه دوم",
        height: "md:scale-100 md:mt-8",
        order: "md:order-1",
        crown: false,
      },
      3: {
        badge: "from-orange-400 via-orange-500 to-orange-600",
        ring: "ring-orange-300/50",
        bg: "from-orange-50 to-red-50",
        shadow: "shadow-xl shadow-orange-300/20",
        text: "رتبه سوم",
        height: "md:scale-100 md:mt-8",
        order: "md:order-3",
        crown: false,
      },
    };
    return styles[rank as keyof typeof styles] || styles[3];
  };

  return (
    <section
      className="py-20 px-4 md:px-20 mx-auto container bg-gradient-to-b from-gray-50 to-white"
      dir="rtl"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#01ae9b] via-[#019688] to-[#01ae9b] bg-clip-text text-transparent">
            مشاورین برتر ماه
          </h2>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          مشاوران برتر با بالاترین عملکرد و رضایت مشتریان
        </p>
      </motion.div>

      {/* Podium Style Grid */}
      <div className="  mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-end">
          {consultants.map((consultant, index) => {
            const style = getRankStyle(consultant.rank);
            return (
              <motion.div
                key={consultant._id}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className={`relative ${style.order} ${style.height} transition-all duration-500`}
              >
                {/* Crown for First Place */}
                {style.crown && (
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-30 text-5xl"
                  >
                    👑
                  </motion.div>
                )}

                {/* Rank Number - Big and Prominent */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${style.badge} flex items-center justify-center shadow-lg border-4 border-white`}
                  >
                    <span className="text-white font-black text-2xl">
                      {consultant.rank}
                    </span>
                  </div>
                </div>

                <div
                  className={`relative bg-gradient-to-br ${style.bg} rounded-3xl ${style.shadow} overflow-hidden border-2 ${style.ring} hover:scale-105 transition-all duration-300`}
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-white/40 to-transparent rounded-full blur-3xl"></div>

                  <div className="relative p-8 pt-16">
                    {/* Avatar */}
                    <div className="text-center mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-24 h-24 rounded-full mx-auto mb-4 shadow-xl border-4 border-white overflow-hidden`}
                      >
                        {consultant.image ? (
                          <img
                            src={consultant.image.startsWith('/uploads/topConsultants/') ? `/api/consultant-champion/${consultant.image.split('/').pop()}` : consultant.image}
                            alt={consultant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-br ${style.badge} flex items-center justify-center`}
                          >
                            <FiUsers className="text-white text-3xl" />
                          </div>
                        )}
                      </motion.div>

                      <h3 className="text-2xl font-black text-gray-800 mb-2">
                        {consultant.name}
                      </h3>
                      <p className="text-[#01ae9b] font-bold mb-3 text-lg">
                        {consultant.title}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {consultant.description}
                      </p>
                    </div>

                    {/* Stats - Enhanced */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="text-center p-4 bg-white/80 backdrop-blur rounded-xl shadow-md border border-blue-100"
                      >
                        <FiTrendingUp className="text-blue-600 text-2xl mx-auto mb-2" />
                        <div className="text-xl font-black text-blue-700">
                          {consultant.totalSales}
                        </div>
                        <div className="text-xs text-blue-600 font-semibold">
                          فروش
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ y: -5 }}
                        className="text-center p-4 bg-white/80 backdrop-blur rounded-xl shadow-md border border-green-100"
                      >
                        <FiAward className="text-green-600 text-2xl mx-auto mb-2" />
                        <div className="text-xl font-black text-green-700">
                          {consultant.experience}
                        </div>
                        <div className="text-xs text-green-600 font-semibold">
                          سال
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ y: -5 }}
                        className="text-center p-4 bg-white/80 backdrop-blur rounded-xl shadow-md border border-yellow-100"
                      >
                        <FiStar className="text-yellow-600 text-2xl mx-auto mb-2" />
                        <div className="text-xl font-black text-yellow-700">
                          {consultant.rating}
                        </div>
                        <div className="text-xs text-yellow-600 font-semibold">
                          امتیاز
                        </div>
                      </motion.div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 p-3 bg-white/80 backdrop-blur rounded-xl border border-gray-200">
                        <FiPhone className="text-[#01ae9b]" />
                        <span className="text-sm font-semibold text-gray-700">
                          {consultant.phone}
                        </span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          window.open(`tel:${consultant.phone}`, "_self")
                        }
                        className="w-full py-3 bg-gradient-to-r from-[#01ae9b] to-[#019688] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <FiPhone className="text-lg" />
                        تماس با مشاور
                      </motion.button>
                    </div>
                  </div>

                  {/* Shimmer Effect */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "linear",
                      delay: index * 0.3,
                    }}
                    className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <Link
          href={"/consultant"}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-[#01ae9b] to-[#019688] text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <FiUsers className="text-xl" />
          <span>مشاهده تمام مشاوران</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ←
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );
};

export default TopConsultants;
