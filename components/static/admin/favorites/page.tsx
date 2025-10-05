"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader, FiHeart, FiTrash2, FiEye } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import { Poster } from "@/types/type";

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
          <FiHeart className="text-3xl md:text-5xl text-red-500 mx-auto mb-4" />
          <h3 className="text-sm md:text-lg font-semibold text-gray-600 mb-2">
            هیچ آگهی علاقه‌مندی وجود ندارد
          </h3>
          <p className="text-gray-500 text-xs md:text-base">
            آگهی‌های مورد علاقه خود را به این لیست اضافه کنید
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {favorites.map((poster) => {
            const mainImage =
              poster.images?.find((img) => img.mainImage) || poster.images?.[0];
            const imageUrl =
              typeof mainImage === "string"
                ? mainImage
                : mainImage?.url || "/assets/images/hero2.png";

            return (
              <div
                key={poster._id}
                className="bg-white/90 rounded-md shadow-sm   hover:shadow-2xl transition-all duration-300 hover:-translate-y-1  overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-video">
                  <Image
                    src={imageUrl}
                    alt={poster.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 text-xs md:text-base">
                    {poster.title}
                  </h3>

                  {poster.location && (
                    <p className="text-[10px] text-gray-600 mb-2 line-clamp-1">
                      {poster.location.slice(0, 30)}...
                    </p>
                  )}

                  <div className=" flex gap-2 justify-between items-center mt-2">
                    <p className="text-[10px] md:text-sm text-gray-500">
                      {poster.createdAt
                        ? new Date(poster.createdAt).toLocaleDateString("fa-IR")
                        : "نامشخص"}
                    </p>
                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      {" "}
                      <Link href={`/poster/${poster._id}`} target="_blank">
                        <button
                          aria-label="view"
                          className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-700 hover:bg-blue-500 cursor-pointer hover:text-white transition-colors"
                        >
                          <FiEye className="text-sm" />
                        </button>
                      </Link>
                      <button
                        aria-label="delete"
                        onClick={() => confirmDelete(poster._id)}
                        className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-700 hover:bg-red-600 cursor-pointer hover:text-white transition-colors"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
                    aria-label="cancel"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    aria-label="delete"
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
