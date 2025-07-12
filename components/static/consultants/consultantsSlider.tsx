"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FaChevronLeft,
  FaChevronRight,
  FaWhatsapp,
  FaPhone,
  FaStar,
} from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineBriefcase } from "react-icons/hi";
import { BiTime } from "react-icons/bi";
import { MdRealEstateAgent } from "react-icons/md";
import { Consultant } from "../../../types/type";

const ConsultantsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const res = await fetch("/api/consultants?limit=6");
        if (!res.ok) throw new Error("Failed to fetch consultants");
        const data = await res.json();
        setConsultants(data.consultants);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  useEffect(() => {
    if (consultants.length > 1) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % consultants.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [consultants.length]);

  const nextSlide = () => {
    if (consultants.length > 1) {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % consultants.length);
    }
  };

  const prevSlide = () => {
    if (consultants.length > 1) {
      setDirection(-1);
      setCurrentIndex(
        (prev) => (prev - 1 + consultants.length) % consultants.length
      );
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "tween", duration: 0.5 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        x: { type: "tween", duration: 0.5 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  const handleWhatsAppClick = (phone: string) => {
    window.open(`https://wa.me/98${phone.substring(1)}`, "_blank");
  };

  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  if (loading) {
    return (
      <div className="col-span-8 row-span-6 flex items-center justify-center bg-[#01ae9b]/10 rounded-tr-3xl rounded-br-3xl">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#01ae9b]"></div>
      </div>
    );
  }

  if (error || consultants.length === 0) {
    return (
      <div className="col-span-8 row-span-6 flex items-center justify-center bg-red-100 text-red-700 rounded-tr-3xl rounded-br-3xl">
        <p>خطا در بارگذاری مشاوران</p>
      </div>
    );
  }

  const currentConsultant = consultants[currentIndex];

  return (
    <motion.div
      className="col-span-8 row-span-6 relative rounded-tr-3xl rounded-br-3xl shadow-2xl bg-gradient-to-br from-[#01ae9b] to-[#019688]"
      dir="rtl"
    >
      <div className="relative w-full h-full overflow-hidden rounded-tr-3xl rounded-br-3xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <div className="flex h-full">
              {/* Consultant Image */}
              <div className="w-2/5 relative">
                <Image
                  src={
                    currentConsultant.image ||
                    "/assets/images/default-consultant.jpg"
                  }
                  alt={currentConsultant.name}
                  fill
                  className="object-cover rounded-tr-3xl"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20 rounded-tr-3xl" />

                {/* Rating Badge */}
                {currentConsultant.rating && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                    <FaStar className="text-xs" />
                    <span>{currentConsultant.rating}</span>
                  </div>
                )}
              </div>

              {/* Consultant Info */}
              <div className="w-3/5 p-6 text-white flex flex-col justify-between">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-4"
                  >
                    <h2 className="text-3xl font-bold mb-2">
                      {currentConsultant.name}
                    </h2>
                    <p className="text-white/90 text-lg">مشاور املاک</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="grid grid-cols-2 gap-4 mb-6"
                  >
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <BiTime className="text-yellow-300" />
                      <span className="text-sm">
                        {currentConsultant.experienceYears} سال تجربه
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <MdRealEstateAgent className="text-blue-300" />
                      <span className="text-sm">
                        {currentConsultant.posterCount} آگهی
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-6"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <HiOutlineLocationMarker className="text-green-300" />
                      <span className="text-sm font-medium">مناطق فعالیت:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentConsultant.workAreas
                        .slice(0, 3)
                        .map((area, index) => (
                          <span
                            key={index}
                            className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md text-xs"
                          >
                            {area}
                          </span>
                        ))}
                      {currentConsultant.workAreas.length > 3 && (
                        <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md text-xs">
                          +{currentConsultant.workAreas.length - 3} منطقه دیگر
                        </span>
                      )}
                    </div>
                  </motion.div>

                  {currentConsultant.specialties &&
                    currentConsultant.specialties.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mb-6"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <HiOutlineBriefcase className="text-purple-300" />
                          <span className="text-sm font-medium">تخصص‌ها:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {currentConsultant.specialties
                            .slice(0, 2)
                            .map((specialty, index) => (
                              <span
                                key={index}
                                className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md text-xs"
                              >
                                {specialty}
                              </span>
                            ))}
                        </div>
                      </motion.div>
                    )}
                </div>

                {/* Contact Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex gap-3"
                >
                  <button
                    onClick={() =>
                      handleWhatsAppClick(currentConsultant.whatsapp)
                    }
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors duration-300 flex-1"
                  >
                    <FaWhatsapp />
                    <span className="text-sm">واتساپ</span>
                  </button>

                  <button
                    onClick={() => handlePhoneClick(currentConsultant.phone)}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors duration-300 flex-1"
                  >
                    <FaPhone />
                    <span className="text-sm">تماس</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {consultants.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 z-20"
          >
            <FaChevronLeft className="text-lg" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 z-20"
          >
            <FaChevronRight className="text-lg" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {consultants.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white scale-110 shadow-lg"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Header */}
      <div className="absolute top-4 left-6 z-20">
        <h3 className="text-white text-lg font-semibold">مشاوران املاک</h3>
      </div>
    </motion.div>
  );
};

export default ConsultantsSlider;
