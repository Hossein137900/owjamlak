"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FiHome,
  FiSearch,
  FiPlusCircle,
  FiHeart,
  FiSettings,
} from "react-icons/fi";

interface MenuItem {
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  href?: string;
  adminSection?: string;
}

const menuItems: MenuItem[] = [
  { icon: <FiHome size={20} />, label: "خانه", adminSection: "dashboard" },
  { icon: <FiSearch size={20} />, label: "آگهی‌ها", href: "/poster" },

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
  { icon: <FiSettings size={20} />, label: "خدمات", href: "/services" },
];

const FooterMobile = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [currentAdminSection, setCurrentAdminSection] = useState<string | null>(
    null
  );

  useEffect(() => {
    setIsClient(true);
    if (pathname === "/admin") {
      const activeSection = sessionStorage.getItem("activeAdminSection");
      setCurrentAdminSection(activeSection);
      const interval = setInterval(() => {
        const newSection = sessionStorage.getItem("activeAdminSection");
        if (newSection !== currentAdminSection) {
          setCurrentAdminSection(newSection);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [pathname, currentAdminSection]);

  const handleNavigation = (item: MenuItem) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.adminSection && isClient) {
      sessionStorage.setItem("activeAdminSection", item.adminSection);
      setCurrentAdminSection(item.adminSection);
      if (pathname === "/admin") {
        window.dispatchEvent(
          new CustomEvent("adminSectionChange", {
            detail: { section: item.adminSection },
          })
        );
      } else {
        router.push("/admin");
      }
    }
  };

  const isActive = (item: MenuItem) => {
    if (item.href) return pathname.startsWith(item.href);
    if (item.adminSection && pathname === "/admin") {
      return currentAdminSection === item.adminSection;
    }
    return false;
  };

  if (!isClient) return null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t border-gray-200 z-50 shadow-md ">
      <nav className="flex justify-between items-center px-2 py-1" dir="rtl">
        {menuItems.map((item, idx) => {
          const active = isActive(item);
          return (
            <button
              key={idx}
              onClick={() => handleNavigation(item)}
              className={`flex flex-col cursor-pointer items-center justify-center text-xs flex-1 py-1 ${
                active ? "text-[#66308d] font-bold" : "text-gray-500"
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {item.icon}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default FooterMobile;
