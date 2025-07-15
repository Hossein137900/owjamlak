"use client";

import React, { useEffect, useState } from "react";
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
  href?: string;
  adminSection?: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    icon: <FiHome size={22} />,
    activeIcon: <FiHome size={22} fill="currentColor" />,
    label: "خانه",
    adminSection: "dashboard",
  },
  {
    icon: <FiSearch size={22} />,
    activeIcon: <FiSearch size={22} fill="currentColor" />,
    label: "جستجو",
    adminSection: "properties",
  },
  {
    icon: <FiPlusCircle size={26} />,
    activeIcon: <FiPlusCircle size={26} fill="currentColor" />,
    label: "افزودن ملک",
    adminSection: "Addposter",
  },
  {
    icon: <FiMessageCircle size={22} />,
    activeIcon: <FiMessageCircle size={22} fill="currentColor" />,
    label: "پیام‌ها",
    adminSection: "real-estate-requests",
  },
  {
    icon: <FiUser size={22} />,
    activeIcon: <FiUser size={22} fill="currentColor" />,
    label: "پروفایل",
    adminSection: "users",
  },
];

const FooterMobile = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [currentAdminSection, setCurrentAdminSection] = useState<string | null>(
    null
  );

  // Ensure we're on the client side and track admin section changes
  useEffect(() => {
    setIsClient(true);

    // If we're on admin page, get the current active section
    if (pathname === "/admin") {
      const activeSection = sessionStorage.getItem("activeAdminSection");
      setCurrentAdminSection(activeSection);    

      // Check for changes periodically (since sessionStorage doesn't fire storage event in same tab)
      const interval = setInterval(() => {
        const activeSection = sessionStorage.getItem("activeAdminSection");
        if (activeSection !== currentAdminSection) {
          setCurrentAdminSection(activeSection);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [pathname, currentAdminSection]);

  const handleNavigation = (item: MenuItem) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.adminSection && isClient) {
      // Store the selected admin section in sessionStorage
      sessionStorage.setItem("activeAdminSection", item.adminSection);
      setCurrentAdminSection(item.adminSection);

      // If we're already on admin page, we need to trigger a re-render or state change
      if (pathname === "/admin") {
        // Dispatch a custom event to notify admin layout of section change
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
    if (item.href) {
      if (item.href === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(item.href);
    } else if (item.adminSection && isClient) {
      // Check if we're on admin page and this section is active
      if (pathname === "/admin") {
        return currentAdminSection === item.adminSection;
      }
    }
    return false;
  };

  // Don't render until we're on the client side to avoid hydration issues
  if (!isClient) {
    return (
      <>
        <div className="h-[20px]" />
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/80 shadow-lg z-50">
          <nav className="max-w-full mx-auto" dir="rtl">
            <div className="flex justify-around items-center px-2 py-2">
              {/* Render placeholder buttons during SSR */}
              {menuItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 text-gray-600"
                >
                  <div className="flex items-center justify-center mb-1 w-6 h-6">
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium leading-tight text-center max-w-full truncate">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </nav>
          <div className="h-safe-area-inset-bottom bg-white/95" />
        </footer>
      </>
    );
  }

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed footer */}
      <div className="h-[20px]" />

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/80 shadow-lg z-50">
        <nav className="max-w-full mx-auto" dir="rtl">
          <div className="flex justify-around items-center px-2 py-2">
            {menuItems.map((item, idx) => {
              const active = isActive(item);
              const isMainAction = idx === 2; // "افزودن ملک" button

              return (
                <button
                  key={idx}
                  onClick={() => handleNavigation(item)}
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
                  aria-label={item.label}
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
                    {active ? item.activeIcon : item.icon}
                  </div>

                  {/* Label */}
                  <span
                    className={`
                    text-xs font-medium leading-tight text-center max-w-full truncate
                    ${active ? "font-semibold" : ""}
                    ${isMainAction ? "text-[10px]" : ""}
                  `}
                  >
                    {item.label}
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
