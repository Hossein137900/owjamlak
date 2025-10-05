"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface ConsultantUser {
  _id: string;
  name: string;
  phone: string;
}

interface TopConsultantFormData {
  consultant: string;
  name: string;
  phone: string;
  title: string;
  description: string;
  rating: number;
  totalSales: number;
  experience: number;
  rank: number;
  image: string;
}

const CreateTopConsultantForm: React.FC = () => {
  const [consultants, setConsultants] = useState<ConsultantUser[]>([]);
  const [formData, setFormData] = useState<TopConsultantFormData>({
    consultant: "",
    name: "",
    phone: "",
    title: "",
    description: "",
    rating: 0,
    totalSales: 0,
    experience: 0,
    rank: 1,
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      const res = await fetch("/api/consultants/consultantsRole");
      if (res.ok) {
        const data = await res.json();
        setConsultants(data.users || []);
      }
    } catch (error) {
      console.log("Error fetching consultants:", error);
    }
  };

  const handleConsultantSelect = (consultantId: string) => {
    const selected = consultants.find((c) => c._id === consultantId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        consultant: consultantId,
        name: selected.name,
        phone: selected.phone,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "consultant") {
      handleConsultantSelect(value);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return "";

    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch("/api/consultant-champion/image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("خطا در آپلود تصویر");

    const data = await res.json();
    return data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const submitData = { ...formData, image: imageUrl };

      const res = await fetch("/api/consultant-champion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) throw new Error("خطا در ارسال اطلاعات.");

      toast.success(" مشاور برتر با موفقیت ایجاد شد!");
      setFormData({
        consultant: "",
        name: "",
        phone: "",
        title: "",
        description: "",
        rating: 0,
        totalSales: 0,
        experience: 0,
        rank: 1,
        image: "",
      });
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      toast.error("  ایجاد مشاور برتر ناموفق بود.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-full mx-auto pb-16 px-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-right mb-12 text-gray-500"
      >
        ثبت مشاور برتر (3 نفر برتر)
      </motion.h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 space-y-10"
      >
        {/* Consultant Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-black font-medium mb-1">
              انتخاب مشاور
            </label>
            <select
              name="consultant"
              value={formData.consultant}
              onChange={handleChange}
              required
              className="w-full text-black p-3 border border-gray-300 focus:outline-none focus:border-[#01ae9b] focus:border rounded-xl"
            >
              <option value="">انتخاب کنید...</option>
              {consultants.map((consultant) => (
                <option key={consultant._id} value={consultant._id}>
                  {consultant.name} - {consultant.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-black font-medium mb-1">
              رتبه (1-3)
            </label>
            <select
              name="rank"
              value={formData.rank}
              onChange={handleChange}
              required
              className="w-full text-black p-3 border border-gray-300 focus:outline-none focus:border-[#01ae9b] focus:border rounded-xl"
            >
              <option value={1}>رتبه 1 (برترین)</option>
              <option value={2}>رتبه 2</option>
              <option value={3}>رتبه 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-black font-medium mb-1">
              نام
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              className="w-full text-black p-3 border border-gray-300 bg-gray-100 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm text-black font-medium mb-1">
              تلفن
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              readOnly
              className="w-full text-black p-3 border border-gray-300 bg-gray-100 rounded-xl"
            />
          </div>
        </div>

        {/* Professional Info */}
        <div>
          <label className="block text-sm text-black font-medium mb-1">
            عنوان شغلی
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="مثلاً مشاور املاک برتر"
            className="w-full text-black p-3 border border-gray-300 focus:outline-none focus:border-[#01ae9b] focus:border rounded-xl"
          />
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-black font-medium mb-1">
              امتیاز
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min={0}
              max={5}
              step={0.1}
              required
              className="w-full text-black p-3 border border-gray-300 focus:outline-none focus:border-[#01ae9b] focus:border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm text-black font-medium mb-1">
              فروش ماه
            </label>
            <input
              type="number"
              name="totalSales"
              value={formData.totalSales}
              onChange={handleChange}
              min={0}
              required
              className="w-full text-black p-3 border border-gray-300 focus:outline-none focus:border-[#01ae9b] focus:border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm text-black font-medium mb-1">
              سابقه (سال)
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min={0}
              required
              className="w-full text-black p-3 border border-gray-300 focus:outline-none focus:border-[#01ae9b] focus:border rounded-xl"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-black font-medium mb-1">
            توضیحات
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="توضیح کوتاهی درباره مشاور بنویسید..."
            className="w-full text-black p-3 border border-gray-300 focus:outline-none focus:border-[#01ae9b] focus:border rounded-xl"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm text-black font-medium mb-3">
            تصویر مشاور
          </label>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Upload Area */}
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#01ae9b] transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="text-center">
                    <p className="text-sm text-gray-600 font-medium">
                      {imageFile ? imageFile.name : "انتخاب تصویر مشاور"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      فرمت‌های مجاز: JPG, PNG, WEBP
                    </p>
                  </div>
                </label>
              </div>
              {imageFile && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="text-sm">✓</span>
                    <span className="text-sm font-medium">فایل انتخاب شد</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    حجم: {(imageFile.size / 1024 / 1024).toFixed(2)} مگابایت
                  </p>
                </div>
              )}
            </div>

            {/* Preview */}
            {imagePreview && (
              <div className="flex-shrink-0">
                <p className="text-sm text-gray-600 font-medium mb-2">
                  پیش‌نمایش:
                </p>
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="پیش‌نمایش تصویر"
                    className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.03 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 cursor-pointer text-white bg-purple-600 rounded-xl font-semibold hover:bg-purple-700 transition"
        >
          {loading ? "در حال ارسال..." : "ایجاد مشاور برتر"}
        </motion.button>
      </form>
    </section>
  );
};

export default CreateTopConsultantForm;
