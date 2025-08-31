"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiOutlineEye, HiOutlineLocationMarker } from "react-icons/hi";
import { FiLoader } from "react-icons/fi";
import { usePosters } from "@/hooks/usePosters";

const HeroImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { posters, loading, error } = usePosters();

  useEffect(() => {
    if (posters.length > 1) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % posters.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [posters.length]);

  const nextSlide = () => {
    if (posters.length > 1) {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % posters.length);
    }
  };

  const prevSlide = () => {
    if (posters.length > 1) {
      setDirection(-1);
      setCurrentIndex((prev) => (prev - 1 + posters.length) % posters.length);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      zIndex: 0,
      opacity: 1,
    }),
    center: {
      x: 0,
      zIndex: 1,
      opacity: 1,
      transition: {
        x: { type: "tween", duration: 0.4 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      zIndex: 0,
      opacity: 1,
      transition: {
        x: { type: "tween", duration: 0.4 },
      },
    }),
  };

  const currentPoster = posters[currentIndex];

  if (loading) {
    return (
      <div className="col-span-8 row-span-6 flex items-center justify-center  rounded-tr-3xl rounded-br-3xl">
        <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />{" "}
      </div>
    );
  }

  if (error || !currentPoster) {
    return (
      <div className="col-span-8 row-span-6 relative rounded-tr-3xl rounded-br-3xl overflow-hidden">
        <Image
          src="/assets/images/hero4.jpg"
          alt="Fallback Hero"
          fill
          className="object-cover rounded-tr-3xl rounded-br-3xl"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute bottom-0 right-0 p-6 text-white w-full">
          <h2 className="text-xl font-bold mb-2">به اوج خوش آمدید</h2>
          <p className="text-sm text-gray-200">منتظر آگهی‌های جدید باشید ✨</p>
        </div>
      </div>
    );
  }
  return (
    <motion.div className="col-span-8 row-span-6 relative " dir="rtl">
      {/* Base background to prevent flashing */}
      <div className="absolute inset-0 bg-transparent z-0" />

      {/* Slide container */}
      <div className="relative w-full rounded-r-2xl h-full overflow-hidden z-10">
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute  inset-0 w-full h-full"
          >
            <Image
              src={
                currentPoster.images?.find((img) => img.mainImage)?.url ||
                currentPoster.images[0]?.url ||
                "/assets/images/hero4.jpg"
              }
              alt={
                currentPoster.images?.find((img) => img.mainImage)?.alt ||
                currentPoster.images[0]?.alt ||
                currentPoster.title
              }
              fill
              className="object-cover  rounded-tr-3xl rounded-br-3xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            <div className="absolute bottom-0 right-0 p-6 text-white w-full z-20">
              {/* Content as before */}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 right-0 p-6 text-white w-full">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xl font-bold mb-2"
              >
                {currentPoster.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-sm text-gray-200 mb-4 line-clamp-2"
              >
                {currentPoster.description.slice(0, 30)}...
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center justify-between gap-4 text-xs"
              >
                {/* Location badge */}
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                  <HiOutlineLocationMarker className="text-white text-base" />
                  <span>{currentPoster.location.slice(0, 30)}...</span>
                </div>

                {/* View button */}
                <Link
                  href={`/poster/${currentPoster._id}`}
                  className="
      flex items-center gap-2
      bg-white/20 backdrop-blur-sm
      text-white font-medium
      px-3 py-1.5 rounded-md
      shadow-md cursor-pointer
      hover:from-[#02c2ad] hover:to-[#7c3aed]
      transition-all duration-300
      text-sm
    "
                >
                  <HiOutlineEye className="text-lg" />
                  <span>مشاهده</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {posters.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition z-20"
          >
            <FaChevronLeft className="text-sm" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition z-20"
          >
            <FaChevronRight className="text-sm" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {posters.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white scale-110 shadow"
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default HeroImageSlider;
