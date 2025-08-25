"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiBriefcase,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiMail,
  FiLayers,
  FiMessageSquare,
  FiVideo,
} from "react-icons/fi";

interface SidebarItem {
  id?: string;
  title?: string;
  section: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
}

interface SidebarProps {
  onSectionChange?: (section: string) => void;
  activeSection?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSectionChange,
  activeSection,
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    {
      id: "dashboard",
      title: "داشبورد",
      icon: <FiHome className="w-5 h-5" />,
      href: "/admin",
      section: "overview",
    },
    {
      id: "content",
      title: "مدیریت محتوا",
      icon: <FiFileText className="w-5 h-5" />,
      children: [
        {
          id: "properties",
          title: "آگهی‌های ملک",
          icon: <FiLayers className="w-4 h-4" />,
          section: "properties",
        },
        {
          id: "blog",
          title: "وبلاگ",
          icon: <FiFileText className="w-4 h-4" />,
          section: "blog",
        },
        {
          id: "pages",
          title: "صفحات",
          icon: <FiFileText className="w-4 h-4" />,
          section: "pages",
        },
        {
          id: "videos",
          title: "ویدیوها",
          icon: <FiVideo className="w-4 h-4" />,
          section: "videos",
        },
      ],
    },
    {
      id: "users",
      title: "مدیریت کاربران",
      icon: <FiUsers className="w-5 h-5" />,
      section: "users",
    },
    {
      id: "requests",
      title: "درخواست‌ها",
      icon: <FiBriefcase className="w-5 h-5" />,
      children: [
        {
          id: "property-requests",
          title: "مشاوره املاک",
          icon: <FiFileText className="w-4 h-4" />,
          section: "property-requests",
        },
        {
          id: "legal-requests",
          title: "مشاوره حقوقی",
          icon: <FiFileText className="w-4 h-4" />,
          section: "legal-requests",
        },
        {
          id: "cooperation",
          title: "همکاری",
          icon: <FiBriefcase className="w-4 h-4" />,
          section: "cooperation",
        },
      ],
    },
    {
      id: "marketing",
      title: "بازاریابی",
      icon: <FiMail className="w-5 h-5" />,
      children: [
        {
          id: "newsletter",
          title: "مدیریت خبرنامه",
          icon: <FiMail className="w-4 h-4" />,
          section: "newsletter",
        },
      ],
    },
    {
      id: "communication",
      title: "ارتباطات",
      icon: <FiMessageSquare className="w-5 h-5" />,
      children: [
        {
          id: "comments",
          title: "نظرات",
          icon: <FiMessageSquare className="w-4 h-4" />,
          section: "comments",
        },
        {
          id: "messages",
          title: "پیام‌ها",
          icon: <FiMail className="w-4 h-4" />,
          section: "messages",
        },
      ],
    },
    {
      id: "settings",
      title: "تنظیمات",
      icon: <FiSettings className="w-5 h-5" />,
      section: "settings",
    },
  ];

  const handleSectionChange = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  const isActive = (section: string) => {
    return activeSection === section;
  };

  const isParentActive = (children: SidebarItem[]) => {
    return children.some((child) => isActive(child.section));
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">پنل مدیریت</h2>
        <p className="text-sm text-gray-600 mt-1">املاک آملک</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.children ? (
                // Menu with children
                <div>
                  <motion.button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isParentActive(item.children)
                        ? "bg-[#66308d] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <motion.div
                      animate={{
                        rotate: expandedMenus.includes(item.id) ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedMenus.includes(item.id) && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 mr-4 space-y-1 overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <motion.li
                            key={child.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <button
                              onClick={() => handleSectionChange(child.section)}
                              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-sm ${
                                isActive(child.section)
                                  ? "bg-[#01ae9b] text-white"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              {child.icon}
                              <span>{child.title}</span>
                            </button>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Single menu item
                <motion.button
                  onClick={() => handleSectionChange(item.section!)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive(item.section!)
                      ? "bg-[#66308d] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </motion.button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#66308d] rounded-full flex items-center justify-center">
            <FiUsers className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">مدیر سیستم</p>
            <p className="text-xs text-gray-600">admin@amalak.com</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FiLogOut className="w-4 h-4" />
          <span className="text-sm font-medium">خروج</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;
