"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  project: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  // Generate stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <i
        key={index}
        className={`fas fa-star ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      ></i>
    ));
  };

  return (
    <section className="py-16 bg-gray-50 overflow-hidden" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-[#66308d]">نظرات </span>
            <span className="text-gray-800">مشتریان ما</span>
          </h2>
          <div className="w-20 h-1 bg-[#01ae9b] mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            آنچه مشتریان ما درباره خدمات و همکاری با تیم ما می‌گویند
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              // exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-5">
                {/* Left side - Image and info */}
                <div className="md:col-span-2 bg-gradient-to-br from-[#66308d] to-[#01ae9b] p-8 flex flex-col justify-center items-center text-white">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 mb-4">
                    {testimonials[currentIndex].avatar ? (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FaUserCircle className="text-gray-400" size={70} />
                      </div>
                    ) : (
                      <Image
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-1">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="text-white/80 mb-4">
                    {testimonials[currentIndex].role}
                  </p>
                  <div className="flex space-x-1 mb-4">
                    {renderStars(testimonials[currentIndex].rating)}
                  </div>
                  <p className="text-white/90 text-sm text-center">
                    پروژه: {testimonials[currentIndex].project}
                  </p>
                </div>

                {/* Right side - Testimonial content */}
                <div className="md:col-span-3 p-8 flex flex-col justify-center">
                  <div className="text-4xl text-[#66308d]/20 mb-4">
                    <i className="fas fa-quote-right"></i>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {testimonials[currentIndex].content}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={handleNext}
            className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 bg-white w-12 h-12 rounded-full shadow-md flex items-center justify-center text-[#66308d] hover:bg-[#66308d] hover:text-white transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <MdChevronLeft size={20} />
          </button>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6 bg-white w-12 h-12 rounded-full shadow-md flex items-center justify-center text-[#66308d] hover:bg-[#66308d] hover:text-white transition-colors z-10"
            aria-label="Next testimonial"
          >
            <MdChevronRight size={20} />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[#66308d] w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
