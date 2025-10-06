"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { FaUserCircle, FaStar } from "react-icons/fa";

interface Testimonial {
  _id: string;
  name: string;
  email: string;
  message: string;
  formType: string;
  rating: number;
  createdAt: string;
  propertyType?: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Drag Controls
  const dragControls = useDragControls();

  // ⭐ Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/contact?testimonials=true");
        const data = await res.json();
        if (data.success) {
          setTestimonials(data.data || []);
        } else {
          setError(data.message || "خطا در دریافت نظرات");
        }
      } catch (err) {
        console.log(err);
        setError("مشکلی در بارگیری نظرات رخ داد.");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // ⭐ Auto-rotate
  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (testimonials.length > 1) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    }
  }, [testimonials]);

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [testimonials, startAutoSlide]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
    startAutoSlide();
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    startAutoSlide();
  };

  // ⭐ Drag End Handler
  const handleDragEnd = (
    _: TouchEvent | MouseEvent,
    info: { offset: { x: number } }
  ) => {
    const swipe = info.offset.x;
    if (swipe < -50) {
      // Swiped left
      handleNext();
    } else if (swipe > 50) {
      // Swiped right
      handlePrev();
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    }),
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`${
          i < rating ? "text-yellow-400" : "text-gray-300"
        } transition-colors`}
      />
    ));

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری نظرات...</p>
        </div>
      </section>
    );
  }

  if (error || testimonials.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <FaUserCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{error || "هنوز نظری ثبت نشده است"}</p>
        </div>
      </section>
    );
  }

  const current = testimonials[currentIndex];

  return (
    <section
      className="py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden"
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold text-gray-700">
            <span className="text-[#66308d]">نظرات </span>مشتریان
          </h2>
          <div className="w-16 h-1 bg-[#01ae9b] mx-auto my-3 rounded-full"></div>
          <p className="text-gray-600">تجربه مشتریان ما با خدمات حرفه‌ای</p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto touch-pan-y">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              dragControls={dragControls}
              className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden select-none cursor-grab active:cursor-grabbing"
            >
              <div className="grid md:grid-cols-5">
                {/* Left */}
                <div className="md:col-span-2 bg-gradient-to-br from-[#66308d] to-[#01ae9b] p-6 flex flex-col items-center justify-center text-white">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/40 mb-3 flex items-center justify-center">
                    <FaUserCircle size={60} className="text-white/80" />
                  </div>
                  <h3 className="text-lg font-bold">{current.name}</h3>
                  <div className="flex my-2">{renderStars(current.rating)}</div>
                  <p className="text-white/70 text-sm">
                    {new Date(current.createdAt).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
                {/* Right */}
                <div className="md:col-span-3 p-8">
                  <p className="text-gray-700 text-lg min-h-[200px] md:h-auto leading-relaxed mb-6 relative">
                    <span className="absolute -top-4 -right-3 text-6xl text-[#66308d]/10">
                      “
                    </span>
                    {current.message}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        {testimonials.length > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, i) => (
              <button
                aria-label="Indicators"
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                  startAutoSlide();
                }}
                className={`h-3 rounded-full transition-all ${
                  currentIndex === i ? "bg-[#66308d] w-6" : "bg-gray-300 w-3"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
