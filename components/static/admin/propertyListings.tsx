import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
  FiX,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import Image from "next/image";
import { usePosters, usePosterMutations } from "../../../hooks/usePosters";
import { Poster } from "@/types/type";

const PropertyListings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPropertyType, setSelectedPropertyType] =
    useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<Poster | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use SWR hook to fetch posters
  const { posters, total, page, limit, isLoading, error, mutate } = usePosters({
    page: currentPage,
    limit: 10,
    type: selectedType,
    category: selectedCategory,
    propertyType: selectedPropertyType,
    status: selectedStatus,
    search: searchTerm,
  });
  console.log(posters, selectedPropertyType);

  const { deletePoster } = usePosterMutations();

  const handleViewProperty = (property: Poster) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (property: Poster) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProperty) return;

    setIsDeleting(true);
    try {
      await deletePoster(selectedProperty._id);
      setIsDeleteModalOpen(false);
      setSelectedProperty(null);
      // Refresh the data
      mutate();
    } catch (error) {
      console.error("Error deleting poster:", error);
      // You can add a toast notification here
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      normal: "عادی",
      investment: "سرمایه‌گذاری",
    };
    return types[type] || type;
  };

  const getPropertyTypeLabel = (propertyType: string) => {
    const propertyTypes: Record<string, string> = {
      residential: "مسکونی",
      administrative: "اداری",
      commercial: "تجاری",
      industrial: "صنعتی",
      old: "قدیمی",
    };
    return propertyTypes[propertyType] || propertyType;
  };

  // const getStatusLabel = (status: string) => {
  //   const statuses: Record<string, string> = {
  //     active: "فعال",
  //     pending: "در انتظار تایید",
  //     sold: "فروخته شده",
  //     rented: "اجاره داده شده",
  //   };
  //   return statuses[status] || status;
  // };

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-center py-12">
          <FiLoader className="animate-spin text-green-600 text-2xl ml-2" />
          <span className="text-gray-600">در حال بارگذاری آگهی‌ها...</span>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-center py-12 text-red-600">
          <FiAlertCircle className="text-2xl ml-2" />
          <span>خطا در بارگذاری آگهی‌ها: {error.message}</span>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={() => mutate()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </motion.div>
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
          مدیریت آگهی‌های ملک ({posters.length} آگهی)
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
            <FiPlus className="ml-1" />
            افزودن آگهی جدید
          </button>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="جستجو..."
              className="w-full sm:w-64 text-gray-900 placeholder:text-gray-400 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </form>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <select
            className="w-full sm:w-40 px-4 py-2 rounded-lg border text-gray-900 placeholder:text-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            value={selectedPropertyType}
            onChange={(e) => {
              setSelectedPropertyType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">همه انواع</option>
            <option value="residential">مسکونی</option>
            <option value="administrative">اداری</option>
            <option value="commercial">تجاری</option>
            <option value="industrial">صنعتی</option>
            <option value="old">کلنگی</option>
          </select>
          <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative">
          <select
            className="w-full sm:w-40 px-4 py-2 rounded-lg text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">همه دسته‌ها</option>
            <option value="sale">فروش</option>
            <option value="rent">اجاره</option>
            <option value="fullRent">رهن</option>
          </select>
          <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative">
          <select
            className="w-full sm:w-40 px-4 py-2 rounded-lg text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="pending">در انتظار تایید</option>
            <option value="sold">فروخته شده</option>
            <option value="rented">اجاره داده شده</option>
          </select>
          <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                ملک
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                موقعیت
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                نوع / دسته
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                قیمت
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
                تاریخ ایجاد
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
            {posters.map((property) => (
              <motion.tr
                key={property._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-14 w-14 flex-shrink-0 rounded-md overflow-hidden relative">
                      <Image
                        src={property.images[0].url}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {property.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.area} متر | {property.rooms} خواب
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {property.location}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {getTypeLabel(property.type)} /{" "}
                    {getPropertyTypeLabel(property.propertyType)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {property.tradeType === "rent" ||
                    property.tradeType === "fullRent"
                      ? formatPrice(property.depositRent || 0)
                      : formatPrice(property.totalPrice || 0)}
                  </div>
                  {(property.tradeType === "rent" ||
                    property.tradeType === "fullRent") &&
                    property.rentPrice && (
                      <div className="text-xs text-gray-500">
                        اجاره: {formatPrice(property.rentPrice)}
                      </div>
                    )}
                </td>

                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      property.
                    )}`}
                  >
                    {getStatusLabel(property.status)}
                  </span>
                  {property.featured && (
                    <span className="mr-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      ویژه
                    </span>
                  )}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(property.createdAt).toLocaleDateString("fa-IR")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewProperty(property)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      title="مشاهده جزئیات"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="ویرایش"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(property)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="حذف"
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

      {posters.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">هیچ آگهی‌ای یافت نشد</p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          نمایش {(page - 1) * limit + 1} تا {Math.min(page * limit, total)} از{" "}
          {total} آگهی
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className={`px-3 py-1 border rounded-md text-sm transition-colors ${
              page <= 1
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            قبلی
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  page === pageNum
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className={`px-3 py-1 border rounded-md text-sm transition-colors ${
              page >= totalPages
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            بعدی
          </button>
        </div>
      </div>

      {/* Property Detail Modal */}
      {isModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">جزئیات آگهی</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                <Image
                  src={selectedProperty.images[0].url}
                  alt={selectedProperty.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h2 className="text-xl font-bold mb-4">
                {selectedProperty.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">شناسه آگهی</p>
                  <p className="font-medium">{selectedProperty._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">موقعیت</p>
                  <p className="font-medium">{selectedProperty.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">قیمت</p>
                  <p className="font-medium">
                    {formatPrice(selectedProperty.totalPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">نوع / دسته</p>
                  <p className="font-medium">
                    {getTypeLabel(selectedProperty.type)} /{" "}
                    {getPropertyTypeLabel(selectedProperty.propertyType)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">متراژ</p>
                  <p className="font-medium">
                    {selectedProperty.area} متر مربع
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">تعداد اتاق</p>
                  <p className="font-medium">{selectedProperty.rooms} خواب</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">تاریخ ثبت</p>
                  <p className="font-medium">
                    {new Date(selectedProperty.createdAt).toLocaleDateString(
                      "fa-IR"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">آخرین بروزرسانی</p>
                  <p className="font-medium">
                    {new Date(selectedProperty.updatedAt).toLocaleDateString(
                      "fa-IR"
                    )}
                  </p>
                </div>
                {selectedProperty.contact && (
                  <div>
                    <p className="text-sm text-gray-500">اطلاعات تماس</p>
                    <p className="font-medium">
                      {selectedProperty.contact} - {selectedProperty.user.name}
                    </p>
                    {selectedProperty.user.phone && (
                      <p className="text-sm text-gray-600">
                        {selectedProperty.user.phone}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">توضیحات</p>
                <p className="text-gray-700 leading-relaxed">
                  {selectedProperty.description}
                </p>
              </div>

              {selectedProperty.images &&
                selectedProperty.images.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">تصاویر اضافی</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {selectedProperty.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative h-20 rounded-md overflow-hidden"
                        >
                          <Image
                            src={image.url}
                            alt={`تصویر ${index + 1}`}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/placeholder.jpg";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="flex justify-end space-x-3 space-x-reverse">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                  ویرایش آگهی
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    handleDeleteClick(selectedProperty);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                >
                  حذف آگهی
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mr-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    تایید حذف آگهی
                  </h3>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  آیا از حذف آگهی زیر اطمینان دارید؟
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium text-gray-900">
                    {selectedProperty.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedProperty.location}
                  </p>
                </div>
                <p className="text-red-600 text-sm mt-2">
                  این عملیات قابل بازگشت نیست.
                </p>
              </div>

              <div className="flex justify-stat gap-2">
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isDeleting && <FiLoader className="animate-spin ml-1" />}
                  {isDeleting ? "در حال حذف..." : "بله، حذف شود"}
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 border text-black border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default PropertyListings;
