"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiTrash2,
  FiX,
  FiDownload,
  FiRefreshCw,
  FiAlertTriangle,
  FiLoader,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { EmployRequest } from "@/types/type";

const EmployRequests: React.FC = () => {
  // State
  const [requests, setRequests] = useState<EmployRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<EmployRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedEducation, setSelectedEducation] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<EmployRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // loading & error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<EmployRequest | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ Fetch API data
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/request", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("مشکلی در دریافت اطلاعات رخ داده است.");
      const data = await res.json();

      // اگر API تاریخ یا status ندارد می‌توانیم اینجا مقادیر پیش‌فرض بگذاریم
      const normalized = data.map(
        (req: EmployRequest & { status?: string; createdAt?: string }) => ({
          ...req,
          status: req.status ?? "pending",
          createdAt: req.createdAt ?? new Date().toLocaleDateString("fa-IR"),
        })
      );
      setRequests(normalized);
      setFilteredRequests(normalized);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ Filter handler
  useEffect(() => {
    const filtered = requests.filter((request) => {
      const fullName = `${request.name} ${request.lastName}`;
      const matchesSearch =
        fullName.includes(searchTerm) || request.phone.includes(searchTerm);
      const matchesType =
        selectedType === "all" || request.type === selectedType;
      const matchesEducation =
        selectedEducation === "all" || request.education === selectedEducation;

      return matchesSearch && matchesType && matchesEducation;
    });
    setFilteredRequests(filtered);
  }, [searchTerm, selectedType, selectedEducation, requests]);

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      Consultation: "مشاور املاک",
      LegalConsultation: "مشاور حقوقی",
      Investor: "سرمایه‌گذار",
      Others: "سایر",
    };
    return types[type] || type;
  };

  const getEducationLabel = (education: string) => {
    const educations: Record<string, string> = {
      Diploma: "دیپلم",
      Bachelor: "کارشناسی",
      Master: "کارشناسی ارشد",
      Phd: "دکترا",
    };
    return educations[education] || education;
  };

  // ✅ Delete request
  const confirmDelete = async () => {
    if (!requestToDelete) return;

    setIsDeleting(true);

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        setRequests((prev) =>
          prev.filter((req) => req._id !== requestToDelete._id)
        );

        const response = await fetch(`/api/request`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: requestToDelete._id }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "خطا در حذف درخواست");
        }

        resolve(data);
      } catch (error: unknown) {
        console.log("❌ Error deleting request:", error);
        fetchRequests();
        reject(error);
      } finally {
        setIsDeleting(false);
        setDeleteModalOpen(false);
        setRequestToDelete(null);
      }
    });

    // ✅ Toast وضعیت
    toast.promise(deletePromise, {
      loading: "در حال حذف درخواست...",
      success: `درخواست ${requestToDelete.name} ${requestToDelete.lastName} با موفقیت حذف شد`,
      error: (err) => err.message || "خطا در حذف درخواست",
    });
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
          <p className="text-gray-600">در حال بارگذاری همکاری ها...</p>
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
          درخواست‌های همکاری
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* search */}
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو..."
              className="w-full sm:w-64 pl-10 pr-4 text-black placeholder:text-gray-300 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* type */}
          <div className="relative">
            <select
              className="w-full sm:w-40 px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">همه انواع</option>
              <option value="Consultation">مشاور املاک</option>
              <option value="LegalConsultation">مشاور حقوقی</option>
              <option value="Investor">سرمایه‌گذار</option>
              <option value="Others">سایر</option>
            </select>
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* education */}
          <div className="relative">
            <select
              className="w-full sm:w-40 px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={selectedEducation}
              onChange={(e) => setSelectedEducation(e.target.value)}
            >
              <option value="all">همه تحصیلات</option>
              <option value="Diploma">دیپلم</option>
              <option value="Bachelor">کارشناسی</option>
              <option value="Master">کارشناسی ارشد</option>
              <option value="Phd">دکترا</option>
            </select>
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
        <table className="min-w-full text-black/80 divide-y divide-gray-200">
          <thead className="bg-gray-50 text-black">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                نام و نام خانوادگی
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                شماره تماس
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                نوع همکاری
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                تحصیلات
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                تاریخ ثبت
              </th>

              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <motion.tr
                key={request._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {request.name} {request.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{request.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTypeLabel(request.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEducationLabel(request.education)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request.createdAt}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    {request.file && (
                      <a
                        href={request.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiDownload className="w-5 h-5" />
                      </a>
                    )}

                    <button
                      onClick={() => {
                        setRequestToDelete(request);
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
          <p className="text-gray-500">هیچ درخواستی یافت نشد</p>
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
                جزئیات درخواست همکاری
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
                  <p className="text-sm text-gray-500">تحصیلات</p>
                  <p className="font-medium text-gray-600">
                    {getEducationLabel(selectedRequest.education)}
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

export default EmployRequests;
