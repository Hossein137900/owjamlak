"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FiHome,
  FiPlusCircle,
  FiHeart,
  FiFileText,
  FiBriefcase,
  FiUsers,
  FiBook,
  FiMapPin,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  adminSection?: string;
}

const menuItems: MenuItem[] = [
  { icon: <FiFileText size={20} />, label: "آگهی‌ها", href: "/poster" },
  { icon: <FiHome size={20} />, label: "داشبورد", adminSection: "dashboard" },
  {
    icon: <FiPlusCircle size={22} />,
    label: "ثبت آگهی",
    adminSection: "Addposter",
  },
  {
    icon: <FiHeart size={20} />,
    label: "علاقه‌مندی",
    adminSection: "favorite",
  },
  { icon: <FiBriefcase size={20} />, label: "خدمات اوج", href: "/services" },
];

const serviceItems = [
  {
    icon: <FiMapPin size={22} />,
    label: "مشاوره املاک",
    href: "/services/realEstateConsultation",
  },
  {
    icon: <FiUsers size={22} />,
    label: "همکاری",
    href: "/services/Collaboration",
  },
  {
    icon: <FiBook size={22} />,
    label: "مشاوره حقوقی",
    href: "/services/legalConsultation",
  },
  { icon: <FiBriefcase size={22} />, label: "صفحه خدمات", href: "/services" },
];

const FooterMobile = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [currentAdminSection, setCurrentAdminSection] = useState<string | null>(
    null
  );
   const [showServicesMenu, setShowServicesMenu] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (pathname === "/admin") {
      const activeSection = sessionStorage.getItem("activeAdminSection");
      setCurrentAdminSection(activeSection);
    }
  }, [pathname]);

  const handleNavigation = (item: MenuItem) => {
    if (item.label === "خدمات اوج") {
      setShowServicesMenu((prev) => !prev);
      return;
    }
    if (item.href) router.push(item.href);
    else if (item.adminSection && isClient) {
      sessionStorage.setItem("activeAdminSection", item.adminSection);
      setCurrentAdminSection(item.adminSection);
      if (pathname !== "/admin") {
        router.push("/admin");
      } else {
        // Dispatch event to notify admin layout of section change
        window.dispatchEvent(
          new CustomEvent("adminSectionChange", {
            detail: { section: item.adminSection },
          })
        );
      }
    }
  };

  if (!isClient) return null;

  return (
    <>
      {/* بک‌دراپ بلور */}
      <AnimatePresence>
        {showServicesMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowServicesMenu(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md border-t border-gray-200 z-9999 shadow-md">
        <nav
          className="flex justify-between items-center px-2 py-1 relative"
          dir="rtl"
        >
          {menuItems.map((item, idx) => {
            const isServices = item.label === "خدمات اوج";
            const isActive =
              (isServices && showServicesMenu) ||
              (item.adminSection &&
                pathname === "/admin" &&
                currentAdminSection === item.adminSection) ||
              (item.href && pathname === item.href);

            return (
              <div
                key={idx}
                ref={isServices ? servicesRef : null}
                className="flex-1 flex flex-col items-center relative"
              >
                <motion.button
                  onClick={() => handleNavigation(item)}
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center text-xs cursor-pointer py-1 px-3 rounded-xl transition-all duration-200 relative ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {/* Active Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0   bg-[#01ae9b]   rounded-xl shadow-lg"
                      initial={false}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  {/* Icon Container */}
                  <motion.div
                    className="w-6 h-6 flex items-center justify-center relative z-10"
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Label */}
                  <span className="relative z-10 mt-1 font-medium">
                    {item.label}
                  </span>
                </motion.button>

                {/* کرکره خدمات */}
                {isServices && (
                  <AnimatePresence>
                    {showServicesMenu && (
                      <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        className="absolute bottom-full mb-2 flex flex-col items-center gap-3 bg-white/70 backdrop-blur-lg shadow-lg rounded-xl p-3 z-50"
                      >
                        {serviceItems.map((service, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => {
                              router.push(service.href);
                              setShowServicesMenu(false);
                            }}
                            className="flex flex-col cursor-pointer items-center gap-1 text-[#66308d] hover:text-gray-500 transition"
                          >
                            {service.icon}
                            <span className="text-[10px]">{service.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>
      </footer>
    </>
  );
};

export default FooterMobile;
