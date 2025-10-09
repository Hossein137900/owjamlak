"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiUser, FiArrowLeft } from "react-icons/fi";

interface Blog {
  _id: string;
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  author: string;
  date: string;
  coverImage?: string;
  slug?: string;
}

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog");
        if (response.ok) {
          const data = await response.json();
          setBlogs(data || []);
        }
      } catch (error) {
        console.log("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            آخرین مقالات
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse rounded-xl h-80"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 pt-16 md:px-20" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">آخرین مقالات</h2>
        <p className="text-gray-600">جدیدترین مطالب و اخبار املاک</p>
      </motion.div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {blogs.slice(0, 3).map((blog, index) => (
          <motion.div
            key={blog._id || blog.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48">
              <Image
                src={blog.coverImage || "/assets/images/hero.jpg"}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {truncateText(
                  blog.excerpt || blog.content?.replace(/<[^>]*>/g, "") || "",
                  120
                )}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <FiUser className="w-3 h-3" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-3 h-3" />
                  <span>{blog.date}</span>
                </div>
              </div>
              <Link
                href={`/blogs/${blog.id}`}
                className="inline-flex items-center gap-2 text-[#01ae9b] hover:text-[#66308d] transition-colors text-sm font-medium"
              >
                ادامه مطلب
                <FiArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Swipe */}
      <div className="md:hidden overflow-x-auto">
        <div
          className="flex gap-4 pb-4"
          style={{ width: `${blogs.length * 280}px` }}
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id || blog.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex-shrink-0 w-64"
            >
              <div className="relative h-40">
                <Image
                  src={blog.coverImage || "/assets/images/hero.jpg"}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {truncateText(
                    blog.excerpt || blog.content?.replace(/<[^>]*>/g, "") || "",
                    80
                  )}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <FiUser className="w-3 h-3" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    <span>{blog.date}</span>
                  </div>
                </div>
                <Link
                  href={`/blogs/${blog.id}`}
                  className="inline-flex items-center gap-1 text-[#01ae9b] hover:text-[#66308d] transition-colors text-xs font-medium"
                >
                  ادامه مطلب
                  <FiArrowLeft className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-8"
      >
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#01ae9b] to-[#66308d] text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
        >
          مشاهده همه مقالات
          <FiArrowLeft className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
};

export default LatestBlogs;
