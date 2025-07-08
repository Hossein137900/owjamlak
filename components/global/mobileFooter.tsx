"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FiHome,
  FiSearch,
  FiPlusCircle,
  FiMessageCircle,
  FiUser,
} from "react-icons/fi";

interface MenuItem {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    icon: <FiHome size={22} />,
    activeIcon: <FiHome size={22} fill="currentColor" />,
    label: "خانه",
    href: "/",
  },
  {
    icon: <FiSearch size={22} />,
    activeIcon: <FiSearch size={22} fill="currentColor" />,
    label: "جستجو",
    href: "/search",
  },
  {
    icon: <FiPlusCircle size={26} />,
    activeIcon: <FiPlusCircle size={26} fill="currentColor" />,
    label: "افزودن ملک",
    href: "/add-property",
  },
  {
    icon: <FiMessageCircle size={22} />,
    activeIcon: <FiMessageCircle size={22} fill="currentColor" />,
    label: "پیام‌ها",
    href: "/messages",
  },
  {
    icon: <FiUser size={22} />,
    activeIcon: <FiUser size={22} fill="currentColor" />,
    label: "پروفایل",
    href: "/profile",
  },
];

const FooterMobile = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed footer */}
      <div className="h-[20px]" />

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/80 shadow-lg z-50">
        <nav className="max-w-full mx-auto" dir="rtl">
          <div className="flex justify-around items-center px-2 py-2">
            {menuItems.map(({ icon, activeIcon, label, href, badge }, idx) => {
              const active = isActive(href);
              const isMainAction = idx === 2; // "افزودن ملک" button

              return (
                <button
                  key={idx}
                  onClick={() => handleNavigation(href)}
                  className={`
                    relative flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1
                    transition-all duration-300 ease-in-out
                    ${
                      active
                        ? "text-[#01ae9b] scale-105"
                        : "text-gray-600 hover:text-[#01ae9b] active:scale-95"
                    }
                    ${
                      isMainAction
                        ? "transform hover:scale-110 active:scale-100"
                        : ""
                    }
                  `}
                  aria-label={label}
                  role="tab"
                  aria-selected={active}
                >
                  {/* Icon with special styling for main action */}
                  <div
                    className={`
                    flex items-center justify-center mb-1
                    ${
                      isMainAction
                        ? `w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
                            active
                              ? "bg-blue-600 text-white shadow-blue-200"
                              : "bg-[#01ae9b] text-white hover:from-green-600 hover:to-green-700"
                          }`
                        : "w-6 h-6"
                    }
                  `}
                  >
                    {active ? activeIcon : icon}
                  </div>

                  {/* Label */}
                  <span
                    className={`
                    text-xs font-medium leading-tight text-center max-w-full truncate
                    ${active ? "font-semibold" : ""}
                    ${isMainAction ? "text-[10px]" : ""}
                  `}
                  >
                    {label}
                  </span>

                  {/* Active indicator */}
                  {active && !isMainAction && (
                    <div className="absolute -bottom-0.5 w-1 h-1 bg-[#01ae9b] rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-white/95" />
      </footer>
    </>
  );
};

export default FooterMobile;
