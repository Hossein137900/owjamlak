"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  FiLoader,
  FiX,
  FiSave,
  FiEdit,
  FiTrash2,
  FiUpload,
  FiCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { Poster } from "@/types/type";
import imageCompression from "browser-image-compression";
import { jwtDecode } from "jwt-decode";
import {
  isValidNumber,
  isValidPhoneNumber,
  persianToLatinDigits,
} from "@/utils/digitConvertor";
import { ChunkedVideoUploader } from "@/utils/chunkedUpload";

type TokenPayload = {
  id?: string;
  _id?: string;
};

const PosterById: React.FC = () => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    posterId: string | null;
  }>({ isOpen: false, posterId: null });
  const [deleting, setDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Poster>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageUploading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [videoUploading, setVideoUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  console.log(video);

  useEffect(() => {
    const fetchUserPosters = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("لطفا وارد شوید");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/poster/posterByUser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posters");
        }

        const data = await response.json();
        setPosters(data.posters || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "خطا در بارگذاری آگهی‌ها"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosters();

    const handlePosterCreated = () => {
      fetchUserPosters();
    };

    window.addEventListener("posterCreated", handlePosterCreated);

    return () => {
      window.removeEventListener("posterCreated", handlePosterCreated);
    };
  }, []);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const handleDeletePoster = async () => {
    if (!deleteModal.posterId) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("لطفا وارد شوید");
        return;
      }

      const response = await fetch(`/api/poster/${deleteModal.posterId}`, {
        method: "DELETE",
        headers: { token },
      });

      const result = await response.json();

      if (result.success) {
        toast.success("آگهی با موفقیت حذف شد");
        setPosters((prev) =>
          prev.filter((p) => p._id !== deleteModal.posterId)
        );
      } else {
        toast.error(result.message || "خطا در حذف آگهی");
      }
    } catch (error) {
      console.log(error);

      toast.error("خطا در حذف آگهی");
    } finally {
      setDeleting(false);
      setDeleteModal({ isOpen: false, posterId: null });
      document.body.style.overflow = "unset";
    }
  };

  const handleEditPoster = (poster: Poster) => {
    setSelectedPoster(poster);
    setEditFormData(poster);
    setNewImages([]);
    setVideo(null);
    setVideoPreview("");
    setIsEditModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    const numericFields = [
      "buildingDate",
      "area",
      "rooms",
      "floor",
      "totalPrice",
      "pricePerMeter",
      "depositRent",
      "rentPrice",
      "contact",
    ];

    if (type === "checkbox") {
      setEditFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (numericFields.includes(name)) {
      if (!isValidNumber(value)) {
        toast.error("لطفاً فقط اعداد وارد کنید");
        return;
      }
      const convertedValue = persianToLatinDigits(value);
      setEditFormData((prev) => ({
        ...prev,
        [name]: convertedValue,
      }));
    } else if (name === "contact") {
      if (!isValidNumber(value)) {
        toast.error("لطفاً فقط اعداد وارد کنید");
        return;
      }
      const convertedValue = persianToLatinDigits(value);
      if (convertedValue && !isValidPhoneNumber(convertedValue)) {
        toast.error("شماره تماس باید ۱۱ رقم باشد و با ۰۹ شروع شود");
      }
      setEditFormData((prev) => ({
        ...prev,
        [name]: convertedValue,
      }));
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const compressedImages: Poster["images"] = [];

    setUploading(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        let finalFile = file;

        // اگر بیشتر از 100KB بود فشرده‌سازی بشه
        if (file.size > 100 * 1024) {
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
          mainImage: (editFormData.images?.length ?? 0) === 0 && i === 0,
          file: finalFile,
          _id: crypto.randomUUID(),
        } as Poster["images"][0]);

        setProgress(Math.round(((i + 1) / files.length) * 100));
      } catch (err) {
        console.log("خطا در فشرده‌سازی:", err);
        toast.error("خطا در فشرده‌سازی:");
      }
    }

    const updatedImages = [...(editFormData.images || []), ...compressedImages];
    setEditFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));

    setNewImages([]);
    setUploading(false);
  };

  const handleUpdatePoster = async () => {
    if (!selectedPoster) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.removeItem("token");
        toast.error("لطفا وارد شوید");
        return;
      }

      // Validate required fields
      const requiredFields: (keyof Poster)[] = [
        "title",
        "description",
        "buildingDate",
        "area",
        "rooms",
        "parentType",
        "tradeType",
        "location",
        "contact",
      ];

      for (const field of requiredFields) {
        if (!editFormData[field]) {
          throw new Error(`فیلد ${field} الزامی است`);
        }
      }

      // Validate numeric fields
      const numericFields: (keyof Poster)[] = [
        "buildingDate",
        "area",
        "rooms",
        "floor",
        "totalPrice",
        "pricePerMeter",
        "depositRent",
        "rentPrice",
        "contact",
      ];

      for (const field of numericFields) {
        if (
          editFormData[field] &&
          !isValidNumber(String(editFormData[field]))
        ) {
          throw new Error(`فیلد ${field} باید فقط شامل اعداد باشد`);
        }
      }

      // Validate contact
      if (!isValidPhoneNumber(editFormData.contact || "")) {
        toast.error("شماره تماس باید ۱۱ رقم باشد و با ۰۹ شروع شود");

        throw new Error("شماره تماس باید ۱۱ رقم باشد و با ۰۹ شروع شود");
      }

      // Prepare data with converted numbers
      const submitData: Partial<Poster> = {
        ...editFormData,
        buildingDate: editFormData.buildingDate
          ? Number(persianToLatinDigits(String(editFormData.buildingDate)))
          : undefined,
        area: editFormData.area
          ? Number(persianToLatinDigits(String(editFormData.area)))
          : undefined,
        rooms: editFormData.rooms
          ? Number(persianToLatinDigits(String(editFormData.rooms)))
          : undefined,
        floor: editFormData.floor
          ? Number(persianToLatinDigits(String(editFormData.floor)))
          : undefined,
        totalPrice: editFormData.totalPrice
          ? Number(persianToLatinDigits(String(editFormData.totalPrice)))
          : undefined,
        pricePerMeter: editFormData.pricePerMeter
          ? Number(persianToLatinDigits(String(editFormData.pricePerMeter)))
          : undefined,
        depositRent: editFormData.depositRent
          ? Number(persianToLatinDigits(String(editFormData.depositRent)))
          : undefined,
        rentPrice: editFormData.rentPrice
          ? Number(persianToLatinDigits(String(editFormData.rentPrice)))
          : undefined,
        contact: editFormData.contact
          ? persianToLatinDigits(editFormData.contact)
          : undefined,
        images: (editFormData.images || []).map((img) => ({
          url: img.url,
          alt: img.alt,
          mainImage: img.mainImage,
          _id: img._id,
        })), // Remove extra fields like `file`
      };

      const updatedImages = (editFormData.images || []).map((img) => ({
        url: img.url,
        alt: img.alt,
        mainImage: img.mainImage,
        _id: img._id,
      }));

      const hasNewImages = (editFormData.images || []).some(
        (img: Poster["images"][0] & { file?: File }) => img.file
      );

      if (hasNewImages) {
        // Use FormData for new image uploads
        const formData = new FormData();
        formData.append("id", selectedPoster._id);

        // Add all form fields
        Object.entries(submitData).forEach(([key, value]) => {
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
        let imageIndex = 0;
        (editFormData.images || []).forEach(
          (img: Poster["images"][0] & { file?: File }) => {
            if (img.file) {
              formData.append("images", img.file);
              formData.append(
                `imageData_${imageIndex}`,
                JSON.stringify({
                  alt: img.alt,
                  mainImage: img.mainImage,
                })
              );
              imageIndex++;
            }
          }
        );

        const response = await fetch(`/api/poster`, {
          method: "PATCH",
          headers: {
            token: token,
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
            token: token,
          },
          body: JSON.stringify({
            id: selectedPoster._id,
            ...submitData,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "خطا در بروزرسانی آگهی");
        }
      }

      // Update posters with validated data
      setPosters((prev) =>
        prev.map((p) =>
          p._id === selectedPoster._id
            ? {
                ...p,
                ...submitData,
                images: updatedImages,
                // Ensure required fields are filled with fallback values
                _id: p._id,
                title: submitData.title || p.title,
                description: submitData.description || p.description,
                buildingDate: submitData.buildingDate || p.buildingDate,
                area: submitData.area || p.area,
                rooms: submitData.rooms || p.rooms,
                parentType: submitData.parentType || p.parentType,
                tradeType: submitData.tradeType || p.tradeType,
                location: submitData.location || p.location,
                contact: submitData.contact || p.contact,
                status: submitData.status || p.status,
                views: p.views,
                createdAt: p.createdAt,
                user: p.user,
              }
            : p
        )
      );

      toast.success("آگهی با موفقیت بروزرسانی شد");
      setIsEditModalOpen(false);
      setEditFormData({});
      setSelectedPoster(null);
      setVideo(null);
      setVideoPreview("");
      document.body.style.overflow = "unset";
    } catch (error) {
      console.log(error);
      toast.error("خطا در بروزرسانی آگهی");
    } finally {
      setIsUpdating(false);
      document.body.style.overflow = "unset";
    }
  };

  const removeExistingImage = async (index: number) => {
    if (!editFormData.images || !selectedPoster) return;

    const imageToDelete = editFormData.images[index];
    const updatedImages = editFormData.images.filter((_, i) => i !== index);

    try {
      // Delete from server if it's an existing image (has URL but no file)
      if (imageToDelete.url && !("file" in imageToDelete)) {
        const response = await fetch("/api/images", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
          },
          body: JSON.stringify({
            posterId: selectedPoster._id,
            imageUrl: imageToDelete.url,
          }),
        });

        if (!response.ok) {
          toast.error("خطا در حذف تصویر از سرور");
          return;
        }
      }

      setEditFormData((prev) => ({ ...prev, images: updatedImages }));
      toast("تصویر حذف شد");
    } catch (error) {
      console.log("Error deleting image:", error);
      toast.error("خطا در حذف تصویر");
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
    if (!selectedPoster) return;

    const file = e.target.files[0];
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
      "video/quicktime",
      "video/hevc",
      "video/HEVC",
      "video/x-matroska",
      "video/mpeg",
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
    setProgress(0);

    try {
      const filename = await ChunkedVideoUploader.uploadVideo({
        file,
        onProgress: (progress) => setProgress(progress),
        onError: (error) => toast.error(error),
      });
      
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
      setEditFormData((prev) => ({
        ...prev,
        video: filename,
      }));
      toast.success("ویدیو با موفقیت آپلود شد");
    } catch (error) {
      console.log("Video upload failed:", error);
      toast.error("خطا در آپلود ویدیو");
    } finally {
      setVideoUploading(false);
      setProgress(0);
    }
  };

  const removeVideo = async () => {
    if (!selectedPoster || !editFormData.video) {
      setVideo(null);
      setVideoPreview("");
      setEditFormData((prev) => ({ ...prev, video: "" }));
      return;
    }

    try {
      const response = await fetch("/api/poster/video", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          posterId: selectedPoster._id,
          filename: editFormData.video,
        }),
      });

      if (response.ok) {
        setVideo(null);
        setVideoPreview("");
        setEditFormData((prev) => ({ ...prev, video: "" }));
        toast.success("ویدیو حذف شد");
      } else {
        toast.error("خطا در حذف ویدیو");
      }
    } catch (error) {
      console.log("Error deleting video:", error);
      toast.error("خطا در حذف ویدیو");
    }
  };

  const isRentType = editFormData.parentType?.includes("Rent") || false;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" p-6"
      >
        <div className="flex items-center justify-center py-12">
          <FiLoader className="animate-spin text-green-600 text-4xl ml-2" />
          <span className="text-gray-600">در حال بارگذاری آگهی‌ها...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
        <p className="text-rose-600 font-medium">{error}</p>
      </div>
    );
  }

  if (posters.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-600 text-lg">آگهی‌ای پیدا نشد</p>
        <p className="text-gray-500 text-sm mt-2">هنوز آگهی‌ای ثبت نکرده‌اید</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="p-4 text-gray-500">
        <h1 className="text-3xl font-bold mb-3">آگهی‌های من</h1>
        <p className="text-gray-600 text-lg">{posters.length} آگهی فعال</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 m-4">
        {posters.map((poster) => {
          const mainImage = poster.images?.find((img) => img.mainImage) ||
            poster.images?.[0] || {
              url: "/assets/images/hero2.png", // مسیر عکس دیفالت
              alt: "پوستر پیش‌فرض",
            };

          return (
            <div
              key={poster._id}
              className="bg-white/90 rounded-md shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1  "
            >
              {mainImage && (
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={mainImage.url}
                    alt={mainImage.alt || poster.title}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}

              <div className="p-4">
                <h3 className="font-bold md:text-base mb-3 text-gray-800 text-sm line-clamp-1">
                  {poster.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FaEye className="text-[#606060]" />
                    <span className="font-medium">
                      {formatPrice(poster.views)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        poster.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {poster.isApproved ? "فعال" : "در انتظار"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400 font-medium">
                    تاریخ ثبت :
                    {new Date(poster.createdAt).toLocaleDateString("fa-IR")}
                  </div>

                  <div className="flex gap-2">
                    {poster.isApproved && (
                      <Link href={`/poster/${poster._id}`} target="_blank">
                        <button className="text-green-500 border rounded-md px-2 py-2   text-xs font-semibold cursor-pointer transition-all duration-300 hover:scale-105  ">
                          <FaEye className="text-xs " />
                        </button>
                      </Link>
                    )}

                    <button
                      onClick={() => handleEditPoster(poster)}
                      className="text-blue-600 px-2 py-2 border rounded-md  text-xs font-semibold cursor-pointer transition-all duration-300 hover:scale-105 flex items-center gap-1"
                    >
                      <FiEdit className="text-xs" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteModal({ isOpen: true, posterId: poster._id });
                        document.body.style.overflow = "hidden";
                      }}
                      className="text-red-600 px-2 py-2 border rounded-md  text-xs font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedPoster && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-800 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">ویرایش آگهی</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditFormData({});
                  setSelectedPoster(null);
                  document.body.style.overflow = "unset";
                }}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdatePoster();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="col-span-2 lg:col-span-1">
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

                  <div className="col-span-2 lg:col-span-1">
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
                      <option value="Office"> اداری</option>
                      <option value="Shop">مغازه</option>
                      <option value="industrial">صنعتی</option>
                      <option value="partnerShip">مشارکت</option>
                      <option value="preSale">پیش فروش</option>
                    </select>
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاریخ ساخت *
                    </label>
                    <input
                      type="text"
                      name="buildingDate"
                      value={editFormData.buildingDate || ""}
                      onChange={handleEditFormChange}
                      required
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      متراژ (متر مربع) *
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={editFormData.area || ""}
                      onChange={handleEditFormChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تعداد اتاق *
                    </label>
                    <input
                      type="text"
                      name="rooms"
                      value={editFormData.rooms || ""}
                      onChange={handleEditFormChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      طبقه
                    </label>
                    <input
                      type="text"
                      name="floor"
                      value={editFormData.floor || ""}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {!isRentType ? (
                    <>
                      <div className="col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          قیمت کل (تومان) *
                        </label>
                        <input
                          type="text"
                          name="totalPrice"
                          value={editFormData.totalPrice || ""}
                          onChange={handleEditFormChange}
                          required={!isRentType}
                          min="0"
                          className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          قیمت هر متر (تومان)
                        </label>
                        <input
                          type="text"
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
                      <div className="col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          مبلغ ودیعه (تومان) *
                        </label>
                        <input
                          type="text"
                          name="depositRent"
                          value={editFormData.depositRent || ""}
                          onChange={handleEditFormChange}
                          required={isRentType}
                          min="0"
                          className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          اجاره ماهانه (تومان) *
                        </label>
                        <input
                          type="text"
                          name="rentPrice"
                          value={editFormData.rentPrice || ""}
                          onChange={handleEditFormChange}
                          required={isRentType}
                          min="0"
                          className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      آدرس *
                    </label>
                    <textarea
                      name="location"
                      value={editFormData.location || ""}
                      onChange={handleEditFormChange}
                      required
                      rows={2}
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شماره تماس *
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={editFormData.contact || ""}
                      onChange={handleEditFormChange}
                      required
                      className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
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

                  {/* Image Upload */}
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
                        </label>

                        {/* Progress bar */}
                        {uploading && (
                          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                            <div
                              className="bg-[#01ae9b]  h-3 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>

                      {newImages.length > 0 && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center text-sm text-green-700">
                            <FiCheck className="w-4 h-4 ml-2" />
                            {newImages.length} تصویر آماده آپلود
                          </div>
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
                          src={`/api/poster/video/${userId || "user"}/${
                            editFormData.video
                          }`}
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
                            {progress > 0 && (
                              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                                <div
                                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                ></div>
                                <p className="text-xs text-center mt-1">{progress}%</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="col-span-2">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      امکانات
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditFormData({});
                      setSelectedPoster(null);
                      document.body.style.overflow = "unset";
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

      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-800 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setDeleteModal({ isOpen: false, posterId: null });
              document.body.style.overflow = "unset";
            }}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              حذف آگهی
            </h3>
            <p className="text-gray-600 text-center mb-6">
              آیا از حذف این آگهی مطمئن هستید؟ این عمل قابل بازگشت نیست.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModal({ isOpen: false, posterId: null });
                  document.body.style.overflow = "unset";
                }}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                انصراف
              </button>
              <button
                onClick={handleDeletePoster}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <FiLoader className="animate-spin" />
                    در حال حذف...
                  </>
                ) : (
                  "حذف آگهی"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosterById;
