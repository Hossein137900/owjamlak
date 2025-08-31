"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineEye, HiOutlineLocationMarker } from "react-icons/hi";
import { FiLoader } from "react-icons/fi";
import { usePosters } from "@/hooks/usePosters";

const SliderMobile = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { posters, loading, error } = usePosters();

  useEffect(() => {
    if (posters.length > 1) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % posters.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [posters.length]);

  const handleDragEnd = (event: TouchEvent | MouseEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    } else if (
      info.offset.x < -threshold &&
      currentIndex < posters.length - 1
    ) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else if (
      info.offset.x < -threshold &&
      currentIndex === posters.length - 1
    ) {
      setDirection(1);
      setCurrentIndex(0);
    } else if (info.offset.x > threshold && currentIndex === 0) {
      setDirection(-1);
      setCurrentIndex(posters.length - 1);
    }
  };

  if (loading) {
    return (
      <div className="  py-6" dir="rtl">
        <div className="h-80 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
          <FiLoader className="w-10 h-10 text-[#01ae9b] animate-spin mb-4" />
          <p className="text-gray-600 text-sm">در حال بارگیری آگهی‌ها...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6" dir="rtl">
        <div className="h-80 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 rounded-3xl">
          <p className="text-red-600 font-medium mb-2">
            خطا در بارگیری آگهی‌ها
          </p>
          <p className="text-red-500 text-sm">لطفاً دوباره تلاش کنید</p>
        </div>
      </div>
    );
  }

   if (!posters.length) {
    return (
      <div className="py-6" dir="rtl">
        <div className="relative h-80  overflow-hidden shadow-xl">
          <Image
            src="/assets/images/hero4.jpg"
            alt="آگهی پیش‌فرض"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 p-6 text-white">
            <h3 className="text-lg font-bold">به زودی آگهی‌های جدید</h3>
            <p className="text-sm text-gray-200 mt-2">
              آگهی‌ها در حال آماده‌سازی هستند...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6" dir="rtl">
      {/* Header */}
      <div className="mb-6 px-4 flex  flex-col items-center justify-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          جدیدترین آگهی‌ها ملک
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 text-sm"
        >
          بهترین فرصت‌های سرمایه‌گذاری را کشف کنید
        </motion.p>
      </div>

      {/* Slider */}
      <div className="relative">
        <div className="relative h-80 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gray-200 z-0" />
          <AnimatePresence initial={false} custom={direction} mode="sync">
            <motion.div
              key={currentIndex}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{
                x: direction > 0 ? "100%" : "-100%",
                zIndex: 0,
                opacity: 1,
              }}
              animate={{
                x: 0,
                zIndex: 1,
                opacity: 1,
                transition: {
                  x: { type: "tween", duration: 0.4 },
                },
              }}
              exit={{
                x: direction > 0 ? "-100%" : "100%",
                zIndex: 0,
                opacity: 1,
                transition: {
                  x: { type: "tween", duration: 0.4 },
                },
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <Image
                src={
                  posters[currentIndex]?.images?.find((img) => img.mainImage)
                    ?.url ||
                  posters[currentIndex]?.images[0]?.url ||
                  "/assets/images/hero4.jpg"
                }
                alt={
                  posters[currentIndex]?.images?.find((img) => img.mainImage)
                    ?.alt ||
                  posters[currentIndex]?.images[0]?.alt ||
                  posters[currentIndex]?.title
                }
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                >
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                    {posters[currentIndex]?.title}
                  </h3>

                  <p className="text-white/90 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {posters[currentIndex]?.description.slice(0, 40)}...
                  </p>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl">
                      <HiOutlineLocationMarker className="text-white text-base" />
                      <span className="text-white text-xs font-medium">
                        {posters[currentIndex]?.location.slice(0, 20)}...
                      </span>
                    </div>

                    <Link
                      target="_blank"
                      href={`/poster/${posters[currentIndex]?._id}`}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#01ae9b] to-[#02c2ad] px-4 py-2 rounded-xl text-white text-xs text-nowrap font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <HiOutlineEye className="text-base" />
                      <span>مشاهده جزئیات</span>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced dots indicator */}
        <div className="flex justify-center gap-3 mt-6">
          {posters.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gradient-to-r from-[#01ae9b] to-[#02c2ad] w-8 shadow-lg"
                  : "bg-gray-300 w-2 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderMobile;
