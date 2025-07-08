"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface Blog {
  _id: string;
  title: string;
  description: string;
  seoTitle: string;
  content: string;
  image?: string;
  secondImage?: string;
  tags: string[];
  readTime: number;
  userId: {
    _id: string;
    username?: string;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  // Fetch blogs
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
      console.error("Error fetching blogs:", error);
      toast.error("خطا در دریافت بلاگ‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("لطفا مجددا وارد شوید");
        return;
      }

      const response = await fetch("/api/blog/id", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: token,
          id: blogId,
        },
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("بلاگ با موفقیت حذف شد");
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
        setShowDeleteModal(false);
        setBlogToDelete(null);
      } else {
        toast.error(result.message || "خطا در حذف بلاگ");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("خطا در حذف بلاگ");
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          مدیریت بلاگ‌ها
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو در بلاگ‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>

          <button
            onClick={() => (window.location.href = "/addBlog")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            افزودن بلاگ جدید
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <i className="fas fa-blog text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">کل بلاگ‌ها</p>
              <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <i className="fas fa-eye text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">بلاگ‌های فعال</p>
              <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500">
              <i className="fas fa-tags text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">کل برچسب‌ها</p>
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(blogs.flatMap((blog) => blog.tags))].length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  بلاگ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نویسنده
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  برچسب‌ها
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  زمان مطالعه
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ ایجاد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <motion.tr
                  key={blog._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {blog.image && (
                        <img
                          className="h-12 w-12 rounded-lg object-cover ml-4"
                          src={blog.image}
                          alt={blog.title}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {blog.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {stripHtml(blog.content).substring(0, 100)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {blog.userId.name || blog.userId.username || "نامشخص"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{blog.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {blog.readTime} دقیقه
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(blog.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBlog(blog)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="مشاهده جزئیات"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={() =>
                          window.open(`/blog/${blog._id}`, "_blank")
                        }
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="مشاهده در سایت"
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </button>
                      <button
                        onClick={() => {
                          setBlogToDelete(blog._id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="حذف"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-blog text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">
              {searchTerm
                ? "بلاگی با این جستجو یافت نشد"
                : "هنوز بلاگی ایجاد نشده است"}
            </p>
          </div>
        )}
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  جزئیات بلاگ
                </h2>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <div className="space-y-6">
                {/* Images */}
                {(selectedBlog.image || selectedBlog.secondImage) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedBlog.image && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          تصویر اصلی:
                        </p>
                        <img
                          src={selectedBlog.image}
                          alt="تصویر اصلی"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {selectedBlog.secondImage && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          تصویر دوم:
                        </p>
                        <img
                          src={selectedBlog.secondImage}
                          alt="تصویر دوم"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان:
                    </label>
                    <p className="text-gray-900">{selectedBlog.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان سئو:
                    </label>
                    <p className="text-gray-900">{selectedBlog.seoTitle}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات:
                  </label>
                  <p className="text-gray-900">{selectedBlog.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    برچسب‌ها:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedBlog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نویسنده:
                    </label>
                    <p className="text-gray-900">
                      {selectedBlog.userId.name ||
                        selectedBlog.userId.username ||
                        "نامشخص"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      زمان مطالعه:
                    </label>
                    <p className="text-gray-900">
                      {selectedBlog.readTime} دقیقه
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاریخ ایجاد:
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedBlog.createdAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    محتوا:
                  </label>
                  <div
                    className="prose max-w-none border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  بستن
                </button>
                <button
                  onClick={() =>
                    window.open(`/blog/${selectedBlog._id}`, "_blank")
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  مشاهده در سایت
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                حذف بلاگ
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                آیا از حذف این بلاگ اطمینان دارید؟ این عمل قابل بازگشت نیست.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setBlogToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={() => blogToDelete && handleDeleteBlog(blogToDelete)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
