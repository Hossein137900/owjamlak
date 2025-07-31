"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaEye,
  FaMapMarkerAlt,
  FaCalendar,
  FaRuler,
  FaBed,
  FaCar,
  FaWarehouse,
  FaBuilding,
  FaExternalLinkAlt,
} from "react-icons/fa";

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
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: "فعال",
      pending: "در انتظار",
      sold: "فروخته شده",
      rented: "اجاره داده شده",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      sold: "bg-rose-100 text-rose-700 border-rose-200",
      rented: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#66308d]"></div>
      </div>
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
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-[#66308d] to-[#01ae9b] rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">آگهی‌های من</h1>
        <p className="text-white/90 text-lg">{posters.length} آگهی فعال</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posters.map((poster) => {
          const mainImage =
            poster.images.find((img) => img.mainImage) || poster.images[0];

          return (
            <div
              key={poster._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              {mainImage && (
                <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={mainImage.url}
                    alt={mainImage.alt || poster.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(poster.status)}`}>
                      {getStatusLabel(poster.status)}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}

              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2 leading-tight">
                  {poster.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <FaEye className="text-[#01ae9b]" />
                    <span className="font-medium">{formatPrice(poster.views)} بازدید</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-[#66308d]" />
                    <span className="truncate font-medium">{poster.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                    <FaRuler className="text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">{formatPrice(poster.area)} متر</span>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-lg">
                    <FaBed className="text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">{poster.rooms} اتاق</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {poster.parking && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                      <FaCar className="inline ml-1" /> پارکینگ
                    </span>
                  )}
                  {poster.storage && (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-200">
                      <FaWarehouse className="inline ml-1" /> انباری
                    </span>
                  )}
                  {poster.lift && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-200">
                      <FaBuilding className="inline ml-1" /> آسانسور
                    </span>
                  )}
                </div>

                {poster.totalPrice && (
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-xl mb-4 border border-emerald-100">
                    <div className="text-xl font-bold text-emerald-700">
                      {formatPrice(poster.totalPrice)} تومان
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400 font-medium">
                    {new Date(poster.createdAt).toLocaleDateString("fa-IR")}
                  </div>
                  
                  <Link href={`/poster/${poster._id}`}>
                    <button className="bg-gradient-to-r from-[#66308d] to-[#01ae9b] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2">
                      مشاهده
                      <FaExternalLinkAlt className="text-xs" />
                    </button>
                  </Link>
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
