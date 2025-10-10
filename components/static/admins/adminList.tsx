"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaUserTie, FaPhone, FaArrowLeft } from "react-icons/fa";
import { Admin } from "@/types/type";

const AdminList = () => {
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
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01ae9b] mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری مدیران...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">خطا</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchAdmins}
            className="bg-[#01ae9b] text-white px-6 py-3 rounded-lg hover:bg-[#019688] transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen   py-8 mt-20" dir="rtl">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-3 text-center"
        >
          لیست مدیران
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 mb-6 text-center max-w-2xl mx-auto"
        >
          در این بخش می‌توانید لیست کامل مدیران شرکت اوج املاک را مشاهده کنید.
          هر مدیر با تجربه و تخصص در حوزه املاک، آماده همکاری و مشاوره حرفه‌ای
          با شماست. با کلیک بر روی پروفایل هر فرد، جزئیات کامل از جمله سمت،
          توضیحات و اطلاعات تماس را مشاهده نمایید.
        </motion.p>

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {admins.map((admin, index) => (
              <motion.div
                key={admin._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/admins/${admin._id}`} className="block">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="relative h-64">
                      <Image
                        src={admin.image ? `/api/admins/images/${admin.image.split('/').pop()}` : "/assets/images/default-admin.jpg"}
                        alt={admin.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <span className="absolute top-4 right-4 bg-[#01ae9b] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {admin.position}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {admin.name}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {admin.description?.slice(0, 30) ||
                          "توضیحاتی در مورد این مدیر..."}
                        ...
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500">
                          <FaPhone />
                          <span>{admin.user?.phone || "-"}</span>
                        </div>
                        <FaArrowLeft className="text-[#01ae9b]" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminList;
