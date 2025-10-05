// components/sections/AdminListSection.tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaUserTie, FaPhone, FaArrowLeft, FaUsers } from "react-icons/fa";
import { Admin } from "@/types/type";

const AdminListSection = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admins");
      if (!res.ok) {
        throw new Error("خطا در دریافت مدیران");
      }
      const data = await res.json();
      setAdmins(data.admins || []);
    } catch (err) {
      console.log("Error fetching admins:", err);
      setError(err instanceof Error ? err.message : "خطا در بارگذاری");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#01ae9b_0%,transparent_50%),radial-gradient(circle_at_75%_75%,#01ae9b_0%,transparent_50%),radial-gradient(circle_at_25%_75%,#01ae9b_0%,transparent_50%),radial-gradient(circle_at_75%_25%,#01ae9b_0%,transparent_50%)] bg-[length:20px_20px] opacity-20 blur-sm"></div>
        <div className="text-center relative z-10 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01ae9b] mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری مدیران...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#01ae9b_0%,transparent_50%),radial-gradient(circle_at_75%_75%,#01ae9b_0%,transparent_50%),radial-gradient(circle_at_25%_75%,#01ae9b_0%,transparent_50%),radial-gradient(circle_at_75%_25%,#01ae9b_0%,transparent_50%)] bg-[length:20px_20px] opacity-20 blur-sm"></div>
        <div className="text-center relative z-10 py-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">خطا</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchAdmins}
            className="bg-[#01ae9b] text-white px-6 py-3 rounded-lg hover:bg-[#019688] transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="py-16 relative overflow-hidden bg-gradient-to-b from-white to-[#01ae9b] container mx-auto px-4 md:px-20  "
      dir="rtl"
    >
      {/* Dotted blurred background */}
      <div className="  relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            تیم مدیریتی ما
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            با تکیه بر تجربه و تخصص مدیران برجسته، اوج املاک به عنوان پیشرو در
            بازار املاک فعالیت می‌کند.
          </p>
        </motion.div>

        {admins.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FaUserTie className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">هیچ مدیری یافت نشد</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <div
              className="flex gap-4 pb-4"
              style={{ width: `${admins.length * 280}px` }}
            >
              {admins.map((admin, index) => (
                <motion.div
                  key={admin._id}
                  initial={{ opacity: 0, x: 50 }}
                  viewport={{ once: true }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden flex-shrink-0 w-[370px]"
                >
                  <Link href={`/admins/${admin._id}`} className="block">
                    <div className="relative h-48">
                      <Image
                        src={admin.image || "/assets/images/default-admin.jpg"}
                        alt={admin.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      <span className="absolute top-4 right-4 bg-[#01ae9b]/90 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                        {admin.position}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2">
                        {admin.name}
                      </h3>
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                        {admin.description?.slice(0, 80) ||
                          "مدیر با تجربه در حوزه املاک و مستغلات."}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <FaPhone className="w-3 h-3" />
                          <span>{admin.user?.phone || "-"}</span>
                        </div>
                      </div>
                      <FaArrowLeft className="text-[#01ae9b] w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/admins"
            className="inline-flex items-center gap-2 bg-[#66308d] text-white px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-300  font-semibold"
          >
            <FaUsers />
            <span>مشاهده همه مدیران</span>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AdminListSection;
