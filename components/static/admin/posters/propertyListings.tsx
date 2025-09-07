import { useEffect, useState } from "react";
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
  FiUpload,
  FiCheck,
} from "react-icons/fi";
import imageCompression from "browser-image-compression";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  id?: string;
  _id?: string;
};

import Image from "next/image";
import { Poster } from "@/types/type";
import LocationPicker from "../../ui/locationPicker";

interface ImageItem {
  alt: string;
  url: string;
  mainImage: boolean;
  file?: File; // optional because existing images may not have `file`
  _id: string;
}

const PropertyListings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Poster | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"approve" | "decline">(
    "approve"
  );
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);
  // Edit form state
  const [editFormData, setEditFormData] = useState<
    Partial<Poster> & {
      images?: Array<
        | Poster["images"][0]
        | { alt: string; url: string; mainImage: boolean; file: File }
      >;
    }
  >({});
  const [newImages, setNewImages] = useState<ImageItem[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [video, setVideo] = useState<File | null>(null);
  console.log(video)
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [videoUploading, setVideoUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
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
        ...(searchTerm ? { query: searchTerm } : {}),
      });
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/poster?${query.toString()}`, {
        headers: {
          "x-admin-request": "true",
          token: token || "",
        },
      });
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const idFromToken = decoded.id ?? decoded._id ?? null;
      setUserId(idFromToken);
    } catch (err) {
      console.log("Invalid token:", err);
      setUserId(null);
    }
  }, []);

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
    document.body.style.overflow = "hidden";
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
      contact: property.contact || "",
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
      images: property.images,
      video: property.video,
    });
    setNewImages([]);
    setVideo(null);
    setVideoPreview("");
    setIsEditModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleDeleteClick = (property: Poster) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
    document.body.style.overflow = "hidden";
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
        document.body.style.overflow = "unset";
        document.body.style.overflow = "unset";
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

  const handleApprovalClick = (
    property: Poster,
    action: "approve" | "decline"
  ) => {
    setSelectedProperty(property);
    setApprovalAction(action);
    setIsApprovalModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleApprovalConfirm = async () => {
    if (!selectedProperty) return;

    setIsProcessingApproval(true);
    try {
      const response = await fetch("/api/poster/approve", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedProperty._id,
          action: approvalAction,
        }),
      });

      if (response.ok) {
        fetchData();
        setIsApprovalModalOpen(false);
        setSelectedProperty(null);
        document.body.style.overflow = "unset";
        toast.success(
          approvalAction === "approve" ? "آگهی تایید شد" : "آگهی رد شد"
        );
      } else {
        toast.error("خطا در بروزرسانی وضعیت");
      }
    } catch (error) {
      console.error("Error updating approval status:", error);
      toast.error("خطا در بروزرسانی وضعیت");
    } finally {
      setIsProcessingApproval(false);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const compressedImages: typeof editFormData.images = [];

    setImageUploading(true);
    setImageProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        let finalFile = file;

        if (file.size > 500 * 1024) {
          // اگر بزرگتر از 100KB
          const options = {
            maxSizeMB: 0.1,
            maxWidthOrHeight: 1280,
            fileType: "image/webp",
            useWebWorker: true,
          };
          finalFile = await imageCompression(file, options);
        }

        compressedImages.push({
          alt: `تصویر ${(editFormData.images?.length || 0) + i + 1}`,
          url: URL.createObjectURL(finalFile),
          mainImage:
            (!editFormData.images || editFormData.images.length === 0) &&
            i === 0,
          file: finalFile,
          _id: crypto.randomUUID(),
        });

        setImageProgress(Math.round(((i + 1) / files.length) * 100));
      } catch (err) {
        console.error("خطا در فشرده‌سازی تصویر:", err);
        toast.error("مشکلی در پردازش تصویر پیش آمد");
      }
    }

    const updatedImages = [...(editFormData.images || []), ...compressedImages];
    setEditFormData((prev) => ({ ...prev, images: updatedImages }));
    setNewImages(compressedImages);
    setImageUploading(false);
  };

  const removeExistingImage = async (index: number) => {
    if (!editFormData.images || !selectedProperty) return;
    
    const imageToDelete = editFormData.images[index];
    const updatedImages = editFormData.images.filter((_, i) => i !== index);
    
    try {
      // Delete from server if it's an existing image (has URL but no file)
      if (imageToDelete.url && !('file' in imageToDelete)) {
        const response = await fetch('/api/images', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token') || ''
          },
          body: JSON.stringify({
            posterId: selectedProperty._id,
            imageUrl: imageToDelete.url
          })
        });
        
        if (!response.ok) {
          toast.error('خطا در حذف تصویر از سرور');
          return;
        }
      }
      
      setEditFormData((prev) => ({ ...prev, images: updatedImages }));
      toast.success('تصویر حذف شد');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('خطا در حذف تصویر');
    }
  };

  const setMainImage = (index: number) => {
    const updatedImages =
      editFormData.images?.map((img, i) => ({
        ...img,
        mainImage: i === index,
      })) || [];
    setEditFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("فرمت ویدیو مجاز نیست");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("حجم ویدیو نباید بیشتر از 50 مگابایت باشد");
      return;
    }

    setVideoUploading(true);

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("posterId", selectedProperty?._id || "");

      const response = await fetch("/api/poster/video", {
        method: "POST",
        headers: {
          token: localStorage.getItem("token") || "",
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setVideo(file);
        setVideoPreview(URL.createObjectURL(file));
        setEditFormData((prev) => ({
          ...prev,
          video: result.filename,
        }));
        toast.success("ویدیو با موفقیت آپلود شد");
      } else {
        toast.error(result.message || "خطا در آپلود ویدیو");
      }
    } catch (error) {
      console.error("Video upload failed:", error);
      toast.error("خطا در آپلود ویدیو");
    } finally {
      setVideoUploading(false);
    }
  };

  const removeVideo = async () => {
    if (!selectedProperty || !editFormData.video) {
      setVideo(null);
      setVideoPreview("");
      setEditFormData((prev) => ({ ...prev, video: "" }));
      return;
    }

    try {
      const response = await fetch('/api/poster/video', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({
          posterId: selectedProperty._id,
          filename: editFormData.video
        })
      });

      if (response.ok) {
        setVideo(null);
        setVideoPreview("");
        setEditFormData((prev) => ({ ...prev, video: "" }));
        toast.success('ویدیو حذف شد');
      } else {
        toast.error('خطا در حذف ویدیو');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('خطا در حذف ویدیو');
    }
  };

  const handleUpdatePoster = async () => {
    if (!editFormData._id) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const hasNewImages = newImages && newImages.length > 0;

      if (hasNewImages) {
        // Use FormData for new image uploads
        const formData = new FormData();
        formData.append("id", selectedProperty?._id || "");

        // Add all form fields
        Object.entries(editFormData).forEach(([key, value]) => {
          if (
            key !== "images" &&
            key !== "_id" &&
            value !== undefined &&
            value !== null
          ) {
            if (typeof value === "object") {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });

        // Add new image files
        newImages.forEach((img, index) => {
          if (img.file) {
            formData.append("images", img.file);
            formData.append(
              `imageData_${index}`,
              JSON.stringify({
                alt: img.alt,
                mainImage: img.mainImage,
              })
            );
          }
        });

        const response = await fetch(`/api/poster`, {
          method: "PATCH",
          headers: {
            token: token || "",
          },
          body: formData,
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "خطا در بروزرسانی آگهی");
        }
      } else {
        // Use JSON for updates without new images
        const response = await fetch(`/api/poster`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            token: token || "",
          },
          body: JSON.stringify({
            id: selectedProperty?._id,
            ...editFormData,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "خطا در بروزرسانی آگهی");
        }
      }

      toast.success("آگهی با موفقیت بروزرسانی شد");
      fetchData();
      setIsEditModalOpen(false);
      setSelectedProperty(null);
      setEditFormData({});
      setNewImages([]);
      setVideo(null);
      setVideoPreview("");
      document.body.style.overflow = "unset";
    } catch (error: unknown) {
      console.log("Error updating poster:", error);
      toast.error("خطا در بروزرسانی آگهی");
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

    const firstImage = images.find((image) => image.mainImage);
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
    setPage(1);
    fetchData();
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4   mb-6">
        <h1 className="text-base text-nowrap font-bold text-gray-800 ">
          مدیریت آگهی‌های ملک ({" "}
          <span className="text-gray-600">{posters.length || 0} </span> مورد )
        </h1>
        {/* Filters - Same as before */}
        <div className="flex   flex-col md:flex-row gap-3">
          <form onSubmit={handleSearch} className="relative flex">
            <input
              type="text"
              placeholder="جستجو در عنوان و توضیحات..."
              className="w-full sm:w-64 text-gray-900 placeholder:text-gray-400 pl-12 pr-4 py-2 rounded-r-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="px-3 py-2  text-emerald-500 rounded-l-lg border border-green-600 hover:bg-gray-200 transition-colors"
              title="جستجو"
            >
              <FiSearch className="w-4 h-4" />
            </button>
          </form>
          <div className="relative">
            <select
              className="border  w-full border-gray-400 text-black rounded-lg px-3 py-2"
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
              <span className="text-gray-600">درحال بارگذاری</span>
            </div>
          )}

          <div className="relative">
            <select
              className="border  w-full border-gray-400 text-black rounded-lg px-3 py-2"
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
                className=" py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                تایید
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
                  <td className=" py-4  pl-6">
                    <div className="text-sm text-gray-500 max-w-xs  ">
                      {property.location.slice(0, 30) || "موقعیت نامشخص"}
                    </div>
                 
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
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          property.isApproved
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {property.isApproved ? "تایید شده" : "در انتظار"}
                      </span>
                      <div className="flex gap-1">
                        {!property.isApproved && (
                          <button
                            onClick={() =>
                              handleApprovalClick(property, "approve")
                            }
                            className="text-green-600 hover:text-green-900 transition-colors p-1 rounded"
                            title="تایید"
                          >
                            ✓
                          </button>
                        )}
                        {property.isApproved && (
                          <button
                            onClick={() =>
                              handleApprovalClick(property, "decline")
                            }
                            className="text-red-600 hover:text-red-900 transition-colors p-1 rounded"
                            title="رد"
                          >
                            ✗
                          </button>
                        )}
                      </div>
                    </div>
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
                <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                  هیچ آگهی‌ای یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-90000 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">ویرایش آگهی</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditFormData({});
                  document.body.style.overflow = "unset";
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
                <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
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
                  <div className="col-span-2">
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
                  <div className="col-span-2">
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
                  <div className="col-span-2">
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
                  <div className="col-span-2">
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
                  <div className="col-span-2">
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
                  <div className="col-span-2">
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
                      <div className="col-span-2"> 
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
                      <div className="col-span-2">
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
                  <div className="col-span-2">
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

                  {/* Images Section */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      تصاویر
                    </h3>

                    {editFormData.images && editFormData.images.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          تصاویر موجود
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {editFormData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <Image
                                src={image.url}
                                alt={image.alt}
                                width={100}
                                height={100}
                                className="w-full h-20 object-cover rounded-lg border"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setMainImage(index)}
                                  className={`px-2 py-1 text-xs rounded ${
                                    image.mainImage
                                      ? "bg-green-600 text-white"
                                      : "bg-white text-gray-700"
                                  }`}
                                >
                                  {image.mainImage ? "اصلی" : "انتخاب"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeExistingImage(index)}
                                  className="p-1 absolute top-1 right-1 bg-red-600 text-white rounded"
                                >
                                  <FiTrash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        افزودن تصاویر جدید
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          id="imageUpload"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="imageUpload"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500 mb-1">
                            برای آپلود تصاویر کلیک کنید
                          </span>
                          <span className="text-xs text-gray-400">
                            یا فایلها را اینجا رها کنید
                          </span>
                        </label>
                      </div>
                      {/* Progress Bar */}
                      {imageUploading && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-blue-600 h-3 transition-all duration-300"
                            style={{ width: `${imageProgress}%` }}
                          ></div>
                        </div>
                      )}

                      {/* Ready Images */}
                      {newImages.length > 0 && !imageUploading && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center text-sm text-green-700">
                          <FiCheck className="w-4 h-4 ml-2" />{" "}
                          {newImages.length} تصویر آماده آپلود
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Video Upload */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      ویدیو (اختیاری)
                    </h3>

                    {editFormData.video && !videoPreview && (
                      <div className="mb-4">
                        <video
                          src={`/api/poster/video/${userId || 'user'}/${editFormData.video}`}
                          controls
                          className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          حذف ویدیو
                        </button>
                      </div>
                    )}

                    {videoPreview && (
                      <div className="mb-4 relative">
                        <video
                          src={videoPreview}
                          controls
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    )}

                    {!videoPreview && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
                        <input
                          type="file"
                          id="videoUpload"
                          accept="video/mp4,video/webm,video/ogg,video/avi,video/mov"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="videoUpload"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">
                            برای آپلود ویدیو کلیک کنید (حداکثر 50MB)
                          </span>
                        </label>

                        {videoUploading && (
                          <div className="mt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-2">
                              در حال آپلود ویدیو...
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Amenities Section */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      امکانات
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                <div className="mt-8 flex justify-start gap-3">
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
                    disabled={isUpdating || imageUploading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isUpdating || imageUploading ? (
                      <>
                        <FiLoader className="animate-spin ml-2" />
                        {imageUploading
                          ? "در حال آپلود تصاویر..."
                          : "در حال بروزرسانی..."}
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
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-90000 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg text-black shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">جزئیات آگهی</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  document.body.style.overflow = "unset";
                }}
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
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-90000 p-4">
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
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    document.body.style.overflow = "unset";
                  }}
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

      {/* Approval Confirmation Modal */}
      {isApprovalModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <FiAlertCircle
                    className={`h-6 w-6 ${
                      approvalAction === "approve"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
                <div className="mr-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {approvalAction === "approve" ? "تایید آگهی" : "رد آگهی"}
                  </h3>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  {approvalAction === "approve"
                    ? "آیا از تایید آگهی زیر اطمینان دارید؟"
                    : "آیا از رد آگهی زیر اطمینان دارید؟"}
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
                          target.src = "/assets/images/hero4.jpg";
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-start gap-2">
                <button
                  onClick={handleApprovalConfirm}
                  disabled={isProcessingApproval}
                  className={`px-4 py-2 text-white rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                    approvalAction === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isProcessingApproval && (
                    <FiLoader className="animate-spin ml-1" />
                  )}
                  {isProcessingApproval
                    ? "در حال پردازش..."
                    : approvalAction === "approve"
                    ? "بله، تایید شود"
                    : "بله، رد شود"}
                </button>
                <button
                  onClick={() => {
                    setIsApprovalModalOpen(false);
                    document.body.style.overflow = "unset";
                  }}
                  disabled={isProcessingApproval}
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
