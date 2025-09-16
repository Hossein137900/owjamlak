"use client";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiX,
  FiBriefcase,
  FiMessageSquare,
  FiLayers,
  FiMail,
  FiVideo,
  FiBook,
  FiHeart,
  FiPlus,
  FiUserCheck,
  FiStar,
  FiPhone,
  FiEdit,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminAuth } from "../../../contexts/AdminAuthContext";
import Dashboard from "./dashboard";
import LegalRequests from "./legalConsultationRequests/legalRequests";
import UsersManagement from "./users/usersManagement";
import EmployRequests from "./employRequest/employRequests";
import RealStateRequests from "./realEstateConsultation/realStateRequests";
import NewsletterManagement from "./newsletter/newsletterManagement";
import VideoManagement from "./video/videoManagement";
import PosterForm from "./posters/posterForm";
import CreateConsultantForm from "./consultant-champion/addTopConsultant";
import BlogManagement from "./blogs/blogManagement";
import ConsultantManager from "./consultant/consultantManager";
import PropertyListings from "./posters/propertyListings";
import AdminFavoritesPage from "./favorites/page";
import MessagesPage from "./contactForm/messagesPage";
import PosterById from "./posters/posterById";
import ChatAdminList from "./chat/adminChatList";
import Link from "next/link";

const AdminLayout = () => {
  const { hasAccess, logout } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const storedSection = sessionStorage.getItem("activeAdminSection");
    if (storedSection) {
      setActiveSection(storedSection);
    }

    const handleAdminSectionChange = (event: CustomEvent) => {
      setActiveSection(event.detail.section);
    };

    window.addEventListener(
      "adminSectionChange",
      handleAdminSectionChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "adminSectionChange",
        handleAdminSectionChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (activeSection) {
      sessionStorage.setItem("activeAdminSection", activeSection);
    }
  }, [activeSection]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialHash = window.location.hash.slice(1);
      if (initialHash && allMenuItems.some((item) => item.id === initialHash)) {
        setActiveSection(initialHash);
      }

      const handlePopState = () => {
        const hash = window.location.hash.slice(1);
        if (hash && allMenuItems.some((item) => item.id === hash)) {
          setActiveSection(hash);
        } else {
          setActiveSection("dashboard");
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && activeSection) {
      const currentHash = window.location.hash.slice(1);
      if (currentHash !== activeSection) {
        window.history.pushState(null, "", `#${activeSection}`);
      }
    }
  }, [activeSection]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);

      const handleResize = () => {
        if (window.innerWidth < 1024) {
          setIsSidebarOpen(false);
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const allMenuItems = [
    {
      id: "dashboard",
      icon: <FiHome />,
      label: "داشبورد",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "chat",
      icon: <FiMessageSquare />,
      label: "چت آنلاین",
      roles: ["admin", "superadmin"],
    },
    {
      id: "properties",
      icon: <FiLayers />,
      label: "آگهی های ملک",
      roles: ["admin", "superadmin"],
    },
    {
      id: "Myproperties",
      icon: <FiEdit />,
      label: "آگهی های من",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "Addposter",
      icon: <FiPlus />,
      label: "ساخت آگهی",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "real-estate-requests",
      icon: <FiHome />,
      label: "درخواستهای مشاوره املاک",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "legal-requests",
      icon: <FiFileText />,
      label: "درخواستهای مشاوره حقوقی",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "employment-requests",
      icon: <FiBriefcase />,
      label: "درخواستهای همکاری",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "favorite",
      icon: <FiHeart />,
      label: "علاقه مندی ها",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "contact",
      icon: <FiPhone />,
      label: "پیام های ارتباط",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "blogs",
      icon: <FiBook />,
      label: "وبلاگ",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "newsletter",
      icon: <FiMail />,
      label: "خبرنامه",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "ConsultantChampion",
      icon: <FiStar />,
      label: "مشاور برتر",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "Consultant",
      icon: <FiUserCheck />,
      label: "مشاورین",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    { id: "users", icon: <FiUsers />, label: "کاربران", roles: ["superadmin"] },
    {
      id: "video",
      icon: <FiVideo />,
      label: "ویدیو ها",
      roles: ["admin", "superadmin"],
    },
  ];

  const menuItems = allMenuItems.filter((item) => hasAccess(item.roles));

  const handleMenuClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const renderActiveComponent = () => {
    const currentItem = allMenuItems.find((item) => item.id === activeSection);
    if (currentItem && !hasAccess(currentItem.roles)) {
      return (
        <div className="p-8 text-center text-red-500">
          شما دسترسی به این بخش را ندارید
        </div>
      );
    }

    switch (activeSection) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveSection} />;
      case "properties":
        return hasAccess(["admin", "superadmin", "user", "consultant"]) ? (
          <PropertyListings />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "real-estate-requests":
        return hasAccess(["admin", "superadmin", "user", "consultant"]) ? (
          <RealStateRequests />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "legal-requests":
        return hasAccess(["admin", "superadmin", "user", "consultant"]) ? (
          <LegalRequests />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "employment-requests":
        return hasAccess(["admin", "superadmin", "user", "consultant"]) ? (
          <EmployRequests />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "users":
        return hasAccess(["admin", "superadmin", "user", "consultant"]) ? (
          <UsersManagement />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "chat":
        return hasAccess(["admin", "superadmin", "user", "consultant"]) ? (
          <ChatAdminList />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "newsletter":
        return hasAccess(["admin", "superadmin", "user", "consultant"]) ? (
          <NewsletterManagement />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "Myproperties":
        return <PosterById />;
      case "Consultant":
        return hasAccess(["admin", "superadmin", "user", "consultant"]) ? (
          <ConsultantManager />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "favorite":
        return <AdminFavoritesPage />;
      case "contact":
        return hasAccess(["admin", "superadmin", "user", "consultant"]) ? (
          <MessagesPage />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "video":
        return hasAccess(["admin", "superadmin", "user", "consultant"]) ? (
          <VideoManagement />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "Addposter":
        return <PosterForm />;
      case "ConsultantChampion":
        return hasAccess(["admin", "superadmin", "user", "consultant"]) ? (
          <CreateConsultantForm />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "blogs":
        return hasAccess(["admin", "superadmin", "user", "consultant"]) ? (
          <BlogManagement />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      default:
        return <Dashboard />;
    }
  };

  const sidebarVariants = {
    open: {
      width: "240px",
      transition: { duration: 0.25, ease: "easeInOut" },
    },
    closed: {
      width: "64px",
      transition: { duration: 0.25, ease: "easeInOut" },
    },
  };

  const labelVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    closed: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  const tooltipVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };

  const textClass = isDarkMode ? "text-gray-200" : "text-gray-600";
  const borderClass = isDarkMode ? "border-gray-700/50" : "border-gray-200/70";
  const headerBgClass = isDarkMode
    ? "bg-gray-900/60 backdrop-blur-xl"
    : "bg-white/60 backdrop-blur-xl";
  const sidebarBgClass = isDarkMode
    ? "bg-gray-900/95 backdrop-blur-md"
    : "bg-white/95 backdrop-blur-md";
  const mainBgClass = isDarkMode ? "bg-gray-950" : "bg-gray-50";
  const hoverBgClass = isDarkMode
    ? "hover:bg-gray-800/50"
    : "hover:bg-gray-100/50";
  const activeBgClass = isDarkMode ? "bg-blue-600/10" : "bg-blue-50/80";
  const activeTextClass = isDarkMode ? "text-blue-300" : "text-blue-500";
  const iconActiveClass = isDarkMode ? "text-blue-300" : "text-blue-500";
  const iconInactiveClass = isDarkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div
      className={`min-h-screen relative ${mainBgClass} flex flex-col transition-colors duration-300`}
    >
      <header
        className={`${headerBgClass} fixed top-0 w-full shadow-sm z-20 transition-colors duration-300`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden inline-flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileSidebarOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiX className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiMenu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={toggleSidebar}
                className="hidden md:inline-flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle sidebar"
              >
                <motion.div
                  animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiMenu className="h-5 w-5" />
                </motion.div>
              </button>

              <div className="flex-shrink-0 flex items-center mr-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1
                    className={`text-lg font-semibold ${textClass} transition-colors duration-300`}
                  >
                    پنل مدیریت املاک
                  </h1>
                  <div className={`text-xs ${textClass} opacity-50`}>
                    {new Date().toLocaleDateString("fa-IR")}
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <button
                className={`p-1.5 rounded-md ${hoverBgClass} transition-colors duration-200`}
                aria-label="Navigate to home"
              >
                <Link href="/">
                  <FiHome className={`w-4 h-4 ${textClass}`} />
                </Link>
              </button>
              <button
                onClick={toggleDarkMode}
                className={`p-1.5 rounded-md ${hoverBgClass} transition-colors duration-200`}
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ rotate: isDarkMode ? 40 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={isDarkMode ? "text-yellow-300" : "text-gray-500"}
                >
                  {isDarkMode ? (
                    <>
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </>
                  ) : (
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  )}
                </motion.svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-x-hidden">
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 z-50 md:hidden"
                onClick={toggleMobileSidebar}
              />
              <motion.div
                variants={{
                  closed: { x: "100%", opacity: 0 },
                  open: { x: 0, opacity: 1 },
                }}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`fixed inset-y-0 right-0 flex flex-col w-64 ${sidebarBgClass} shadow-lg z-50 md:hidden rounded-l-lg`}
              >
                <div className="flex flex-row-reverse items-center justify-between h-14 px-3 border-b ${borderClass}">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMobileSidebar}
                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiX className="h-5 w-5" />
                  </motion.button>
                  <span className="text-sm font-semibold ${textClass}">
                    املاک اوج
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto pt-4 pb-3 px-2">
                  <nav className="space-y-1.5">
                    {menuItems.map((item) => (
                      <motion.button
                        key={item.id}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                          activeSection === item.id
                            ? `${activeBgClass} ${activeTextClass}`
                            : `${textClass} ${hoverBgClass}`
                        }`}
                        onClick={() => {
                          handleMenuClick(item.id);
                          setIsMobileSidebarOpen(false);
                        }}
                      >
                        <span
                          className={`ml-2 text-base ${
                            activeSection === item.id
                              ? iconActiveClass
                              : iconInactiveClass
                          } group-hover:${iconActiveClass}`}
                        >
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                        {activeSection === item.id && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute right-0 w-1 h-6 bg-blue-500 rounded-l"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </nav>
                  <div className="flex-shrink-0 flex mt-3 border-t pt-3 px-2 ${borderClass}">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={logout}
                      className="flex items-center w-full px-3 py-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-150"
                    >
                      <FiLogOut className="h-5 w-5" />
                      <span className="mr-2 text-sm font-medium">خروج</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <motion.div
          variants={sidebarVariants}
          initial={false}
          animate={isSidebarOpen ? "open" : "closed"}
          className={`hidden md:flex md:flex-col ${sidebarBgClass} border-l ${borderClass} transition-all duration-300 shadow-md`}
        >
          <div className="flex-1 flex flex-col pt-4 pb-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <nav className="flex-1 px-2 mt-10 space-y-1">
              {menuItems.map((item) => (
                <div key={item.id} className="relative group">
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                      activeSection === item.id
                        ? `${activeBgClass} ${activeTextClass}`
                        : `${textClass} ${hoverBgClass}`
                    }`}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <motion.div
                      className={`flex items-center justify-center w-8 h-8 rounded-md ${
                        activeSection === item.id
                          ? "bg-blue-100/30 dark:bg-blue-900/20"
                          : "group-hover:bg-blue-100/20 dark:group-hover:bg-blue-900/10"
                      }`}
                    >
                      <span
                        className={`text-base ${
                          activeSection === item.id
                            ? iconActiveClass
                            : iconInactiveClass
                        } group-hover:${iconActiveClass}`}
                      >
                        {item.icon}
                      </span>
                    </motion.div>

                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          variants={labelVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="mr-2 font-medium text-sm"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {activeSection === item.id && isSidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-2 w-1.5 h-1.5 bg-blue-500 rounded-full"
                      />
                    )}
                  </motion.button>

                  {!isSidebarOpen && (
                    <motion.div
                      variants={tooltipVariants}
                      initial="hidden"
                      whileHover="visible"
                      className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 z-30 pointer-events-none"
                    >
                      <div
                        className={`px-2.5 py-1 text-sm font-medium rounded-md shadow-md border ${
                          isDarkMode
                            ? "bg-gray-800/90 text-gray-200 border-gray-700/40"
                            : "bg-white/90 text-gray-600 border-gray-200/40"
                        } whitespace-nowrap`}
                      >
                        {item.label}
                        <div
                          className={`absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-1.5 h-1.5 border-r border-b ${
                            isDarkMode
                              ? "bg-gray-800/90 border-gray-700/40"
                              : "bg-white/90 border-gray-200/40"
                          }`}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 border-t ${borderClass} p-2">
            <div className="relative group">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className={`flex items-center w-full px-3 py-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-150`}
              >
                <motion.div className="flex items-center justify-center w-8 h-8 rounded-md group-hover:bg-red-100/20 dark:group-hover:bg-red-900/10">
                  <FiLogOut className="h-5 w-5" />
                </motion.div>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      variants={labelVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="mr-2 text-sm font-medium"
                    >
                      خروج
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              {!isSidebarOpen && (
                <motion.div
                  variants={tooltipVariants}
                  initial="hidden"
                  whileHover="visible"
                  className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 z-30 pointer-events-none"
                >
                  <div className="px-2.5 py-1 text-sm font-medium rounded-md shadow-md bg-red-500/90 text-white border-red-400/40">
                    خروج
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-1.5 h-1.5 bg-red-500 border-r border-b border-red-400/40" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <main
          className={`flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 mt-14 md:mt-14 lg:p-6 ${mainBgClass} transition-colors duration-300`}
        >
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            {renderActiveComponent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
