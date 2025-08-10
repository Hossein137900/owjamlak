import React from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiFileText,
  FiBriefcase,
  FiLayers,
  FiMail,
  FiLoader,
} from "react-icons/fi";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const Dashboard: React.FC = () => {
  const { stats, isLoading, error, refetch } = useDashboardStats();

  // Loading state
  if (isLoading) {
    return (
      <div className="h-64 bg-transparent flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری ...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">خطا در بارگذاری داده‌ها: {error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  // Dashboard stats with real data from API
  const dashboardStats = [
    {
      id: 1,
      name: "آگهی‌های ملک",
      value: stats?.propertyListings?.toString() || "0",
      icon: <FiLayers className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "درخواست‌های مشاوره املاک",
      value: stats?.realEstateRequests?.toString() || "0",
      icon: <FiFileText className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "درخواست‌های مشاوره حقوقی",
      value: stats?.legalRequests?.toString() || "0",
      icon: <FiFileText className="h-6 w-6" />,
      color: "bg-purple-500",
    },
    {
      id: 4,
      name: "درخواست‌های همکاری",
      value: stats?.employmentRequests?.toString() || "0",
      icon: <FiBriefcase className="h-6 w-6" />,
      color: "bg-yellow-500",
    },
    {
      id: 5,
      name: "کاربران",
      value: stats?.users?.toString() || "0",
      icon: <FiUsers className="h-6 w-6" />,
      color: "bg-red-500",
    },
    {
      id: 6,
      name: "مشترکین خبرنامه",
      value: stats?.newsletterSubscribers?.toString() || "0",
      icon: <FiMail className="h-6 w-6" />,
      color: "bg-indigo-500",
      section: "newsletter",
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-400">داشبورد</h1>
          <p className="text-gray-500 mt-1">خلاصه وضعیت سیستم</p>
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          به‌روزرسانی
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardStats.map((stat) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: stat.id * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="mr-5">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {parseInt(stat.value).toLocaleString("fa-IR")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional info section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          آخرین به‌روزرسانی: {new Date().toLocaleDateString("fa-IR")}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
