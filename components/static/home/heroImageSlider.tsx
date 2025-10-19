"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiOutlineEye, HiOutlineLocationMarker } from "react-icons/hi";
import { FiLoader } from "react-icons/fi";
import { usePosters } from "@/hooks/usePosters";

const HeroImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
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
    if (posters.length > 1 && !isAnimating) {
      setIsAnimating(true);
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % posters.length);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  const prevSlide = () => {
    if (posters.length > 1 && !isAnimating) {
      setIsAnimating(true);
      setDirection(-1);
      setCurrentIndex((prev) => (prev - 1 + posters.length) % posters.length);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  const goToSlide = (index: number) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  const currentPoster = posters[currentIndex];

  if (loading) {
    return (
      <div className="col-span-8 row-span-6 flex items-center justify-center rounded-tr-3xl rounded-br-3xl">
        <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
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
          <h2 className="text-xl font-bold mb-2">به املاک اوج خوش آمدید</h2>
          <p className="text-sm text-gray-200">منتظر آگهی‌های جدید باشید ✨</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }

        @keyframes slideOutLeft {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-enter-right {
          animation: slideInRight 0.4s ease-out forwards;
        }

        .slide-enter-left {
          animation: slideInLeft 0.4s ease-out forwards;
        }

        .slide-exit-right {
          animation: slideOutRight 0.4s ease-out forwards;
        }

        .slide-exit-left {
          animation: slideOutLeft 0.4s ease-out forwards;
        }

        .fade-in-up-1 {
          animation: fadeInUp 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }

        .fade-in-up-2 {
          animation: fadeInUp 0.5s ease-out 0.3s forwards;
          opacity: 0;
        }

        .fade-in-up-3 {
          animation: fadeInUp 0.5s ease-out 0.4s forwards;
          opacity: 0;
        }
      `}</style>

      <div className="col-span-8 row-span-6 relative" dir="rtl">
        {/* Base background to prevent flashing */}
        <div className="absolute inset-0 bg-transparent z-0" />

        {/* Slide container */}
        <div className="relative w-full rounded-r-2xl h-full overflow-hidden z-10">
          <div
            key={currentIndex}
            className={`absolute inset-0 w-full h-full ${
              direction > 0 ? "slide-enter-right" : "slide-enter-left"
            }`}
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
              className="object-cover rounded-tr-3xl rounded-br-3xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

            <div className="absolute bottom-0 right-0 p-6 text-white w-full z-20">
              <h2 className="fade-in-up-1 text-xl font-bold mb-2">
                {currentPoster.title}
              </h2>

              <p className="fade-in-up-2 text-sm text-gray-200 mb-4 line-clamp-2">
                {currentPoster.description.slice(0, 30)}...
              </p>

              <div className="fade-in-up-3 flex items-center justify-between gap-4 text-xs">
                {/* Location badge */}
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                  <HiOutlineLocationMarker className="text-white text-base" />
                  <span>{currentPoster.location.slice(0, 30)}...</span>
                </div>

                {/* View button */}
                <Link
                  href={`/poster/${currentPoster._id}`}
                  className="
                    flex items-center gap-2 z-500
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
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        {posters.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition z-20"
              disabled={isAnimating}
            >
              <FaChevronLeft className="text-sm" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition z-20"
              disabled={isAnimating}
            >
              <FaChevronRight className="text-sm" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {posters.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isAnimating}
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
      </div>
    </>
  );
};

export default HeroImageSlider;
