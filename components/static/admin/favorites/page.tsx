"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader, FiHeart, FiTrash2, FiEye } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

interface Poster {
  _id: string;
  title: string;
  images: { url: string }[];
  createdAt: string;
  price?: number;
  location?: string;
}

export default function AdminFavoritesPage() {
  const [favorites, setFavorites] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/favorite/list", {
        method: "GET",
        headers: { token },
      });
      const data = await res.json();
      if (res.ok) {
        setFavorites(data.favorites);
      } else {
        toast.error(data.message || "خطا در دریافت علاقه‌مندی‌ها");
      }
    } catch (err) {
      toast.error("خطا در اتصال به سرور");
      console.log("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (posterId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/favorite/list", {
        method: "DELETE",
        headers: {
          token: token,
          posterid: posterId,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setFavorites((prev) => prev.filter((p) => p._id !== posterId));
        toast.success("آگهی از علاقه‌مندی‌ها حذف شد");
      } else {
        toast.error(data.message || "خطا در حذف علاقه‌مندی");
      }
    } catch (err) {
      toast.error("خطا در حذف علاقه‌مندی");
      console.log("Error removing favorite:", err);
    }
  };

  const confirmDelete = (posterId: string) => {
    setItemToDelete(posterId);
    setShowDeleteModal(true);
  };

  const formatPrice = (price?: number) => {
    if (!price) return "قیمت نامشخص";
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  if (loading) {
    return (
      <div className="h-64 bg-transparent flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری علاقه مندی ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-500">
            آگهی‌های علاقه‌مندی
          </h1>
        </div>
        <p className="text-gray-600">
          {favorites.length} آگهی در لیست علاقه‌مندی‌های شما
        </p>
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <FiHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            هیچ آگهی علاقه‌مندی وجود ندارد
          </h3>
          <p className="text-gray-500">
            آگهی‌های مورد علاقه خود را به این لیست اضافه کنید
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((poster) => (
            <div
              key={poster._id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-video">
                <Image
                  src={poster.images?.[0]?.url || "/assets/images/hero.jpg"}
                  alt={poster.title}
                  fill
                  className="object-cover"
                />

                {/* Action Buttons */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <Link href={`/poster/${poster._id}`} target="_blank">
                    <button className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white transition-colors">
                      <FiEye className="text-sm" />
                    </button>
                  </Link>
                  <button
                    onClick={() => confirmDelete(poster._id)}
                    className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-700 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {poster.title}
                </h3>

                {poster.location && (
                  <p className="text-sm text-gray-600 mb-2">
                    {poster.location}
                  </p>
                )}

                {poster.price && (
                  <p className="text-lg font-bold text-green-600 mb-3">
                    {formatPrice(poster.price)}
                  </p>
                )}

                <p className="text-xs text-gray-500">
                  {poster.createdAt
                    ? new Date(poster.createdAt).toLocaleDateString("fa-IR")
                    : "نامشخص"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              dir="rtl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTrash2 className="text-2xl text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  حذف از علاقه‌مندی‌ها
                </h3>
                <p className="text-gray-600 mb-6">
                  آیا مطمئن هستید که می‌خواهید این آگهی را از لیست
                  علاقه‌مندی‌های خود حذف کنید؟
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={() => {
                      if (itemToDelete) {
                        handleRemoveFavorite(itemToDelete);
                        setShowDeleteModal(false);
                        setItemToDelete(null);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
