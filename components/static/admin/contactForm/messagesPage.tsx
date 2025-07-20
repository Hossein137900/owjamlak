"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiMail,
  FiPhone,
  FiUser,
  FiMessageSquare,
  FiCalendar,
  FiX,
  FiRefreshCw,
  FiFilter,
  FiDownload,
  FiTrash2,
  FiCheck,
  FiClock,
  FiStar,
} from "react-icons/fi";

interface Message {
  _id: string;
  formType: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyType?: string;
  createdAt: string;
  status: "pending" | "accepted" | "declined";
  rating?: number;
  isTestimonial?: boolean;
  adminNote?: string;
  acceptedAt?: string;
  declinedAt?: string;
}

interface MessageModalProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (
    messageId: string,
    status: string,
    additionalData?: any
  ) => void;
}

const MessageModal: React.FC<MessageModalProps> = ({
  message,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  const [rating, setRating] = useState(5);
  const [isTestimonial, setIsTestimonial] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (message) {
      setRating(message.rating || 5);
      setIsTestimonial(message.isTestimonial || false);
      setAdminNote(message.adminNote || "");
    }
  }, [message]);

  if (!message) return null;

  const handleStatusUpdate = async (status: string) => {
    setUpdating(true);
    const additionalData: any = { adminNote };

    if (status === "accepted") {
      additionalData.rating = rating;
      additionalData.isTestimonial = isTestimonial;
    }

    await onStatusUpdate(message._id, status, additionalData);
    setUpdating(false);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 50 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[70vh] overflow-y-auto"
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-transparent text-black p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FiMessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">جزئیات پیام</h2>
                    <p className="text-black/60 text-sm">
                      {new Date(message.createdAt).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FiUser className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-700">نام</span>
                    </div>
                    <p className="text-gray-900 font-medium">{message.name}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FiMail className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-700">ایمیل</span>
                    </div>
                    <p className="text-gray-900 font-medium break-all">
                      {message.email}
                    </p>
                  </div>

                  {message.phone && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <FiPhone className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-700">
                          شماره تماس
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {message.phone}
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FiFilter className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-gray-700">
                        نوع فرم
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {message.formType}
                    </p>
                  </div>
                </div>

                {/* Property Type */}
                {message.propertyType && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FiFilter className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-700">
                        نوع ملک
                      </span>
                    </div>
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {message.propertyType}
                    </span>
                  </div>
                )}

                {/* Current Status */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FiClock className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-700">
                      وضعیت فعلی
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        message.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : message.status === "declined"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {message.status === "accepted"
                        ? "تایید شده"
                        : message.status === "declined"
                        ? "رد شده"
                        : "در انتظار"}
                    </span>
                    {message.isTestimonial && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        <FiStar className="w-3 h-3" />
                        Testimonial
                      </span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiMessageSquare className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-700">
                      متن پیام
                    </span>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-r-4 border-purple-500">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>
                </div>

                {/* Admin Controls */}
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    کنترل‌های مدیریت
                  </h3>

                  {/* Admin Note */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      یادداشت مدیر
                    </label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 placeholder:text-gray-400 text-black rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                      placeholder="یادداشت اختیاری..."
                    />
                  </div>

                  {/* Rating and Testimonial (only for accept) */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        امتیاز (برای تایید)
                      </label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                        <option value={4}>⭐⭐⭐⭐ (4)</option>
                        <option value={3}>⭐⭐⭐ (3)</option>
                        <option value={2}>⭐⭐ (2)</option>
                        <option value={1}>⭐ (1)</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isTestimonial}
                          onChange={(e) => setIsTestimonial(e.target.checked)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          نمایش به عنوان Testimonial
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate("accepted")}
                      disabled={updating}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FiCheck className="w-4 h-4" />
                      {updating ? "در حال پردازش..." : "تایید"}
                    </button>

                    <button
                      onClick={() => handleStatusUpdate("declined")}
                      disabled={updating}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FiX className="w-4 h-4" />
                      {updating ? "در حال پردازش..." : "رد"}
                    </button>

                    <button
                      onClick={() => handleStatusUpdate("pending")}
                      disabled={updating}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FiClock className="w-4 h-4" />
                      {updating ? "در حال پردازش..." : "انتظار"}
                    </button>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() =>
                      window.open(`mailto:${message.email}`, "_blank")
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <FiMail className="w-4 h-4" />
                    ارسال ایمیل
                  </button>

                  {message.phone && (
                    <button
                      onClick={() =>
                        window.open(`tel:${message.phone}`, "_self")
                      }
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <FiPhone className="w-4 h-4" />
                      تماس تلفنی
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchMessages = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await fetch("/api/contact");
      const data = await res.json();
      const messagesData = data.data || [];

      setMessages(messagesData);
      setFilteredMessages(messagesData);
    } catch (err) {
      console.error("خطا در دریافت پیام‌ها:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter messages based on search and filter type
  useEffect(() => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(
        (msg) =>
          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((msg) => msg.formType === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((msg) => msg.status === filterStatus);
    }

    setFilteredMessages(filtered);
  }, [searchTerm, filterType, filterStatus, messages]);

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const handleStatusUpdate = async (
    messageId: string,
    status: string,
    additionalData?: any
  ) => {
    setUpdatingStatus(messageId);
    try {
      const response = await fetch(`/api/contact`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          status,
          ...additionalData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, ...result.data } : msg
          )
        );

        // Update selected message if it's the one being updated
        if (selectedMessage?._id === messageId) {
          setSelectedMessage({ ...selectedMessage, ...result.data });
        }

        console.log(result.message);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error updating message status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (
      !confirm("آیا از حذف این پیام اطمینان دارید؟ این عمل قابل بازگشت نیست.")
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/contact?id=${messageId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        console.log("پیام با موفقیت حذف شد");
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const getFormTypeColor = (formType: string) => {
    const colors: { [key: string]: string } = {
      "مشاوره املاک": "bg-blue-100 text-blue-800",
      "مشاوره حقوقی": "bg-green-100 text-green-800",
      همکاری: "bg-purple-100 text-purple-800",
      "تماس با ما": "bg-orange-100 text-orange-800",
      general: "bg-gray-100 text-gray-800",
      property: "bg-blue-100 text-blue-800",
      support: "bg-green-100 text-green-800",
    };
    return colors[formType] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      pending: "در انتظار",
      accepted: "تایید شده",
      declined: "رد شده",
    };
    return texts[status] || status;
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        "نام",
        "ایمیل",
        "شماره تماس",
        "نوع فرم",
        "نوع ملک",
        "پیام",
        "وضعیت",
        "تاریخ",
      ],
      ...filteredMessages.map((msg) => [
        msg.name,
        msg.email,
        msg.phone || "-",
        msg.formType,
        msg.propertyType || "-",
        msg.message.replace(/\n/g, " "),
        getStatusText(msg.status),
        new Date(msg.createdAt).toLocaleDateString("fa-IR"),
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `messages_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری پیام‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              مدیریت پیام‌های دریافتی
            </h1>
            <p className="text-gray-600">
              مجموع {filteredMessages.length} پیام از {messages.length} پیام
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => fetchMessages(true)}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              بروزرسانی
            </button>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              خروجی CSV
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              جستجو
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در نام، ایمیل یا پیام..."
              className="w-full px-3 py-2 border placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Form Type Filter */}
   

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وضعیت
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border placeholder:text-gray-300 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">همه</option>
              <option value="pending">در انتظار</option>
              <option value="accepted">تایید شده</option>
              <option value="declined">رد شده</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
                setFilterStatus("all");
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              پاک کردن فیلترها
            </button>
          </div>
        </div>
      </motion.div>

      {/* Messages Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterType !== "all" || filterStatus !== "all"
                ? "پیامی یافت نشد"
                : "هیچ پیامی دریافت نشده"}
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== "all" || filterStatus !== "all"
                ? "لطفاً فیلترها را تغییر دهید یا جستجوی جدیدی انجام دهید"
                : "پیام‌های جدید اینجا نمایش داده خواهند شد"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اطلاعات فرستنده
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500                     uppercase tracking-wider">
                    پیام
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاریخ
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message, index) => (
                  <motion.tr
                    key={message._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Sender Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {message.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <FiMail className="w-3 h-3" />
                            {message.email}
                          </div>
                          {message.phone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <FiPhone className="w-3 h-3" />
                              {message.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Message Preview */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        <p className="line-clamp-2">{message.message}</p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            message.status
                          )}`}
                        >
                          {getStatusText(message.status)}
                        </span>
                        {message.isTestimonial && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                            <FiStar className="w-3 h-3" />T
                          </span>
                        )}
                        {message.rating && (
                          <span className="text-xs text-yellow-600 flex items-center gap-1">
                            <FiStar className="w-3 h-3" />
                            {message.rating}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        <div>
                          <div>
                            {new Date(message.createdAt).toLocaleDateString(
                              "fa-IR"
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(message.createdAt).toLocaleTimeString(
                              "fa-IR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors group"
                          title="مشاهده جزئیات"
                        >
                          <FiEye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>

                        {/* Quick Status Buttons */}
                        {message.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(message._id, "accepted", {
                                  rating: 5,
                                  isTestimonial: false,
                                })
                              }
                              disabled={updatingStatus === message._id}
                              className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors group disabled:opacity-50"
                              title="تایید سریع"
                            >
                              <FiCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>

                            <button
                              onClick={() =>
                                handleStatusUpdate(message._id, "declined")
                              }
                              disabled={updatingStatus === message._id}
                              className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors group disabled:opacity-50"
                              title="رد سریع"
                            >
                              <FiX className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                          </>
                        )}

                        {message.phone && (
                          <button
                            onClick={() =>
                              window.open(`tel:${message.phone}`, "_self")
                            }
                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-2 rounded-lg transition-colors group"
                            title="تماس تلفنی"
                          >
                            <FiPhone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteMessage(message._id)}
                          className="bg-gray-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors group"
                          title="حذف پیام"
                        >
                          <FiTrash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiMessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mr-4">
              <div className="text-2xl font-bold text-gray-900">
                {messages.length}
              </div>
              <div className="text-sm text-gray-500">کل پیام‌ها</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiClock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="mr-4">
              <div className="text-2xl font-bold text-gray-900">
                {messages.filter((m) => m.status === "pending").length}
              </div>
              <div className="text-sm text-gray-500">در انتظار</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            <div className="mr-4">
              <div className="text-2xl font-bold text-gray-900">
                {messages.filter((m) => m.status === "accepted").length}
              </div>
              <div className="text-sm text-gray-500">تایید شده</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiStar className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mr-4">
              <div className="text-2xl font-bold text-gray-900">
                {messages.filter((m) => m.isTestimonial).length}
              </div>
              <div className="text-sm text-gray-500">Testimonials</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Message Detail Modal */}
      <MessageModal
        message={selectedMessage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
