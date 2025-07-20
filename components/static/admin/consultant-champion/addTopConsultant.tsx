"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ConsultantFormData {
  name: string;
  title: string;
  description: string;
  rating: number;
  totalSales: number;
  isTopConsultant: boolean;
  avatar: string;
  phone?: string;
  email?: string;
  experienceYears?: number;
}

const CreateConsultantForm: React.FC = () => {
  const [formData, setFormData] = useState<ConsultantFormData>({
    name: "",
    title: "",
    description: "",
    rating: 0,
    totalSales: 0,
    isTopConsultant: false,
    avatar: "",
    phone: "",
    email: "",
    experienceYears: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    const type = target.type;
    const checked = target instanceof HTMLInputElement ? target.checked : false;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(val) || undefined : val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("خطا در ارسال اطلاعات.");

      setMessage("✅ مشاور با موفقیت ایجاد شد!");
      setFormData({
        name: "",
        title: "",
        description: "",
        rating: 0,
        totalSales: 0,
        isTopConsultant: false,
        avatar: "",
        phone: "",
        email: "",
        experienceYears: 0,
      });
    } catch (err) {
      setMessage("❌ ایجاد مشاور ناموفق بود.");
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
        ثبت مشاور برتر
      </motion.h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 space-y-10"
      >
        {/* Personal Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-black font-medium mb-1">
              نام
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="مثلاً محمد رضایی"
              className="w-full text-black p-3 border border-gray-300 focus:outline-none focus:border-[#01ae9b] focus:border rounded-xl"
            />
          </div>

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
              placeholder="مثلاً مشاور املاک  "
              className="w-full text-black p-3 border border-gray-300 focus:outline-none focus:border-[#01ae9b] focus:border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm text-black font-medium mb-1">
              تلفن تماس (اختیاری)
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="مثلاً 09121234567"
              className="w-full text-black p-3 border border-gray-300 focus:outline-none focus:border-[#01ae9b] focus:border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm text-black font-medium mb-1">
              ایمیل (اختیاری)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full text-black p-3 border border-gray-300 focus:outline-none focus:border-[#01ae9b] focus:border rounded-xl"
            />
          </div>
        </div>

        {/* Professional Info */}
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
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              min={0}
              placeholder="مثلاً 5"
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

        {/* Avatar + Top Consultant */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-black font-medium mb-1">
              لینک تصویر آواتار
            </label>
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full text-black p-3 border border-gray-300 focus:outline-none focus:border-[#01ae9b] focus:border rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 mt-7">
            <input
              type="checkbox"
              name="isTopConsultant"
              checked={formData.isTopConsultant}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="text-sm text-black">مشاور برتر است؟</label>
          </div>
        </div>

        {/* Submit */}
        {message && (
          <p
            className={`text-center text-sm ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.03 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 text-white bg-purple-600 rounded-xl font-semibold hover:bg-purple-700 transition"
        >
          {loading ? "در حال ارسال..." : "ایجاد مشاور"}
        </motion.button>
      </form>
    </section>
  );
};

export default CreateConsultantForm;
