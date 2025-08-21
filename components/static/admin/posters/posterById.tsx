"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";

interface PosterImage {
  alt: string;
  url: string;
  mainImage: boolean;
}

interface User {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
}

interface Poster {
  _id: string;
  title: string;
  description: string;
  images: PosterImage[];
  buildingDate: number;
  area: number;
  rooms: number;
  parentType: string;
  tradeType: string;
  totalPrice?: number;
  pricePerMeter?: number;
  depositRent?: number;
  rentPrice?: number;
  location: string;
  contact: string;
  storage: boolean;
  floor?: number;
  parking: boolean;
  lift: boolean;
  balcony: boolean;
  user: User;
  status: string;
  views: number;
  createdAt: string;
}

const PosterById: React.FC = () => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosters = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("لطفا وارد شوید");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/poster/posterByUser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posters");
        }

        const data = await response.json();
        setPosters(data.posters || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "خطا در بارگذاری آگهی‌ها"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosters();

    const handlePosterCreated = () => {
      fetchUserPosters();
    };

    window.addEventListener('posterCreated', handlePosterCreated);

    return () => {
      window.removeEventListener('posterCreated', handlePosterCreated);
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" p-6"
      >
        <div className="flex items-center justify-center py-12">
          <FiLoader className="animate-spin text-green-600 text-4xl ml-2" />
          <span className="text-gray-600">در حال بارگذاری آگهی‌ها...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
        <p className="text-rose-600 font-medium">{error}</p>
      </div>
    );
  }

  if (posters.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-600 text-lg">آگهی‌ای پیدا نشد</p>
        <p className="text-gray-500 text-sm mt-2">هنوز آگهی‌ای ثبت نکرده‌اید</p>
      </div>
    );
  }

  return (
    <div className="space-y-">
      <div className="  p-8 text-gray-500">
        <h1 className="text-3xl font-bold mb-3">آگهی‌های من</h1>
        <p className="text-gray-600 text-lg">{posters.length} آگهی فعال</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {posters.map((poster) => {
          const mainImage =
            poster.images.find((img) => img.mainImage) || poster.images[0];

          return (
            <div
              key={poster._id}
              className="bg-white rounded-md shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              {mainImage && (
                <div className="relative h-36 md:h-44 bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={mainImage.url}
                    alt={mainImage.alt || poster.title}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}

              <div className="p-6">
                <h3 className="font-bold md:text-xl mb-3 text-gray-800 line-clamp-2 leading-tight">
                  {poster.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FaEye className="text-[#606060]" />
                    <span className="font-medium">
                      {formatPrice(poster.views)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-5 items-center justify-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-gray-700">
                    {formatPrice(poster.area)} متر
                  </span>
                  {poster.parking && (
                    <span className=" text-blue-700 rounded-lg text-xs font-semibold ">
                      پارکینگ
                    </span>
                  )}
                  {poster.storage && (
                    <span className=" text-emerald-700 rounded-lg text-xs font-semibold ">
                      انباری
                    </span>
                  )}
                  {poster.lift && (
                    <span className=" text-purple-700 rounded-lg text-xs font-semibold ">
                      آسانسور
                    </span>
                  )}
                  {poster.balcony && (
                    <span className=" text-purple-700 rounded-lg text-xs font-semibold ">
                      بالکن
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400 font-medium">
                    تاریخ ثبت :
                    {new Date(poster.createdAt).toLocaleDateString("fa-IR")}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/poster/${poster._id}`} target="_blank">
                      <button className="text-black px-2 py-2 border-b text-xs font-semibold cursor-pointer transition-all duration-300 hover:scale-105 flex items-center gap-1">
                        مشاهده
                        <FaExternalLinkAlt className="text-xs" />
                      </button>
                    </Link>
                    <button 
                      onClick={async () => {
                        if (confirm('آیا مطمئن هستید؟')) {
                          const token = localStorage.getItem('token');
                          const response = await fetch(`/api/poster/${poster._id}`, {
                            method: 'DELETE',
                            headers: { token: token || '' }
                          });
                          const result = await response.json();
                          if (result.success) {
                            window.location.reload();
                          } else {
                            alert(result.message);
                          }
                        }
                      }}
                      className="text-red-600 px-2 py-2 text-xs font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PosterById;
