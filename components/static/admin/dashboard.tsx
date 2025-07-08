import React from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiFileText,
  FiBriefcase,
  FiLayers,
  FiMail,
} from "react-icons/fi";

const Dashboard: React.FC = () => {
  // Mock data for dashboard stats
  const stats = [
    {
      id: 1,
      name: "آگهی‌های ملک",
      value: "124",
      icon: <FiLayers className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "درخواست‌های مشاوره املاک",
      value: "38",
      icon: <FiFileText className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "درخواست‌های مشاوره حقوقی",
      value: "27",
      icon: <FiFileText className="h-6 w-6" />,
      color: "bg-purple-500",
    },
    {
      id: 4,
      name: "درخواست‌های همکاری",
      value: "15",
      icon: <FiBriefcase className="h-6 w-6" />,
      color: "bg-yellow-500",
    },
    {
      id: 5,
      name: "کاربران",
      value: "256",
      icon: <FiUsers className="h-6 w-6" />,
      color: "bg-red-500",
    },
    {
      id: 6,
      name: "مشترکین خبرنامه",
      value: "89",
      icon: <FiMail className="h-6 w-6" />,
      color: "bg-indigo-500",
      section: "newsletter",
    },
 
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-400">داشبورد</h1>
        <p className="text-gray-500 mt-1">خلاصه وضعیت سیستم</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: stat.id * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="mr-5">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
