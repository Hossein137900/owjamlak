"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiArea } from "react-icons/bi";
import { IoBedOutline } from "react-icons/io5";
import { Poster } from "@/types/type";

const HeroImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const res = await fetch("/api/poster");
        if (!res.ok) throw new Error("Failed to fetch posters");
        const data = await res.json();
        setPosters(data.posters.slice(0, 3));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosters();
  }, []);

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

  if (loading || !currentPoster) {
    return (
      <div className="col-span-8 row-span-6 flex items-center justify-center bg-gray-100 rounded-tr-3xl rounded-br-3xl">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-8 row-span-6 flex items-center justify-center bg-red-100 text-red-700 rounded-tr-3xl rounded-br-3xl">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="col-span-8 row-span-6 relative rounded-tr-3xl rounded-br-3xl shadow-2xl"
      dir="rtl"
    >
      {/* Base background to prevent flashing */}
      <div className="absolute inset-0 bg-white z-0" />

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
            <Link
              href={`/poster/${currentPoster._id}`}
              className="block w-full h-full"
            >
              <Image
                src={"/assets/images/hero4.jpg"}
                alt={currentPoster.images[0]?.alt || currentPoster.title}
                fill
                className="object-cover"
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
                  className="text-2xl font-bold mb-2"
                >
                  {currentPoster.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-sm text-gray-200 mb-4 line-clamp-2"
                >
                  {currentPoster.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex items-center gap-4 text-xs"
                >
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                    <HiOutlineLocationMarker />
                    <span>{currentPoster.location}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                    <BiArea />
                    <span>{currentPoster.area} متر</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                    <IoBedOutline />
                    <span>{currentPoster.rooms} خواب</span>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-4 text-lg font-semibold"
                >
                  {/* <span>
                    {currentPoster.totalPrice.toLocaleString("fa-IR")} تومان
                  </span> */}
                </motion.div>
              </div>
            </Link>
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
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
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
