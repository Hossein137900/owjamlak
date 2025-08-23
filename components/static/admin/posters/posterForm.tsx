"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiMapPin,
} from "react-icons/fi";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { jwtDecode } from "jwt-decode";
import imageCompression from "browser-image-compression";
interface ImageItem {
  alt: string;
  url: string;
  mainImage: boolean;
  file: File;
  _id: string;
}

type TokenPayload = {
  id?: string;
  _id?: string;
  exp?: number;
  iat?: number;
};

// Dynamically import LocationPicker to avoid SSR issues
const LocationPicker = dynamic(() => import("../../ui/locationPicker"), {
  ssr: false,
});

const PosterForm = ({}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form state - Updated to match new model structure
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buildingDate: "",
    area: "",
    rooms: "",
    parentType: "", // Changed from propertyType
    tradeType: "",
    totalPrice: "",
    pricePerMeter: "",
    depositRent: "",
    rentPrice: "",
    convertible: false,
    location: "",
    coordinates: {
      lat: 0,
      lng: 0,
    },
    locationDetails: {
      province: "",
      city: "",
      district: "",
      neighborhood: "",
      fullAddress: "",
    },
    contact: "",
    storage: false,
    floor: "",
    parking: false,
    lift: false,
    balcony: false,
    // tag: "",
    type: "normal",
    user: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Enhanced location handler with address parsing
  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    // Parse address to extract location details
    const parseAddress = (address: string) => {
      const parts = address.split(",").map((part) => part.trim());

      // Try to extract meaningful parts from the address
      let province = "";
      let city = "";
      let district = "";
      let neighborhood = "";

      // Look for common patterns in Persian addresses
      parts.forEach((part) => {
        if (
          part.includes("استان") ||
          part.includes("تهران") ||
          part.includes("اصفهان") ||
          part.includes("شیراز")
        ) {
          province = part;
        } else if (part.includes("منطقه") || part.includes("ناحیه")) {
          district = part;
        } else if (part.includes("محله") || part.includes("خیابان")) {
          neighborhood = part;
        }
      });

      // If we can't parse specific parts, use the first few parts
      if (!province && parts.length > 0) {
        province = parts[0];
      }
      if (!city && parts.length > 1) {
        city = parts[1];
      }
      if (!district && parts.length > 2) {
        district = parts[2];
      }
      if (!neighborhood && parts.length > 3) {
        neighborhood = parts[3];
      }

      return {
        province,
        city,
        district,
        neighborhood,
        fullAddress: address,
      };
    };

    const locationDetails = parseAddress(location.address);

    setFormData((prev) => ({
      ...prev,
      location: location.address,
      coordinates: {
        lat: location.lat,
        lng: location.lng,
      },
      locationDetails,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const compressedImages: ImageItem[] = [];

    setUploading(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        let finalFile = file;

        // اگر بالای 100KB بود فشرده کن
        if (file.size > 100 * 1024) {
          const options = {
            maxSizeMB: 0.1, // حدود 100KB
            maxWidthOrHeight: 1280,
            fileType: "image/webp", // تبدیل به WebP برای کاهش حجم
            useWebWorker: true,
          };
          finalFile = await imageCompression(file, options);
        }

        compressedImages.push({
          alt: `تصویر ${images.length + i + 1}`,
          url: URL.createObjectURL(finalFile),
          mainImage: images.length === 0 && i === 0,
          file: finalFile,
          _id: crypto.randomUUID(),
        });

        setProgress(Math.round(((i + 1) / files.length) * 100));
      } catch (err) {
        console.error("خطا در فشرده‌سازی تصویر:", err);
      }
    }

    setImages((prev) => [...prev, ...compressedImages]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      if (prev[index].mainImage && newImages.length > 0) {
        newImages[0].mainImage = true;
      }
      return newImages;
    });
  };

  const setMainImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        mainImage: i === index,
      }))
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<TokenPayload>(token); // ✅
      const idFromToken = decoded.id ?? decoded._id ?? null;
      console.log(idFromToken);
      setUserId(idFromToken);
    } catch (err) {
      console.log("❌ توکن معتبر نیست:", err);
      setUserId(null);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      const requiredFields = [
        "title",
        "description",
        "buildingDate",
        "area",
        "rooms",
        "parentType", // Changed from propertyType
        "tradeType",
        "location",
        "contact",
        // "tag",
      ];

      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`فیلد ${field} الزامی است`);
        }
      }

      // Validate location coordinates
      if (!formData.coordinates.lat || !formData.coordinates.lng) {
        throw new Error("انتخاب موقعیت جغرافیایی الزامی است");
      }

      // Validate rent-specific fields
      const isRentType =
        formData.parentType.includes("Rent") ||
        formData.parentType === "shortTermRent";

      if (isRentType) {
        if (!formData.depositRent) {
          throw new Error("مبلغ ودیعه برای اجاره الزامی است");
        }
        if (!formData.rentPrice) {
          throw new Error("مبلغ اجاره ماهانه الزامی است");
        }
      } else {
        if (!formData.totalPrice) {
          throw new Error("قیمت کل برای خرید/فروش الزامی است");
        }
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        images,
        area: Number(formData.area),
        rooms: Number(formData.rooms),
        floor: formData.floor ? Number(formData.floor) : undefined,
        totalPrice: formData.totalPrice
          ? Number(formData.totalPrice)
          : undefined,
        pricePerMeter: formData.pricePerMeter
          ? Number(formData.pricePerMeter)
          : undefined,
        depositRent: formData.depositRent
          ? Number(formData.depositRent)
          : undefined,
        rentPrice: formData.rentPrice ? Number(formData.rentPrice) : undefined,
        buildingDate: Number(formData.buildingDate),
        user: userId,
        consultant: userId,
        status: "pending",
      };

      console.log(submitData);
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(submitData).forEach(([key, value]) => {
        if (key !== "images") {
          formDataToSend.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : String(value)
          );
        }
      });

      // Add image files
      images.forEach((image, index) => {
        if (image.file) {
          formDataToSend.append("images", image.file);
          formDataToSend.append(
            `imageData_${index}`,
            JSON.stringify({
              alt: image.alt,
              mainImage: image.mainImage,
            })
          );
        }
      });

      const response = await fetch("/api/poster", {
        method: "POST",
        headers: {
          token: token || "",
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("آگهی با موفقیت ایجاد شد");
        toast.success("آگهی با موفقیت ایجاد شد");

        // Trigger event to refresh posterById component
        window.dispatchEvent(new CustomEvent("posterCreated"));
        // Reset form
        setFormData({
          title: "",
          description: "",
          buildingDate: "",
          area: "",
          rooms: "",
          parentType: "", // Changed from propertyType
          tradeType: "",
          totalPrice: "",
          pricePerMeter: "",
          depositRent: "",
          rentPrice: "",
          convertible: false,
          location: "",
          coordinates: { lat: 0, lng: 0 },
          locationDetails: {
            province: "",
            city: "",
            district: "",
            neighborhood: "",
            fullAddress: "",
          },
          contact: "",
          storage: false,
          floor: "",
          parking: false,
          lift: false,
          balcony: false,
          // tag: "",
          type: "normal",
          user: "",
        });
        setImages([]);
      } else {
        toast.error("آگهی با موفقیت ایجاد نشد");
        throw new Error(result.message || "خطا در ثبت آگهی");
      }
    } catch (err: unknown) {
      console.log(err);
      setError("خطا در ثبت آگهی. لطفا دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if parent type is rent-related
  const isRentType =
    formData.parentType.includes("Rent") ||
    formData.parentType === "shortTermRent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h1 className="text-xl font-bold text-gray-800 mb-6">ایجاد آگهی جدید</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <FiAlertCircle className="ml-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <FiCheck className="ml-2 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Form Validation Info */}
      <div className="my-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-800 mb-2">
          راهنمای تکمیل فرم:
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• فیلدهای دارای علامت (*) الزامی هستند</li>
          <li>• انتخاب موقعیت جغرافیایی روی نقشه الزامی است</li>
          <li>• برای آگهی‌های اجاره، مبلغ ودیعه و اجاره ماهانه الزامی است</li>
          <li>• برای آگهی‌های خرید/فروش، قیمت کل الزامی است</li>
          <li>• حداقل یک تصویر برای آگهی آپلود کنید</li>
          <li>• تصویر اول به عنوان تصویر اصلی انتخاب می‌شود</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              عنوان آگهی *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              توضیحات *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Images */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تصاویر
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <FiUpload className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  برای آپلود تصاویر کلیک کنید یا فایل‌ها را اینجا رها کنید
                </span>
              </label>

              {/* Progress Bar */}
              {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={image._id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMainImage(index)}
                      className={`absolute bottom-1 left-1 px-2 py-1 text-xs rounded ${
                        image.mainImage
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 opacity-0 group-hover:opacity-100"
                      } transition-opacity`}
                    >
                      {image.mainImage ? "اصلی" : "انتخاب"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Parent Type (Property Type) */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="parentType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              نوع ملک *
            </label>
            <select
              id="parentType"
              name="parentType"
              value={formData.parentType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">انتخاب کنید</option>
              <option value="residentialRent">اجاره مسکونی</option>
              <option value="residentialSale">فروش مسکونی</option>
              <option value="commercialRent">اجاره تجاری</option>
              <option value="commercialSale">فروش تجاری</option>
              <option value="shortTermRent">اجاره کوتاه مدت</option>
              <option value="ConstructionProject">پروژه ساختمانی</option>
            </select>
          </div>

          {/* Trade Type */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="tradeType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              نوع معامله *
            </label>
            <select
              id="tradeType"
              name="tradeType"
              value={formData.tradeType}
              onChange={handleChange}
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
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="buildingDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              تاریخ ساخت *
            </label>
            <input
              type="number"
              id="buildingDate"
              name="buildingDate"
              value={formData.buildingDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Area */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="area"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              متراژ (متر مربع) *
            </label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Rooms */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="rooms"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              تعداد اتاق *
            </label>
            <input
              type="number"
              id="rooms"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Floor */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="floor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              طبقه
            </label>
            <input
              type="number"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Conditional Price Fields based on Parent Type */}
          {!isRentType ? (
            <>
              {/* Total Price for Buy/Sell */}
              <div className="col-span-2 md:col-span-1">
                <label
                  htmlFor="totalPrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  قیمت کل (تومان) *
                </label>
                <input
                  type="number"
                  id="totalPrice"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleChange}
                  required={!isRentType}
                  min="0"
                  className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Price Per Meter */}
              <div className="col-span-2 md:col-span-1">
                <label
                  htmlFor="pricePerMeter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  قیمت هر متر (تومان)
                </label>
                <input
                  type="number"
                  id="pricePerMeter"
                  name="pricePerMeter"
                  value={formData.pricePerMeter}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          ) : (
            <>
              {/* Deposit for Rent */}
              <div>
                <label
                  htmlFor="depositRent"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  مبلغ ودیعه (تومان) *
                </label>
                <input
                  type="number"
                  id="depositRent"
                  name="depositRent"
                  value={formData.depositRent}
                  onChange={handleChange}
                  required={isRentType}
                  min="0"
                  className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Monthly Rent */}
              <div>
                <label
                  htmlFor="rentPrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  اجاره ماهانه (تومان) *
                </label>
                <input
                  type="number"
                  id="rentPrice"
                  name="rentPrice"
                  value={formData.rentPrice}
                  onChange={handleChange}
                  required={isRentType}
                  min="0"
                  className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Convertible Deposit */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="convertible"
                  name="convertible"
                  checked={formData.convertible}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="convertible"
                  className="mr-2 block text-sm text-gray-700"
                >
                  ودیعه قابل تبدیل
                </label>
              </div>
            </>
          )}

          {/* Location with Enhanced Details */}
          <div className="col-span-2">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              آدرس *
            </label>
            <div className="flex gap-2">
              <textarea
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
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

            {/* Location Details Display */}
            {formData.coordinates.lat !== 0 &&
              formData.coordinates.lng !== 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    جزئیات موقعیت:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    {formData.locationDetails.province && (
                      <div>
                        <span className="font-medium">استان:</span>{" "}
                        {formData.locationDetails.province}
                      </div>
                    )}
                    {formData.locationDetails.city && (
                      <div>
                        <span className="font-medium">شهر:</span>{" "}
                        {formData.locationDetails.city}
                      </div>
                    )}
                    {formData.locationDetails.district && (
                      <div>
                        <span className="font-medium">منطقه:</span>{" "}
                        {formData.locationDetails.district}
                      </div>
                    )}
                    {formData.locationDetails.neighborhood && (
                      <div>
                        <span className="font-medium">محله:</span>{" "}
                        {formData.locationDetails.neighborhood}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 bg-white p-2 rounded">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="w-3 h-3" />
                      مختصات: {formData.coordinates.lat.toFixed(6)},{" "}
                      {formData.coordinates.lng.toFixed(6)}
                    </span>
                  </div>
                </div>
              )}
          </div>

          {/* Manual Location Details (Optional) */}
          <div className="col-span-2">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              جزئیات موقعیت (اختیاری)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="province"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  استان
                </label>
                <input
                  type="text"
                  id="province"
                  value={formData.locationDetails.province}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      locationDetails: {
                        ...prev.locationDetails,
                        province: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="تهران"
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  شهر
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.locationDetails.city}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      locationDetails: {
                        ...prev.locationDetails,
                        city: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="تهران"
                />
              </div>
              <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  منطقه
                </label>
                <input
                  type="text"
                  id="district"
                  value={formData.locationDetails.district}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      locationDetails: {
                        ...prev.locationDetails,
                        district: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="منطقه 5"
                />
              </div>
              <div>
                <label
                  htmlFor="neighborhood"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  محله
                </label>
                <input
                  type="text"
                  id="neighborhood"
                  value={formData.locationDetails.neighborhood}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      locationDetails: {
                        ...prev.locationDetails,
                        neighborhood: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="سعادت آباد"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="fullAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                آدرس کامل
              </label>
              <textarea
                id="fullAddress"
                value={formData.locationDetails.fullAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    locationDetails: {
                      ...prev.locationDetails,
                      fullAddress: e.target.value,
                    },
                  }))
                }
                rows={2}
                className="w-full px-3 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="تهران، سعادت آباد، میدان کاج، برج تجاری پارسیان، طبقه 8"
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              شماره تماس *
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              pattern="[0-9]{11}"
              placeholder="09123456789"
              className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tag */}

          {/* Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              نوع آگهی
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="normal">عادی</option>
              <option value="investment">سرمایه‌گذاری</option>
            </select>
          </div>

          {/* Amenities Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-medium text-gray-800 mb-4">امکانات</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Storage */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="storage"
                  name="storage"
                  checked={formData.storage}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="storage"
                  className="mr-2 block text-sm text-gray-700"
                >
                  انباری
                </label>
              </div>

              {/* Parking */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="parking"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="parking"
                  className="mr-2 block text-sm text-gray-700"
                >
                  پارکینگ
                </label>
              </div>

              {/* Lift */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lift"
                  name="lift"
                  checked={formData.lift}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="lift"
                  className="mr-2 block text-sm text-gray-700"
                >
                  آسانسور
                </label>
              </div>
              {/* balcony */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="balcony"
                  name="balcony"
                  checked={formData.balcony}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="balcony"
                  className="mr-2 block text-sm text-gray-700"
                >
                  بالکن
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-start">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                در حال ثبت...
              </>
            ) : (
              "ثبت آگهی"
            )}
          </button>
        </div>
      </form>

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={
          formData.coordinates.lat !== 0 && formData.coordinates.lng !== 0
            ? {
                lat: formData.coordinates.lat,
                lng: formData.coordinates.lng,
                address: formData.location,
              }
            : undefined
        }
      />
    </motion.div>
  );
};

export default PosterForm;
