"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaChevronLeft } from "react-icons/fa";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  showHome?: boolean;
  separator?: "chevron" | "slash" | "dot";
  variant?: "default" | "minimal" | "pills";
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  showHome = true,
  separator = "chevron",
  variant = "default",
  className = "",
}) => {
  const pathname = usePathname();

  // Don't render breadcrumb on poster detail pages
  if (pathname.startsWith('/poster/') && pathname !== '/poster') {
    return null;
  }

  // Route name mapping for Persian labels
  const routeLabels: Record<string, string> = {
    "": "خانه",
    services: "خدمات",
    "buy-sell": "خرید و فروش",
    rent: "اجاره و رهن",
    investment: "مشاوره سرمایه‌گذاری",
    construction: "ساخت و ساز",
    legal: "خدمات حقوقی",
    valuation: "ارزیابی و کارشناسی",
    aboutUs: "درباره ما",
    contactUs: "تماس با ما",
    blogs: "وبلاگ",
    properties: "املاک",
    dashboard: "داشبورد",
    profile: "پروفایل",
    settings: "تنظیمات",
    admin: "مدیریت",
    users: "کاربران",
    reports: "گزارشات",
    categories: "دسته‌بندی‌ها",
    tags: "برچسب‌ها",
    gallery: "گالری",
    news: "اخبار",
    faq: "سوالات متداول",
    privacy: "حریم خصوصی",
    terms: "شرایط استفاده",
    realEstateConsultation: "مشاوره املاک",
    Collaboration: "همکاری با ما",
    legalConsultation: "مشاوره حقوقی املاک",
    poster:"آگهی",
    auth:"صفحه ورود",
    offers:"سرمایه گذاری"
  };

  // Generate breadcrumb items from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {

    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home if requested
    if (showHome) {
      breadcrumbs.push({
        label: "",
        href: "/",
        icon: FaHome,
      });
    }

    // Generate breadcrumbs from path segments
    pathSegments.forEach((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const label = routeLabels[segment] || segment.replace(/-/g, " ");

      breadcrumbs.push({
        label,
        href,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render if only home or empty
  if (breadcrumbs.length <= 1 && pathname === "/") return null;

  // Separator components
  const separators = {
    chevron: <FaChevronLeft className="w-3 h-3 text-gray-400 mx-1 sm:mx-2" />,
    slash: <span className="text-gray-400 mx-1 sm:mx-2">/</span>,
    dot: <span className="text-gray-400 mx-1 sm:mx-2">•</span>,
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  // Variant styles
  const variantStyles = {
    default: "rounded-lg px-4 py-3",
    minimal: "border-b border-gray-200 pb-3",
    pills: "bg-white/90 backdrop-blur-sm shadow-sm rounded-full px-6 py-3",
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${variantStyles[variant]} ${className} relative`}
      dir="rtl"
    >
      <nav aria-label="Breadcrumb" className="w-full absolute top-20 sm:right-32">
        <ol className="flex items-center flex-wrap gap-1 text-sm">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const IconComponent = item.icon;

            return (
              <motion.li
                key={item.href}
                variants={itemVariants}
                className="flex items-center"
              >
                {/* Breadcrumb Item */}
                {isLast ? (
                  // Current page (non-clickable)
                  <motion.span
                    className="flex items-center font-medium text-gray-600 cursor-default"
                    whileHover={{ scale: 1.02 }}
                  >
                    {IconComponent && (
                      <IconComponent className="w-4 h-4 ml-2 text-gray-500" />
                    )}
                    <span className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                      {item.label}
                    </span>
                  </motion.span>
                ) : (
                  // Clickable breadcrumb
                  <Link href={item.href} className="group">
                    <motion.span
                      className="flex items-center font-medium text-gray-700 hover:text-[#66308d] transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {IconComponent && (
                        <IconComponent className="w-4 h-4 ml-2 group-hover:text-[#66308d] transition-colors" />
                      )}
                      <span className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-none group-hover:underline underline-offset-2">
                        {item.label}
                      </span>
                    </motion.span>
                  </Link>
                )}

                {/* Separator */}
                {!isLast && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="flex-shrink-0"
                  >
                    {separators[separator]}
                  </motion.div>
                )}
              </motion.li>
            );
          })}
        </ol>

    
      </nav>
    </motion.div>
  );
};

export default Breadcrumb;
