import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiMapPin,
  FiSave,
} from "react-icons/fi";
import Image from "next/image";
import { Poster } from "@/types/type";
import LocationPicker from "../../ui/locationPicker";

const PropertyListings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Poster | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  // Edit form state
  const [editFormData, setEditFormData] = useState<Partial<Poster>>({});
  const [posters, setPosters] = useState<Poster[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  // filters
  const [parentType, setParentType] = useState<string>("");
  const [tradeType, setTradeType] = useState<string>("");

  // helper: remove duplicate posters by _id
  const uniqueById = (items: Poster[]) => {
    const map = new Map<string, Poster>();
    items.forEach((item) => map.set(item._id, item));
    return Array.from(map.values());
  };

  const fetchData = async () => {
    if (!hasNextPage && page > 1) return;

    if (page === 1) setLoading(true);
    else setIsFetchingMore(true);

    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(parentType ? { parentType } : {}),
        ...(tradeType ? { tradeType } : {}),
      });

      const res = await fetch(`/api/poster?${query.toString()}`);
      const data = await res.json();

      setHasNextPage(data.pagination.hasNextPage);

      if (page === 1) {
        setPosters(data.posters);
      } else {
        setPosters((prev) => uniqueById([...prev, ...data.posters]));
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [page, parentType, tradeType]);

  // handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      if (
        scrollTop + clientHeight >= scrollHeight - 800 &&
        !isFetchingMore &&
        hasNextPage
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetchingMore, hasNextPage]);

  const handleViewProperty = (property: Poster) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property: Poster) => {
    setSelectedProperty(property);
    setEditFormData({
      _id: property._id,
      title: property.title,
      description: property.description,
      area: property.area,
      rooms: property.rooms,
      parentType: property.parentType, // Changed from propertyType
      tradeType: property.tradeType,
      totalPrice: property.totalPrice,
      pricePerMeter: property.pricePerMeter,
      depositRent: property.depositRent,
      rentPrice: property.rentPrice,
      convertible: property.convertible,
      location: property.location,
      contact: property.contact,
      storage: property.storage,
      floor: property.floor,
      parking: property.parking,
      lift: property.lift,
      tag: property.tag,
      type: property.type,
      status: property.status,
      coordinates: property.coordinates,
      buildingDate: property.buildingDate,
      balcony: property.balcony,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (property: Poster) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProperty) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/poster", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedProperty._id }),
      });

      if (response.ok) {
        fetchData();
        setIsDeleteModalOpen(false);
        setSelectedProperty(null);
        toast.success("آگهی با موفقیت حذف شد");
      } else {
        const errorData = await response.json();
        console.log("Error deleting poster:", errorData);
        toast.error("خطا در حذف آگهی");
      }
    } catch (error) {
      console.log("Error deleting poster:", error);
      toast.error("خطا در حذف آگهی");
    } finally {
      setIsDeleting(false);
    }
  };

  //  this handler function with other handler functions
  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setEditFormData((prev) => ({
      ...prev,
      location: location.address,
      coordinates: {
        lat: location.lat,
        lng: location.lng,
      },
    }));
    setIsLocationPickerOpen(false);
  };

  const handleUpdatePoster = async () => {
    if (!editFormData._id) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/poster", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify({
          id: editFormData._id,
          ...editFormData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("آگهی با موفقیت بروزرسانی شد");
        fetchData();
        setIsEditModalOpen(false);
        setSelectedProperty(null);
        setEditFormData({});
      } else {
        throw new Error(result.message || "خطا در بروزرسانی آگهی");
      }
    } catch (error: any) {
      console.log("Error updating poster:", error);
      toast.error(error.message || "خطا در بروزرسانی آگهی");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setEditFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setEditFormData((prev) => ({ ...prev, [name]: Number(value) || 0 }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatPrice = (price: number) => {
    if (!price || price === 0) return "توافقی";
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      normal: "عادی",
      investment: "سرمایه‌گذاری",
    };
    return types[type] || type;
  };
  const getParentTypeLabel = (parentType: string) => {
    const parentTypes: Record<string, string> = {
      residentialRent: "اجاره مسکونی",
      residentialSale: "فروش مسکونی",
      commercialRent: "اجاره تجاری",
      commercialSale: "فروش تجاری",
      shortTermRent: "اجاره کوتاه مدت",
      ConstructionProject: "پروژه ساختمانی",
    };
    return parentTypes[parentType] || parentType;
  };
  const getTradeTypeLabel = (tradeType: string) => {
    const tradeTypes: Record<string, string> = {
      House: "خانه",
      Villa: "ویلا",
      Old: "کلنگی",
      Office: "دفتر کار",
      Shop: "مغازه",
      industrial: "صنعتی",
      partnerShip: "مشارکت",
      preSale: "پیش فروش",
    };
    return tradeTypes[tradeType] || tradeType;
  };

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      active: "فعال",
      pending: "در انتظار تایید",
      sold: "فروخته شده",
      rented: "اجاره داده شده",
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      sold: "bg-red-100 text-red-800",
      rented: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getFirstImageUrl = (images: Poster["images"]) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return "/assets/images/hero4.jpg";
    }

    const firstImage = images[0];
    if (typeof firstImage === "string") {
      return firstImage;
    }

    if (firstImage && typeof firstImage === "object" && firstImage.url) {
      return firstImage.url;
    }

    return "/assets/images/hero4.jpg";
  };

  const formatCoordinates = (coordinates?: { lat: number; lng: number }) => {
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      return "موقعیت نامشخص";
    }
    return `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Check if trade type is rent-related
  const isRentType =
    editFormData.parentType?.includes("Rent") ||
    editFormData.parentType === "shortTermRent";

  // Loading state
  if (loading) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      {/* Header and Search - Same as before */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800 ">
          مدیریت آگهی‌های ملک ({posters.length || 0} آگهی)
        </h1>
        {/* Filters - Same as before */}
        <div className="flex flex-col md:flex-row gap-3">
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
          <div className="relative">
            <select
              className="border text-black  rounded-lg px-3 py-2"
              value={parentType}
              onChange={(e) => {
                setParentType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">همه‌ نوع آگهی</option>
              <option value="residentialRent">اجاره مسکونی</option>
              <option value="residentialSale">فروش مسکونی</option>
              <option value="commercialRent">اجاره تجاری</option>
              <option value="commercialSale">فروش تجاری</option>
              <option value="shortTermRent">اجاره کوتاه مدت</option>
              <option value="ConstructionProject">پروژه ساختمانی</option>
            </select>
          </div>
          {/* Loading state for first page */}
          {loading && (
            <div className="flex items-center justify-center py-10">
              <FiLoader className="animate-spin text-green-600 text-2xl ml-2" />
              <span className="text-gray-600">در حال بارگذاری...</span>
            </div>
          )}

          <div className="relative">
            <select
              className="border text-black rounded-lg px-3 py-2"
              value={tradeType}
              onChange={(e) => {
                setTradeType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">همه‌ نوع معامله</option>
              <option value="House">خانه</option>
              <option value="Villa">ویلا</option>
              <option value="Old">کلنگی</option>
              <option value="Office">دفتر کار</option>
              <option value="Shop">مغازه</option>
              <option value="industrial">صنعتی</option>
              <option value="partnerShip">مشارکت</option>
              <option value="preSale">پیش‌فروش</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ردیف
              </th>
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
            {posters && posters.length > 0 ? (
              posters.map((property: Poster, index) => (
                <motion.tr
                  key={property._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <td className="px-6 text-black py-4 whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-14 w-14 flex-shrink-0 rounded-md overflow-hidden relative">
                        <Image
                          src={getFirstImageUrl(property.images)}
                          alt={property.title || "تصویر ملک"}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/assets/images/hero4.jpg";
                          }}
                        />
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {property.title || "بدون عنوان"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.area || 0} متر | {property.rooms || 0} خواب
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {property.location.slice(0, 40) || "موقعیت نامشخص"}
                    </div>
                    {property.coordinates?.lat && property.coordinates?.lng && (
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <FiMapPin className="w-3 h-3" />
                        {formatCoordinates(property.coordinates)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {getTypeLabel(property.type || "normal")} /{" "}
                      {getParentTypeLabel(
                        property.parentType || "residentialSale"
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getTradeTypeLabel(property.tradeType || "House")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {property.parentType?.includes("Rent") ||
                      property.parentType === "shortTermRent"
                        ? formatPrice(property.depositRent || 0)
                        : formatPrice(property.totalPrice || 0)}
                    </div>
                    {(property.parentType?.includes("Rent") ||
                      property.parentType === "shortTermRent") &&
                      property.rentPrice && (
                        <div className="text-xs text-gray-500">
                          اجاره: {formatPrice(property.rentPrice)}
                        </div>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        property.status || "pending"
                      )}`}
                    >
                      {getStatusLabel(property.status || "pending")}
                    </span>
                    {property.type === "investment" && (
                      <span className="mr-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        سرمایه‌گذاری
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {property.createdAt
                        ? new Date(property.createdAt).toLocaleDateString(
                            "fa-IR"
                          )
                        : "نامشخص"}
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
                        onClick={() => handleEditProperty(property)}
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
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  هیچ آگهی‌ای یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[70vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">ویرایش آگهی</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditFormData({});
                }}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdatePoster();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      عنوان آگهی *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title || ""}
                      onChange={handleEditFormChange}
                      required
                      className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      توضیحات *
                    </label>
                    <textarea
                      name="description"
                      value={editFormData.description || ""}
                      onChange={handleEditFormChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع ملک *
                    </label>
                    <select
                      name="parentType"
                      value={editFormData.parentType || ""}
                      onChange={handleEditFormChange}
                      required
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="residentialRent">اجاره مسکونی</option>
                      <option value="residentialSale">فروش مسکونی</option>
                      <option value="commercialRent">اجاره تجاری</option>
                      <option value="commercialSale">فروش تجاری</option>
                      <option value="shortTermRent">اجاره کوتاه مدت</option>
                      <option value="ConstructionProject">
                        پروژه ساختمانی
                      </option>
                    </select>
                  </div>

                  {/* Trade Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع معامله *
                    </label>
                    <select
                      name="tradeType"
                      value={editFormData.tradeType || ""}
                      onChange={handleEditFormChange}
                      required
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="House">خانه</option>
                      <option value="Villa">ویلا</option>
                      <option value="Old">کلنگی</option>
                      <option value="Office">دفتر کار</option>
                      <option value="Shop">مغازه</option>
                      <option value="industrial">صنعتی</option>
                      <option value="partnerShip">مشارکت</option>
                      <option value="preSale">پیش فروش</option>
                    </select>
                  </div>

                  {/* Building Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاریخ ساخت *
                    </label>
                    <input
                      type="number"
                      name="buildingDate"
                      value={
                        editFormData.buildingDate
                          ? editFormData.buildingDate
                          : ""
                      }
                      onChange={handleEditFormChange}
                      required
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      متراژ (متر مربع) *
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={editFormData.area || ""}
                      onChange={handleEditFormChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Rooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تعداد اتاق *
                    </label>
                    <input
                      type="number"
                      name="rooms"
                      value={editFormData.rooms || ""}
                      onChange={handleEditFormChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Floor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      طبقه
                    </label>
                    <input
                      type="number"
                      name="floor"
                      value={editFormData.floor || ""}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Conditional Price Fields based on Trade Type */}
                  {!isRentType ? (
                    <>
                      {/* Total Price for Buy/Sell */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          قیمت کل (تومان) *
                        </label>
                        <input
                          type="number"
                          name="totalPrice"
                          value={editFormData.totalPrice || ""}
                          onChange={handleEditFormChange}
                          required={!isRentType}
                          min="0"
                          className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Price Per Meter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          قیمت هر متر (تومان)
                        </label>
                        <input
                          type="number"
                          name="pricePerMeter"
                          value={editFormData.pricePerMeter || ""}
                          onChange={handleEditFormChange}
                          min="0"
                          className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Deposit for Rent */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          مبلغ ودیعه (تومان) *
                        </label>
                        <input
                          type="number"
                          name="depositRent"
                          value={editFormData.depositRent || ""}
                          onChange={handleEditFormChange}
                          required={isRentType}
                          min="0"
                          className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Monthly Rent */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          اجاره ماهانه (تومان) *
                        </label>
                        <input
                          type="number"
                          name="rentPrice"
                          value={editFormData.rentPrice || ""}
                          onChange={handleEditFormChange}
                          required={isRentType}
                          min="0"
                          className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Convertible Deposit */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="convertible"
                          checked={editFormData.convertible || false}
                          onChange={handleEditFormChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="mr-2 block text-sm text-gray-700">
                          ودیعه قابل تبدیل
                        </label>
                      </div>
                    </>
                  )}

                  {/* Location */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      آدرس *
                    </label>
                    <div className="flex gap-2">
                      <textarea
                        name="location"
                        value={editFormData.location || ""}
                        onChange={handleEditFormChange}
                        required
                        rows={2}
                        className="flex-1 px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="آدرس کامل ملک را وارد کنید..."
                      />
                      <button
                        type="button"
                        onClick={() => setIsLocationPickerOpen(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent flex items-center gap-2 whitespace-nowrap"
                      >
                        <FiMapPin className="w-4 h-4" />
                        انتخاب از نقشه
                      </button>
                    </div>
                    {editFormData.coordinates?.lat &&
                      editFormData.coordinates?.lng && (
                        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <span className="flex items-center gap-1">
                            <FiMapPin className="w-3 h-3" />
                            مختصات: {editFormData.coordinates.lat.toFixed(
                              6
                            )}, {editFormData.coordinates.lng.toFixed(6)}
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شماره تماس *
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={editFormData.contact || ""}
                      onChange={handleEditFormChange}
                      required
                      pattern="[0-9]{11}"
                      placeholder="09123456789"
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع آگهی
                    </label>
                    <select
                      name="type"
                      value={editFormData.type || "normal"}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="normal">عادی</option>
                      <option value="investment">سرمایه‌گذاری</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      وضعیت
                    </label>
                    <select
                      name="status"
                      value={editFormData.status || "pending"}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">در انتظار تایید</option>
                      <option value="active">فعال</option>
                      <option value="sold">فروخته شده</option>
                      <option value="rented">اجاره داده شده</option>
                    </select>
                  </div>

                  {/* Amenities Section */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      امکانات
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Storage */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="storage"
                          checked={editFormData.storage || false}
                          onChange={handleEditFormChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="mr-2 block text-sm text-gray-700">
                          انباری
                        </label>
                      </div>

                      {/* Parking */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="parking"
                          checked={editFormData.parking || false}
                          onChange={handleEditFormChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="mr-2 block text-sm text-gray-700">
                          پارکینگ
                        </label>
                      </div>

                      {/* Lift */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="lift"
                          checked={editFormData.lift || false}
                          onChange={handleEditFormChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="mr-2 block text-sm text-gray-700">
                          آسانسور
                        </label>
                      </div>

                      {/* Balcony */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="balcony"
                          checked={editFormData.balcony || false}
                          onChange={handleEditFormChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="mr-2 block text-sm text-gray-700">
                          بالکن
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditFormData({});
                    }}
                    disabled={isUpdating}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isUpdating ? (
                      <>
                        <FiLoader className="animate-spin ml-2" />
                        در حال بروزرسانی...
                      </>
                    ) : (
                      <>
                        <FiSave className="ml-2" />
                        ذخیره تغییرات
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Property Detail Modal */}
      {isModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg text-black shadow-xl max-w-4xl w-full max-h-[70vh] overflow-y-auto"
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
                  src={getFirstImageUrl(selectedProperty.images)}
                  alt={selectedProperty.title || "تصویر ملک"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/assets/images/hero4.jpg";
                  }}
                />
              </div>

              <h2 className="text-xl font-bold mb-4">
                {selectedProperty.title || "بدون عنوان"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">شناسه آگهی</p>
                  <p className="font-medium">{selectedProperty._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">موقعیت</p>
                  <p className="font-medium">
                    {selectedProperty.location || "نامشخص"}
                  </p>
                  {selectedProperty.coordinates?.lat &&
                    selectedProperty.coordinates?.lng && (
                      <p className="text-xs text-gray-400 mt-1">
                        مختصات:{" "}
                        {formatCoordinates(selectedProperty.coordinates)}
                      </p>
                    )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">قیمت</p>
                  <p className="font-medium">
                    {selectedProperty.parentType?.includes("Rent") ||
                    selectedProperty.parentType === "shortTermRent"
                      ? formatPrice(selectedProperty.depositRent || 0)
                      : formatPrice(selectedProperty.totalPrice || 0)}
                  </p>
                  {(selectedProperty.parentType?.includes("Rent") ||
                    selectedProperty.parentType === "shortTermRent") &&
                    selectedProperty.rentPrice && (
                      <p className="text-xs text-gray-500">
                        اجاره ماهانه: {formatPrice(selectedProperty.rentPrice)}
                      </p>
                    )}
                </div>

                <div>
                  <p className="text-sm text-gray-500">نوع / دسته</p>
                  <p className="font-medium">
                    {getTypeLabel(selectedProperty.type || "normal")} /{" "}
                    {getParentTypeLabel(
                      selectedProperty.parentType || "residentialSale"
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTradeTypeLabel(selectedProperty.tradeType || "House")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">متراژ</p>
                  <p className="font-medium">
                    {selectedProperty.area || 0} متر مربع
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">تعداد اتاق</p>
                  <p className="font-medium">
                    {selectedProperty.rooms || 0} خواب
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">طبقه</p>
                  <p className="font-medium">
                    {selectedProperty.floor || "نامشخص"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">وضعیت</p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedProperty.status || "pending"
                    )}`}
                  >
                    {getStatusLabel(selectedProperty.status || "pending")}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">تعداد بازدید</p>
                  <p className="font-medium flex items-center gap-1">
                    <FiEye className="w-4 h-4" />
                    {selectedProperty.views || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">تاریخ ثبت</p>
                  <p className="font-medium">
                    {selectedProperty.createdAt
                      ? new Date(selectedProperty.createdAt).toLocaleDateString(
                          "fa-IR"
                        )
                      : "نامشخص"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">آخرین بروزرسانی</p>
                  <p className="font-medium">
                    {selectedProperty.updatedAt
                      ? new Date(selectedProperty.updatedAt).toLocaleDateString(
                          "fa-IR"
                        )
                      : "نامشخص"}
                  </p>
                </div>
                {selectedProperty.contact && (
                  <div>
                    <p className="text-sm text-gray-500">اطلاعات تماس</p>
                    <p className="font-medium">
                      {selectedProperty.contact} -{" "}
                      {selectedProperty.user?.name || "نامشخص"}
                    </p>
                    {selectedProperty.user?.phone && (
                      <p className="text-sm text-gray-600">
                        {selectedProperty.user.phone}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">امکانات</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProperty.parking && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      پارکینگ
                    </span>
                  )}
                  {selectedProperty.storage && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      انباری
                    </span>
                  )}
                  {selectedProperty.lift && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      آسانسور
                    </span>
                  )}
                  {selectedProperty.balcony && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      بالکن
                    </span>
                  )}
                  {selectedProperty.convertible && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      قابل تبدیل
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">توضیحات</p>
                <p className="text-gray-700 leading-relaxed">
                  {selectedProperty.description || "توضیحاتی ارائه نشده است."}
                </p>
              </div>

              {selectedProperty.images &&
                selectedProperty.images.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">
                      تصاویر ({selectedProperty.images.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {selectedProperty.images.map((image, index) => {
                        const imageUrl =
                          typeof image === "string" ? image : image.url;
                        const imageAlt =
                          typeof image === "string"
                            ? `تصویر ${index + 1}`
                            : image.alt;

                        return (
                          <div
                            key={index}
                            className="relative h-20 rounded-md overflow-hidden"
                          >
                            <Image
                              src={imageUrl || "/assets/images/hero4.jpg"}
                              alt={imageAlt || `تصویر ${index + 1}`}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/assets/images/hero4.jpg";
                              }}
                            />
                            {typeof image === "object" && image.mainImage && (
                              <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">
                                اصلی
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Location Map Link */}
              {selectedProperty.coordinates?.lat &&
                selectedProperty.coordinates?.lng && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">
                      موقعیت جغرافیایی
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const googleMapsUrl = `https://www.google.com/maps?q=${
                            selectedProperty.coordinates!.lat
                          },${selectedProperty.coordinates!.lng}`;
                          window.open(googleMapsUrl, "_blank");
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Google Maps
                      </button>
                      <button
                        onClick={() => {
                          const neshanUrl = `https://neshan.org/maps/search#c${
                            selectedProperty.coordinates!.lat
                          }-${selectedProperty.coordinates!.lng}-17z-0p`;
                          window.open(neshanUrl, "_blank");
                        }}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                      >
                        نشان
                      </button>
                    </div>
                  </div>
                )}

              <div className="flex justify-start gap-3">
                <button
                  onClick={() => {
                    window.open(`/poster/${selectedProperty._id}`, "_blank");
                  }}
                  className="px-4 py-2 text-nowrap text-xs bg-green-600 text-white rounded-md md:text-sm hover:bg-green-700 transition-colors"
                >
                  مشاهده در سایت
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    handleEditProperty(selectedProperty);
                  }}
                  className="px-4 py-2 text-nowrap text-xs bg-blue-600 text-white rounded-md md:text-sm hover:bg-blue-700 transition-colors"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    handleDeleteClick(selectedProperty);
                  }}
                  className="px-4 py-2 text-nowrap text-xs bg-red-600 text-white rounded-md md:text-sm hover:bg-red-700 transition-colors"
                >
                  حذف
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-nowrap text-xs text-gray-500 border border-gray-300 rounded-md md:text-sm hover:bg-gray-50 transition-colors"
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
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden relative">
                      <Image
                        src={getFirstImageUrl(selectedProperty.images)}
                        alt={selectedProperty.title || "تصویر ملک"}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "/assets/images/placeholder-property.jpg";
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedProperty.title || "بدون عنوان"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedProperty.location || "موقعیت نامشخص"}
                      </p>
                      <p className="text-xs text-gray-500">
                        شناسه: {selectedProperty._id}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-red-600 text-sm mt-2">
                  این عملیات قابل بازگشت نیست.
                </p>
              </div>

              <div className="flex justify-start gap-2">
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

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={
          editFormData.coordinates?.lat && editFormData.coordinates?.lng
            ? {
                lat: editFormData.coordinates.lat,
                lng: editFormData.coordinates.lng,
                address: editFormData.location || "",
              }
            : undefined
        }
      />
    </motion.div>
  );
};

export default PropertyListings;
