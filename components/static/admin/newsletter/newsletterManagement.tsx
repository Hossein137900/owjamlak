"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiUsers,
  FiDownload,
  FiTrash2,
  FiSearch,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

interface NewsletterSubscriber {
  _id: string;
  email: string;
  createdAt: string;
  isActive: boolean;
  source?: string;
}

interface ApiResponse {
  success: boolean;
  data?: NewsletterSubscriber[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}

const NewsletterManagement: React.FC = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus] = useState<
    "all" | "active" | "unsubscribed"
  >("all");
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data - Replace with actual API call
  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams({
          page: pagination.currentPage.toString(),
          limit: pagination.itemsPerPage.toString(),
        });

        if (filterStatus !== "all") {
          queryParams.append(
            "isActive",
            filterStatus === "active" ? "true" : "false"
          );
        }

        const response = await fetch(`/api/newsletter?${queryParams}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success && data.data) {
          setSubscribers(data.data);
          if (data.pagination) {
            setPagination(data.pagination);
          }
        } else {
          throw new Error(data.message || "Failed to fetch subscribers");
        }
      } catch (error) {
        console.error("Error fetching subscribers:", error);
        setError("خطا در دریافت اطلاعات مشترکین");
        setSubscribers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [pagination.currentPage, pagination.itemsPerPage, filterStatus]);

  // Filter subscribers based on search and status
  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch = subscriber.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Statistics
  const stats = {
    total: pagination.totalItems,
    active: subscribers.filter((s) => s.isActive === true).length,
    unsubscribed: subscribers.filter((s) => s.isActive === false).length,
    thisMonth: subscribers.filter((s) => {
      const date = new Date(s.createdAt);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      const response = await fetch("/api/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedSubscribers }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the data after successful deletion
        const queryParams = new URLSearchParams({
          page: pagination.currentPage.toString(),
          limit: pagination.itemsPerPage.toString(),
        });

        const refreshResponse = await fetch(`/api/newsletter?${queryParams}`);
        const refreshData: ApiResponse = await refreshResponse.json();

        if (refreshData.success && refreshData.data) {
          setSubscribers(refreshData.data);
          if (refreshData.pagination) {
            setPagination(refreshData.pagination);
          }
        }

        setSelectedSubscribers([]);
        setShowDeleteModal(false);
      } else {
        throw new Error(data.message || "Failed to delete subscribers");
      }
    } catch (error) {
      console.error("Error deleting subscribers:", error);
      setError("خطا در حذف مشترکین");
    }
  };

  // Export subscribers
  const handleExport = () => {
    const csvContent = [
      ["Email", "Subscribed At", "Status", "Source"],
      ...filteredSubscribers.map((s) => [
        s.email,
        new Date(s.createdAt).toLocaleDateString("fa-IR"),
        s.isActive ? "فعال" : "لغو شده",
        s.source || "نامشخص",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter-subscribers-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-[#66308d] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-500 flex items-center gap-2">
            <FiMail className="text-purple-600" />
            مدیریت خبرنامه
          </h2>
          <p className="text-gray-400 mt-1">مدیریت مشترکین خبرنامه سایت</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            خروجی Excel
          </motion.button>

          {selectedSubscribers.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              حذف ({selectedSubscribers.length})
            </motion.button>
          )}
        </div>
      </motion.div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          {error}
          <button
            onClick={() => setError(null)}
            className="float-left text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </motion.div>
      )}
      {/* Statistics Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {[
          {
            label: "کل مشترکین",
            value: stats.total,
            icon: FiUsers,
            color: "blue",
          },
          {
            label: "مشترکین فعال",
            value: stats.active,
            icon: FiCheckCircle,
            color: "green",
          },

          {
            label: "این ماه",
            value: stats.thisMonth,
            icon: FiCalendar,
            color: "purple",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {/* Filters */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="جستجو بر اساس ایمیل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full placeholder:text-gray-500 text-black/80 pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66308d] focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>
      {/* Subscribers Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right">
                  <input
                    type="checkbox"
                    checked={
                      selectedSubscribers.length ===
                        filteredSubscribers.length &&
                      filteredSubscribers.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSubscribers(
                          filteredSubscribers.map((s) => s._id)
                        );
                      } else {
                        setSelectedSubscribers([]);
                      }
                    }}
                    className="rounded border-gray-300 text-[#66308d] focus:ring-[#66308d]"
                  />
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                  ایمیل
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                  تاریخ عضویت
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                  وضعیت
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                  منبع
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredSubscribers.map((subscriber) => (
                  <motion.tr
                    key={subscriber._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubscribers([
                              ...selectedSubscribers,
                              subscriber._id,
                            ]);
                          } else {
                            setSelectedSubscribers(
                              selectedSubscribers.filter(
                                (id) => id !== subscriber._id
                              )
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-[#66308d] focus:ring-[#66308d]"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {subscriber.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(subscriber.createdAt).toLocaleDateString(
                        "fa-IR"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          subscriber.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {subscriber.isActive ? "فعال" : "لغو شده"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {subscriber.source || "نامشخص"}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredSubscribers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FiMail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {searchTerm || filterStatus !== "all"
                ? "نتیجه‌ای یافت نشد"
                : "هنوز مشترکی وجود ندارد"}
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all"
                ? "فیلترهای خود را تغییر دهید"
                : "مشترکین خبرنامه اینجا نمایش داده می‌شوند"}
            </p>
          </motion.div>
        )}
      </motion.div>

      {pagination.totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center gap-2 mt-6"
        >
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage - 1,
              }))
            }
            disabled={pagination.currentPage === 1}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            قبلی
          </button>

          <span className="px-4 py-2 text-gray-400">
            صفحه {pagination.currentPage} از {pagination.totalPages}
          </span>

          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
              }))
            }
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            بعدی
          </button>
        </motion.div>
      )}
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">تأیید حذف</h3>
              </div>

              <p className="text-gray-600 mb-6">
                آیا از حذف {selectedSubscribers.length} مشترک انتخاب شده اطمینان
                دارید؟ این عمل قابل بازگشت نیست.
              </p>

              <div className="flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  انصراف
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NewsletterManagement;
