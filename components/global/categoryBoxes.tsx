"use client";
import { useState } from "react";
import Link from "next/link";
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

  return (
    <>
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            transform: translateY(-30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(60px) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes arrowSlide {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-3px);
          }
        }

        .header-animate {
          animation: fadeInDown 0.8s ease-out forwards;
        }

        .category-item {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .category-item:nth-child(1) {
          animation-delay: 0.1s;
        }
        .category-item:nth-child(2) {
          animation-delay: 0.25s;
        }
        .category-item:nth-child(3) {
          animation-delay: 0.4s;
        }
        .category-item:nth-child(4) {
          animation-delay: 0.55s;
        }
        .category-item:nth-child(5) {
          animation-delay: 0.7s;
        }
        .category-item:nth-child(6) {
          animation-delay: 0.85s;
        }

        .category-card {
          transition: all 0.3s ease-out;
        }

        .category-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .category-card:active {
          transform: scale(0.98);
          transition-duration: 0.1s;
        }

        .decorative-circle {
          transition: all 0.5s ease-in-out;
        }

        .category-card:hover .decorative-circle {
          transform: scale(1.8) rotate(45deg);
        }

        .icon-container {
          transition: all 0.3s ease;
        }

        .category-card:hover .icon-container {
          transform: rotate(360deg);
        }

        .icon-inner {
          transition: color 0.3s ease;
        }

        .view-more-button {
          opacity: 0;
          transform: translateY(10px) scale(0.8);
          transition: all 0.3s ease-out;
        }

        .category-card:hover .view-more-button {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .arrow-icon {
          animation: arrowSlide 0.6s ease-in-out infinite;
        }

        .category-card:not(:hover) .arrow-icon {
          animation: none;
        }
      `}</style>

      <div className="py-12 px-4 md:px-20 container mx-auto">
        {/* Animated Header */}
        <div className="header-animate text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
            خدمات املاک <span style={{ color: primaryColor }}>اوج</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ما در املاک اوج، خدمات متنوعی در زمینه املاک ارائه می‌دهیم تا شما
            بتوانید با خیال راحت معاملات ملکی خود را انجام دهید
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const isEven = index % 2 === 0;
            const color = isEven ? primaryColor : secondaryColor;
            const hoverColor = isEven ? primaryHoverColor : secondaryHoverColor;
            const isHovered = hoveredBox === category.id;

            return (
              <div
                key={category.id}
                className="category-item relative overflow-hidden rounded-2xl shadow-lg group"
                onMouseEnter={() => setHoveredBox(category.id)}
                onMouseLeave={() => setHoveredBox(null)}
              >
                <Link href={category.link}>
                  <div
                    className="category-card p-6 h-full flex flex-col items-center text-center relative z-10"
                    style={{
                      backgroundColor: isHovered ? hoverColor : "white",
                      color: isHovered ? "white" : "#1A1A1A",
                      transition: "background-color 0.3s ease, color 0.3s ease",
                    }}
                  >
                    {/* Decorative circle */}
                    <div
                      className="decorative-circle absolute top-0 right-0 w-32 h-32 rounded-full -mt-10 -mr-10 opacity-10"
                      style={{
                        backgroundColor: color,
                      }}
                    />

                    {/* Icon container */}
                    <div
                      className="icon-container w-16 h-16 rounded-full flex items-center justify-center mb-4 relative"
                      style={{
                        backgroundColor: isHovered
                          ? "rgba(255, 255, 255, 0.2)"
                          : `${color}15`,
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      <div
                        className="icon-inner"
                        style={{
                          color: isHovered ? "white" : color,
                        }}
                      >
                        {category.icon}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>

                    <p
                      className="text-sm"
                      style={{
                        color: isHovered
                          ? "rgba(255, 255, 255, 0.9)"
                          : "#4B5563",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {category.description}
                    </p>

                    {/* "مشاهده بیشتر" button */}
                    <div className="view-more-button mt-4 inline-flex items-center bg-white/10 backdrop-blur-sm p-3 rounded-xl text-sm font-medium text-white">
                      <svg
                        className="arrow-icon mr-2 w-4 h-4"
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
                        />
                      </svg>
                      مشاهده بیشتر
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
