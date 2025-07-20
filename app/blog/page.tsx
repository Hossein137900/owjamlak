"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BlogCard from "../components/BlogCard";
import { toast } from "react-hot-toast";

interface Blog {
  _id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  readTime: number;
  userId: {
    name?: string;
    username?: string;
  };
  createdAt: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "readTime">(
    "newest"
  );

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blog");
      const data = await response.json();

      if (response.ok) {
        setBlogs(data.blogs);
      } else {
        toast.error("خطا در دریافت بلاگ‌ها");
      }
    } catch (error) {
      console.log("Error fetching blogs:", error);
      toast.error("خطا در دریافت بلاگ‌ها");
    } finally {
      setLoading(false);
    }
  };

  // Get all unique tags
  const allTags = [...new Set(blogs.flatMap((blog) => blog.tags))];

  // Filter and sort blogs
  const filteredAndSortedBlogs = blogs
    .filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || blog.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "readTime":
          return a.readTime - b.readTime;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">وبلاگ املاک</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            آخرین مقالات و اخبار دنیای املاک و مستغلات
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در بلاگ‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-4 text-gray-400"></i>
            </div>

            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">همه برچسب‌ها</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "oldest" | "readTime")
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">جدیدترین</option>
              <option value="oldest">قدیمی‌ترین</option>
              <option value="readTime">زمان مطالعه</option>
            </select>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {blogs.length}
            </div>
            <div className="text-gray-600">کل مقالات</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {allTags.length}
            </div>
            <div className="text-gray-600">برچسب‌های مختلف</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round(
                blogs.reduce((acc, blog) => acc + blog.readTime, 0) /
                  blogs.length
              ) || 0}
            </div>
            <div className="text-gray-600">میانگین زمان مطالعه (دقیقه)</div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        {filteredAndSortedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedBlogs.map((blog, index) => (
              <BlogCard key={blog._id} blog={blog} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              هیچ بلاگی یافت نشد
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedTag
                ? "لطفا فیلترهای جستجو را تغییر دهید"
                : "هنوز هیچ بلاگی منتشر نشده است"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
