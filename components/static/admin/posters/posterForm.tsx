"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";

const PosterForm = ({}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [images, setImages] = useState<
    { alt: string; url: string; mainImage: boolean }[]
  >([]);

  // Form state - Updated to match models/poster.ts
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buildingDate: "",
    area: "",
    rooms: "",
    propertyType: "",
    tradeType: "",
    totalPrice: "",
    pricePerMeter: "",
    depositRent: "", // For rent deposits
    rentPrice: "", // For monthly rent
    convertible: false, // For convertible deposits
    location: "",
    contact: "",
    storage: false,
    floor: "",
    parking: false,
    lift: false,
    tag: "",
    type: "normal",
    user: "", // Will be set from auth context
  });

  // Load data if in edit mode

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file, index) => ({
        alt: `تصویر ${images.length + index + 1}`,
        url: URL.createObjectURL(file),
        mainImage: images.length === 0 && index === 0, // First image is main by default
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      // If we removed the main image, make the first remaining image main
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
        "propertyType",
        "tradeType",
        "location",
        "contact",
        "tag",
      ];

      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`فیلد ${field} الزامی است`);
        }
      }

      // Validate rent-specific fields
      if (formData.tradeType === "rent" || formData.tradeType === "fullRent") {
        if (!formData.depositRent) {
          throw new Error("مبلغ ودیعه برای اجاره الزامی است");
        }
        if (!formData.rentPrice) {
          throw new Error("مبلغ اجاره ماهانه الزامی است");
        }
      } else {
        // For buy/sell, totalPrice is required
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
        buildingDate: new Date(formData.buildingDate),
        user: "683838a637d65797392334f5",
      };
      console.log(submitData);
      const token = localStorage.getItem("token");

      // Here you would send the data to your API
      const response = await fetch("/api/poster", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("آگهی با موفقیت ایجاد شد");
        toast.success("آگهی با موفقیت ایجاد شد");
      } else {
        toast.error("آگهی با موفقیت ایجاد نشد");
        throw new Error(result.message || "خطا در ثبت آگهی");
      }
    } catch (err) {
      console.log(err);
      // setError(err.message || "خطا در ثبت آگهی. لطفا دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if trade type is rent-related
  const isRentType =
    formData.tradeType === "rent" || formData.tradeType === "fullRent";

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
      <div className="my-6 bg-green-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-800 mb-2">
          راهنمای تکمیل فرم:
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• فیلدهای دارای علامت (*) الزامی هستند</li>
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
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
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
                      <FiX className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMainImage(index)}
                      className={`absolute bottom-1 left-1 px-2 py-1 text-xs rounded ${
                        image.mainImage
                          ? "bg-blue-500 text-white"
                          : "bg-gray-500 text-white opacity-0 group-hover:opacity-100"
                      } transition-opacity`}
                    >
                      {image.mainImage ? "اصلی" : "انتخاب"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Property Type */}
          <div>
            <label
              htmlFor="propertyType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              نوع ملک *
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">انتخاب کنید</option>
              <option value="residential">مسکونی</option>
              <option value="commercial">تجاری</option>
              <option value="administrative">اداری</option>
              <option value="industrial">صنعتی</option>
              <option value="old">قدیمی</option>
            </select>
          </div>

          {/* Trade Type */}
          <div>
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
              <option value="buy">خرید</option>
              <option value="sell">فروش</option>
              <option value="rent">اجاره</option>
              <option value="fullRent">اجاره کامل</option>
              <option value="mortgage">رهن</option>
            </select>
          </div>

          {/* Building Date */}
          <div>
            <label
              htmlFor="buildingDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              تاریخ ساخت *
            </label>
            <input
              type="date"
              id="buildingDate"
              name="buildingDate"
              value={formData.buildingDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Area */}
          <div>
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
          <div>
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
          <div>
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

          {/* Conditional Price Fields based on Trade Type */}
          {!isRentType ? (
            <>
              {/* Total Price for Buy/Sell */}
              <div>
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
              <div>
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

          {/* Location */}
          <div className="col-span-2">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              آدرس *
            </label>
            <textarea
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
          <div>
            <label
              htmlFor="tag"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              برچسب *
            </label>
            <select
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">انتخاب کنید</option>
              <option value="فروش">فروش</option>
              <option value="اجاره">اجاره</option>
              <option value="رهن">رهن</option>
              <option value="ویژه">ویژه</option>
              <option value="فوری">فوری</option>
            </select>
          </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            </div>
          </div>

          {/* Investment Information */}
          {formData.type === "investment" && (
            <div className="col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-yellow-800 mb-2">
                اطلاعات سرمایه‌گذاری
              </h4>
              <p className="text-sm text-yellow-700">
                این آگهی به عنوان فرصت سرمایه‌گذاری ثبت خواهد شد و با نشان ویژه
                نمایش داده می‌شود.
              </p>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="mt-8 flex justify-start gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                در حال ثبت...
              </>
            ) : (
              "ثبت آگهی"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PosterForm;
