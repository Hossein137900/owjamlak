"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiTrash2,
  FiRefreshCw,
  FiAlertTriangle,
  FiX,
  FiLoader,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { LegalRequest } from "@/types/type";

const LegalRequests: React.FC = () => {
  const [requests, setRequests] = useState<LegalRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<LegalRequest | null>(
    null
  );
  // loading & error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<LegalRequest | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/legal-request");
      const data = await res.json();
      setRequests(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // فارسی‌سازی نوع
  const getTypeLabel = (type: LegalRequest["type"]) => {
    const map: Record<LegalRequest["type"], string> = {
      Contract: "تنظیم قرارداد",
      Solve: "حل اختلاف",
      DocumentReview: "بررسی اسناد",
      Other: "سایر",
    };
    return map[type];
  };

  // فیلتر
  const filteredRequests = requests.filter((req) => {
    const fullName = `${req.name} ${req.lastName}`;
    const matchSearch =
      fullName.includes(searchTerm) || req.phone.includes(searchTerm);
    const matchType = selectedType === "all" || req.type === selectedType;
    return matchSearch && matchType;
  });

  // حذف
  const confirmDelete = async () => {
    if (!requestToDelete) return;

    setIsDeleting(true);

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        // UI را سریع آپدیت می‌کنیم
        setRequests((prev) =>
          prev.filter((r) => r._id !== requestToDelete._id)
        );

        const res = await fetch(`/api/legal-request`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: requestToDelete._id }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "خطا در حذف");
        }

        resolve(data);
      } catch (err: unknown) {
        console.log("❌ خطا در حذف:", err);
        fetchRequests(); // برگردوندن دیتا
        reject(err);
      } finally {
        setIsDeleting(false);
        setDeleteModalOpen(false);
        setRequestToDelete(null);
      }
    });

    toast.promise(deletePromise, {
      loading: "در حال حذف...",
      success: `درخواست ${requestToDelete.name} ${requestToDelete.lastName} حذف شد`,
      error: (err) => err.message || "خطا در حذف",
    });
  };

  const handleView = (req: LegalRequest) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setRequestToDelete(null);
  };

  if (loading) {
    return (
      <div className="h-64 bg-transparent flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری مشاوره های حقوقی...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={fetchRequests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>تلاش مجدد</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
          درخواست‌های مشاوره حقوقی
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 text-black placeholder:text-gray-300 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full sm:w-40 px-4 py-2 rounded-lg text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">همه انواع</option>
              <option value="Contract">تنظیم قرارداد</option>
              <option value="Solve">حل اختلاف</option>
              <option value="DocumentReview">بررسی اسناد</option>
              <option value="Other">سایر</option>
            </select>
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={fetchRequests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>بروزرسانی</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-black/80">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                نام و نام خانوادگی
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                شماره تماس
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                نوع
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((req) => (
              <motion.tr
                key={req._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                <td className="px-6 py-4">
                  {req.name} {req.lastName}
                </td>
                <td className="px-6 py-4">{req.phone}</td>
                <td className="px-6 py-4">{getTypeLabel(req.type)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleView(req)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setRequestToDelete(req);
                        setDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">هیچ درخواستی حقوقی یافت نشد</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                جزئیات درخواست حقوقی
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">نام و نام خانوادگی</p>
                  <p className="font-medium text-gray-600">
                    {selectedRequest.name} {selectedRequest.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">شماره تماس</p>
                  <p className="font-medium text-gray-600">
                    {selectedRequest.phone}
                  </p>
                </div>
                {selectedRequest.email && (
                  <div>
                    <p className="text-sm text-gray-500">ایمیل</p>
                    <p className="font-medium text-gray-600">
                      {selectedRequest.email}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">نوع همکاری</p>
                  <p className="font-medium text-gray-600">
                    {getTypeLabel(selectedRequest.type)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">توضیحات</p>
                  <p className="font-medium text-gray-600">
                    {selectedRequest.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-start gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border text-gray-600 border-gray-300 rounded-md text-sm"
                >
                  بستن
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/*  Delete Confirmation Modal */}
      {deleteModalOpen && requestToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="flex items-center justify-center pt-6 pb-2">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <FiAlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>

            <div className="text-center px-6 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                حذف درخواست همکاری
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                آیا از حذف درخواست همکاری زیر اطمینان دارید؟
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">نام:</span>
                    <span className="font-medium mr-2 text-gray-600 ">
                      {requestToDelete.name} {requestToDelete.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">تلفن:</span>
                    <span className="font-medium mr-2 text-gray-600 ">
                      {requestToDelete.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">نوع ملک:</span>
                    <span className="font-medium mr-2 text-gray-600">
                      {getTypeLabel(requestToDelete.type)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-red-600 mb-6">
                ⚠️ این عمل قابل بازگشت نیست و تمام اطلاعات مربوط به این درخواست
                حذف خواهد شد.
              </p>

              <div className="flex justify-start gap-3">
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 space-x-reverse"
                >
                  {isDeleting ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      <span>در حال حذف...</span>
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      <span>بله، حذف کن</span>
                    </>
                  )}
                </button>
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 border text-gray-600 border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  انصراف
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default LegalRequests;
