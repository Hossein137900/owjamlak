"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
// Import icons from react-icons

import {
  HiOutlineSearch,
  HiOutlineChat,
  HiOutlineUsers,
  HiOutlinePhone,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
} from "react-icons/hi";

interface CategoryBox {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  link: string;
}

export default function CategoryBoxes() {
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);

  // Primary color: #66308d
  // Secondary color: #01ae9b
  const primaryColor = "#66308d";
  const primaryHoverColor = "#552679";
  const secondaryColor = "#01ae9b";
  const secondaryHoverColor = "#019887";

  const categories: CategoryBox[] = [
    {
      id: "rent",
      title: "مشاوره",
      icon: <HiOutlineChat className="w-8 h-8" />,
      description: "اجاره آپارتمان، ویلا و سوئیت در سراسر ایران",
      link: "/services/realEstateConsultation",
    },
    {
      id: "buy",
      title: "ثبت آگهی",
      icon: <HiOutlineDocumentText className="w-8 h-8" />,
      description: "خرید انواع ملک با بهترین قیمت‌ها",
      link: "/admin",
    },
    {
      id: "sell",
      title: "پروفایل من",
      icon: <HiOutlineUserCircle className="w-8 h-8" />,
      description: "فروش ملک خود در کوتاه‌ترین زمان ممکن",
      link: "/admin",
    },
    {
      id: "mortgage",
      title: "تماس",
      icon: <HiOutlinePhone className="w-8 h-8" />,
      description: "رهن کامل انواع واحدهای مسکونی و تجاری",
      link: "/contactUs",
    },
    {
      id: "search",
      title: "آگهی ها",
      icon: <HiOutlineSearch className="w-8 h-8" />,
      description: "جستجوی هوشمند ملک بر اساس نیاز شما",
      link: "/poster",
    },
    {
      id: "consult",
      title: "استخدام",
      icon: <HiOutlineUsers className="w-8 h-8" />,
      description: "مشاوره تخصصی خرید، فروش و اجاره ملک",
      link: "/services/Collaboration",
    },
  ];

  // Enhanced animation variants for better UX
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Slightly increased for better visual flow
        delayChildren: 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 60, // Increased from 20 for more dramatic effect
      opacity: 0,
      scale: 0.8, // Added scale for more dynamic entrance
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        duration: 0.8,
      },
    },
  };

  // Header animation variants
  const headerVariants = {
    hidden: {
      y: -30,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Animated Header */}
      <motion.div
        className="text-center mb-10"
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
          خدمات املاک  <span style={{ color: primaryColor }}>اوج</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ما در املاک اوج، خدمات متنوعی در زمینه املاک ارائه می‌دهیم تا شما بتوانید با
          خیال راحت معاملات ملکی خود را انجام دهید
        </p>
      </motion.div>

      {/* Animated Category Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.1, // Reduced for better performance
          margin: "0px 0px -100px 0px", // Trigger animation earlier
        }}
      >
        {categories.map((category, index) => {
          // Alternate between primary and secondary colors
          const isEven = index % 2 === 0;
          const color = isEven ? primaryColor : secondaryColor;
          const hoverColor = isEven ? primaryHoverColor : secondaryHoverColor;

          return (
            <motion.div
              key={category.id}
              className="relative overflow-hidden rounded-2xl shadow-lg group"
              variants={itemVariants}
              onMouseEnter={() => setHoveredBox(category.id)}
              onMouseLeave={() => setHoveredBox(null)}
              whileHover={{
                y: -8, // Increased hover lift
                scale: 1.02, // Added subtle scale on hover
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 },
              }}
            >
              <Link href={category.link}>
                <div
                  className="p-6 h-full flex flex-col items-center text-center transition-all duration-300 relative z-10"
                  style={{
                    backgroundColor:
                      hoveredBox === category.id ? hoverColor : "white",
                    color: hoveredBox === category.id ? "white" : "#1A1A1A",
                  }}
                >
                  {/* Enhanced decorative circle with better animation */}
                  <motion.div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full -mt-10 -mr-10 opacity-10"
                    style={{
                      backgroundColor: color,
                    }}
                    animate={{
                      scale: hoveredBox === category.id ? 1.8 : 1,
                      rotate: hoveredBox === category.id ? 45 : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Icon container with enhanced animation */}
                  <motion.div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 relative`}
                    style={{
                      backgroundColor:
                        hoveredBox === category.id
                          ? "rgba(255, 255, 255, 0.2)"
                          : `${color}15`,
                    }}
                    whileHover={{
                      rotate: 360,
                      transition: { duration: 0.6 },
                    }}
                  >
                    {/* Icon with color transition */}
                    <div
                      className="transition-all duration-300"
                      style={{
                        color: hoveredBox === category.id ? "white" : color,
                      }}
                    >
                      {category.icon}
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>

                  <p
                    className={`text-sm ${
                      hoveredBox === category.id
                        ? "text-white/90"
                        : "text-gray-600"
                    }`}
                  >
                    {category.description}
                  </p>

                  {/* Enhanced "مشاهده بیشتر" button */}
                  <motion.div
                    className="mt-4 inline-flex items-center bg-white/10 backdrop-blur-sm p-3 rounded-xl text-sm font-medium text-white"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: hoveredBox === category.id ? 1 : 0,
                      y: hoveredBox === category.id ? 0 : 10,
                      scale: hoveredBox === category.id ? 1 : 0.8,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <motion.svg
                      className="mr-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{
                        x: hoveredBox === category.id ? -3 : 0,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </motion.svg>
                    مشاهده بیشتر
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
