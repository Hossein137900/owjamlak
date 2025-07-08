import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiTrash2,
  FiCheck,
  FiX,
} from "react-icons/fi";

interface RealStateRequest {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  email: string | null;
  description: string;
  type: "Apartment" | "Villa" | "EmptyEarth" | "Commercial" | "Other";
  serviceType: "Buy" | "Sell" | "Rent" | "Mortgage" | "Pricing";
  budget: number | null;
  status: "pending" | "processed" | "rejected";
  createdAt: string;
}

const RealStateRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<RealStateRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - replace with actual API call
  const requests: RealStateRequest[] = [
    {
      id: "1",
      name: "علی",
      lastName: "محمدی",
      phone: "09123456789",
      email: "ali@example.com",
      description: "به دنبال آپارتمان دو خوابه در محدوده سعادت آباد هستم",
      type: "Apartment",
      serviceType: "Buy",
      budget: 2000000000,
      status: "pending",
      createdAt: "1402/06/15",
    },
    {
      id: "2",
      name: "سارا",
      lastName: "احمدی",
      phone: "09123456788",
      email: null,
      description: "قصد فروش ویلای خود در شمال را دارم",
      type: "Villa",
      serviceType: "Sell",
      budget: null,
      status: "processed",
      createdAt: "1402/06/10",
    },
    {
      id: "3",
      name: "محمد",
      lastName: "رضایی",
      phone: "09123456787",
      email: "mohammad@example.com",
      description: "به دنبال اجاره مغازه تجاری در مرکز شهر هستم",
      type: "Commercial",
      serviceType: "Rent",
      budget: 50000000,
      status: "rejected",
      createdAt: "1402/06/05",
    },
  ];

  const filteredRequests = requests.filter((request) => {
    const fullName = `${request.name} ${request.lastName}`;
    const matchesSearch =
      fullName.includes(searchTerm) || request.phone.includes(searchTerm);
    const matchesType = selectedType === "all" || request.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || request.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewRequest = (request: RealStateRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleStatusChange = (
    id: string,
    newStatus: "pending" | "processed" | "rejected"
  ) => {
    // In a real app, you would update the status via API
    console.log(`Changing status of request ${id} to ${newStatus}`);
    // Then refresh the data
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
    return new Intl.NumberFormat("fa-IR").format(budget / 10) + " تومان";
  };

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
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <select
              className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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

          <div className="relative">
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
          </div>
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
                تاریخ ثبت
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                وضعیت
              </th>
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
                key={request.id}
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
                    {request.createdAt}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <button
                      onClick={() => handleViewRequest(request)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(request.id, "processed")
                          }
                          className="text-green-600 hover:text-green-900"
                        >
                          <FiCheck className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(request.id, "rejected")
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button className="text-red-600 hover:text-red-900">
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

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          نمایش {filteredRequests.length} از {requests.length} درخواست
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
            قبلی
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
            بعدی
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
                  <p className="font-medium">
                    {selectedRequest.name} {selectedRequest.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">شماره تماس</p>
                  <p className="font-medium">{selectedRequest.phone}</p>
                </div>
                {selectedRequest.email && (
                  <div>
                    <p className="text-sm text-gray-500">ایمیل</p>
                    <p className="font-medium">{selectedRequest.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">نوع ملک</p>
                  <p className="font-medium">
                    {getTypeLabel(selectedRequest.type)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">نوع خدمت</p>
                  <p className="font-medium">
                    {getServiceTypeLabel(selectedRequest.serviceType)}
                  </p>
                </div>
                {selectedRequest.budget !== null && (
                  <div>
                    <p className="text-sm text-gray-500">بودجه</p>
                    <p className="font-medium">
                      {formatBudget(selectedRequest.budget)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">تاریخ ثبت</p>
                  <p className="font-medium">{selectedRequest.createdAt}</p>
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

              <div className="flex justify-end space-x-3 space-x-reverse">
                {selectedRequest.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedRequest.id, "processed");
                        setIsModalOpen(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                    >
                      تایید و پردازش
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedRequest.id, "rejected");
                        setIsModalOpen(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                    >
                      رد درخواست
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                >
                  بستن
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
