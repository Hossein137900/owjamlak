"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface CategoryBox {
  id: string;
  title: string;
  imagePath: string;
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
      title: "اجاره",
      imagePath: "/assets/images/categories/rent.png",
      description: "اجاره آپارتمان، ویلا و سوئیت در سراسر ایران",
      link: "/poster",
    },
    {
      id: "buy",
      title: "خرید",
      imagePath: "/assets/images/categories/buy.png",
      description: "خرید انواع ملک با بهترین قیمت‌ها",
      link: "/poster",
    },
    {
      id: "sell",
      title: "فروش",
      imagePath: "/assets/images/categories/sale.png",
      description: "فروش ملک خود در کوتاه‌ترین زمان ممکن",
      link: "/poster",
    },
    {
      id: "mortgage",
      title: "رهن",
      imagePath: "/assets/images/categories/consult.png",
      description: "رهن کامل انواع واحدهای مسکونی و تجاری",
      link: "/poster",
    },
    {
      id: "search",
      title: "جستجوی ملک",
      imagePath: "/assets/images/categories/rent.png",
      description: "جستجوی هوشمند ملک بر اساس نیاز شما",
      link: "/poster",
    },
    {
      id: "consult",
      title: "مشاوره",
      imagePath: "/assets/images/categories/rent.png",
      description: "مشاوره تخصصی خرید، فروش و اجاره ملک",
      link: "/services",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
          خدمات <span style={{ color: primaryColor }}>اوج</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ما در اوج، خدمات متنوعی در زمینه املاک ارائه می‌دهیم تا شما بتوانید با
          خیال راحت معاملات ملکی خود را انجام دهید.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
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
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
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
                  {/* Decorative circle */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full -mt-10 -mr-10 transition-all duration-500 opacity-10"
                    style={{
                      backgroundColor: color,
                      transform:
                        hoveredBox === category.id ? "scale(1.5)" : "scale(1)",
                    }}
                  />

                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 relative`}
                    style={{
                      backgroundColor:
                        hoveredBox === category.id
                          ? "rgba(255, 255, 255, 0.2)"
                          : `${color}15`,
                    }}
                  >
                    {/* Using Next.js Image component for the PNG vectors */}
                    <div className="relative w-8 h-8">
                      <Image
                        src={category.imagePath}
                        alt={category.title}
                        fill
                        sizes="32px"
                        style={{
                          objectFit: "contain",
                          filter:
                            hoveredBox === category.id
                              ? "brightness(0) invert(1)"
                              : "none",
                        }}
                      />
                    </div>
                  </div>

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

                  <motion.div
                    className="mt-4 inline-flex items-center bg-white/10 backdrop-blur-sm p-3 rounded-xl text-sm font-medium text-white"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hoveredBox === category.id ? 1 : 0,
                      y: hoveredBox === category.id ? 0 : 10,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      className="mr-2 w-4 h-4 transform "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </svg>
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
