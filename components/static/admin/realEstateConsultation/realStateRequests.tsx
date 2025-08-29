import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiTrash2,
  // FiCheck,
  FiX,
  FiRefreshCw,
  FiAlertTriangle,
  FiLoader,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { RealStateRequest } from "@/types/type";

const RealStateRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  // const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<RealStateRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState<RealStateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] =
    useState<RealStateRequest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Fetch requests from API
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/real-state-request");

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await response.json();

      // Add default status and createdAt if not present
      const processedRequests = data.map((request: RealStateRequest) => ({
        ...request,
        status: request.status || "pending",
        createdAt: request.createdAt || new Date().toLocaleDateString("fa-IR"),
      }));

      setRequests(processedRequests);
    } catch (error) {
      console.log("Error fetching requests:", error);
      setError("خطا در دریافت درخواست‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((request) => {
    const fullName = `${request.name} ${request.lastName}`;
    const matchesSearch =
      fullName.includes(searchTerm) || request.phone.includes(searchTerm);
    const matchesType = selectedType === "all" || request.type === selectedType;
    // const matchesStatus =
    //   selectedStatus === "all" || request.status === selectedStatus;
    return matchesSearch && matchesType;
    // && matchesStatus;
  });

  const handleViewRequest = (request: RealStateRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = async (request: RealStateRequest) => {
    setRequestToDelete(request);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;

    setIsDeleting(true);
    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        // Update local state immediately for better UX
        setRequests((prev) =>
          prev.filter((req) => req._id !== requestToDelete._id)
        );

        const response = await fetch("/api/real-state-request", {
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
      } catch (error) {
        console.log("Error deleting request:", error);
        // Revert the change if API call fails
        fetchRequests();
        reject(error);
      } finally {
        setIsDeleting(false);
        setDeleteModalOpen(false);
        setRequestToDelete(null);
      }
    });

    toast.promise(deletePromise, {
      loading: "در حال حذف درخواست...",
      success: `درخواست  ${requestToDelete.name} ${requestToDelete.lastName} با موفقیت حذف شد`,
      error: (err) => err.message || "خطا در حذف درخواست",
    });
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setRequestToDelete(null);
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      Apartment: "آپارتمان",
      Villa: "ویلا",
      EmptyEarth: "زمین خالی",
      Commercial: "تجاری",
      Other: "سایر",
    };
    return types[type] || type;
  };

  const getServiceTypeLabel = (serviceType: string) => {
    const types: Record<string, string> = {
      Buy: "خرید",
      Sell: "فروش",
      Rent: "اجاره",
      Mortgage: "رهن",
      Pricing: "قیمت‌گذاری",
    };
    return types[serviceType] || serviceType;
  };

  const formatBudget = (budget: number | null) => {
    if (budget === null) return "نامشخص";
    return new Intl.NumberFormat("fa-IR").format(budget) + " تومان";
  };

  if (loading) {
    return (
      <div className="h-64 bg-transparent flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری مشتوره های املاک...</p>
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
          درخواست‌های مشاوره املاک
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 placeholder:text-gray-300 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <select
              className="w-full sm:w-40 px-4 py-2 rounded-lg text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">همه انواع</option>
              <option value="Apartment">آپارتمان</option>
              <option value="Villa">ویلا</option>
              <option value="EmptyEarth">زمین خالی</option>
              <option value="Commercial">تجاری</option>
              <option value="Other">سایر</option>
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

          {/* <div className="relative">
            <select
              className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="processed">پردازش شده</option>
              <option value="rejected">رد شده</option>
            </select>
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div> */}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                نام و نام خانوادگی
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                شماره تماس
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ایمیل
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                نوع ملک
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                نوع خدمت
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                بودجه
              </th>
              {/* <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                وضعیت
              </th> */}
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
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
                  <div className="text-sm font-medium text-gray-900">
                    {request.name} {request.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{request.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {request.email || "ندارد"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {getTypeLabel(request.type)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {getServiceTypeLabel(request.serviceType)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatBudget(request.budget)}
                  </div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "processed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {request.status === "pending"
                      ? "در انتظار"
                      : request.status === "processed"
                      ? "پردازش شده"
                      : "رد شده"}
                  </span>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewRequest(request)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="مشاهده جزئیات"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDeleteRequest(request)}
                      className="text-red-600 hover:text-red-900"
                      title="حذف درخواست"
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

      {filteredRequests.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-500">هیچ درخواستی یافت نشد</p>
        </div>
      )}

      {/* Detail Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[60vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                جزئیات درخواست مشاوره
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
                  <p className="font-medium text-xs text-gray-600">
                    {selectedRequest.name} {selectedRequest.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">شماره تماس</p>
                  <p className="font-medium text-gray-600">
                    {selectedRequest.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ایمیل</p>
                  <p className="font-medium text-xs text-gray-600">
                    {selectedRequest.email || "ارائه نشده"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">نوع ملک</p>
                  <p className="font-medium text-xs text-gray-600">
                    {getTypeLabel(selectedRequest.type)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">نوع خدمت</p>
                  <p className="font-medium text-xs text-gray-600">
                    {getServiceTypeLabel(selectedRequest.serviceType)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">بودجه</p>
                  <p className="font-medium text-xs text-gray-600">
                    {formatBudget(selectedRequest.budget)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">تاریخ ثبت</p>
                  <p className="font-medium text-xs text-gray-600">
                    {selectedRequest.createdAt || "نامشخص"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">وضعیت</p>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedRequest.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedRequest.status === "processed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedRequest.status === "pending"
                      ? "در انتظار"
                      : selectedRequest.status === "processed"
                      ? "پردازش شده"
                      : "رد شده"}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">توضیحات</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {selectedRequest.description}
                </p>
              </div>

              <div className="flex justify-start gap-2">
                {selectedRequest.status === "pending" && <></>}
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    handleDeleteRequest(selectedRequest!);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 flex items-center space-x-2 space-x-reverse"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>حذف درخواست</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
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
                حذف درخواست مشاوره
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                آیا از حذف درخواست مشاوره زیر اطمینان دارید؟
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
                  <div>
                    <span className="text-gray-500">نوع خدمت:</span>
                    <span className="font-medium mr-2 text-gray-600">
                      {getServiceTypeLabel(requestToDelete.serviceType)}
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

export default RealStateRequests;
