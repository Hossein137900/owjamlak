"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import toast from "react-hot-toast";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blog");
      const data = await response.json();
      setBlogs(data || []);
    } catch (error) {
      console.log("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = () => {
    window.open("/addBlog", "_blank");
  };

  const handleViewBlog = (blogId: string) => {
    window.open(`/blogs/${blogId}`, "_blank");
  };

  const handleEditBlog = (blogId: string) => {
    window.open(`/addBlog?edit=${blogId}`, "_blank");
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      const response = await fetch(`/api/blog/${blogToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("بلاگ با موفقیت حذف شد");
        fetchBlogs();
        setShowDeleteModal(false);
        setBlogToDelete(null);
      } else {
        toast.error("خطا در حذف بلاگ");
      }
    } catch (error) {
      console.log("Error deleting blog:", error);
      toast.error("خطا در حذف بلاگ");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">درحال بارگذاری</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-600">مدیریت وبلاگ</h1>
        <button
          onClick={handleCreateBlog}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FiPlus />
          ایجاد بلاگ جدید
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">هنوز بلاگی ایجاد نشده است</p>
          <button
            onClick={handleCreateBlog}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            اولین بلاگ را ایجاد کنید
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-black text-lg mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {blog.excerpt.slice(0, 30)} ...
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                  <span>{blog.date}</span>
                  <span>{blog.readTime}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewBlog(blog.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 flex items-center justify-center gap-1"
                  >
                    <FiEye size={14} />
                    مشاهده
                  </button>
                  <button
                    onClick={() => handleEditBlog(blog.id)}
                    className="bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 flex items-center justify-center"
                  >
                    <FiEdit size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setBlogToDelete({ id: blog.id, title: blog.title });
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 flex items-center justify-center"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
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
                <FiTrash2 className="text-red-600 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                حذف بلاگ
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                آیا از حذف بلاگ {blogToDelete?.title} اطمینان دارید؟ این عمل
                قابل بازگشت نیست.
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
                  onClick={handleDeleteBlog}
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
};

export default BlogManagement;
