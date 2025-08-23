"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiUpload,
  FiX,
  FiPlay,
  FiEye,
} from "react-icons/fi";

interface Video {
  _id: string;
  title: string;
  description: string;
  src: string;
  alt: string;
  createdAt: string;
}

const VideoManagement: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      if (data.success) {
        setVideos(data.data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(
    (video) =>
      video.title.includes(searchTerm) || video.description.includes(searchTerm)
  );

  const handleAddVideo = () => {
    setEditingVideo(null);
    setIsModalOpen(true);
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setIsModalOpen(true);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (confirm("آیا از حذف این ویدیو اطمینان دارید؟")) {
      try {
        const response = await fetch(`/api/videos/${videoId}`, {
          method: "DELETE",
          headers: { token: getToken() || "" },
        });
        const data = await response.json();
        if (data.success) {
          setVideos(videos.filter((video) => video._id !== videoId));
        } else {
          alert(data.message || "خطا در حذف ویدیو");
        }
      } catch (error) {
        alert("خطا در حذف ویدیو");
      }
    }
  };

  const handleSubmit = async (formData: Omit<Video, "_id" | "createdAt">) => {
    setIsSubmitting(true);
    try {
      if (editingVideo) {
        const response = await fetch(`/api/videos/${editingVideo._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: getToken() || "",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
          setVideos(
            videos.map((video) =>
              video._id === editingVideo._id ? data.data : video
            )
          );
          setIsModalOpen(false);
        } else {
          alert(data.message || "خطا در بهروزرسانی ویدیو");
        }
      } else {
        const response = await fetch("/api/videos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: getToken() || "",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
          setVideos([data.data, ...videos]);
          setIsModalOpen(false);
        } else {
          alert(data.message || "خطا در ایجاد ویدیو");
        }
      }
    } catch (error) {
      alert("خطا در عملیات");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 md:mb-0">
          مدیریت ویدیوها
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddVideo}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <FiPlus className="ml-2" />
          افزودن ویدیو جدید
        </motion.button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="جستجو در ویدیوها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredVideos.map((video) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <FiPlay className="text-4xl text-gray-400" />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <button className="p-2 bg-white bg-opacity-80 rounded-full">
                    <FiEye className="text-gray-800" />
                  </button>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {video.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                  {video.createdAt}
                </p>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 space-x-reverse">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditVideo(video)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200"
                    >
                      <FiEdit className="text-sm" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteVideo(video._id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                    >
                      <FiTrash2 className="text-sm" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <FiPlay className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? "ویدیویی یافت نشد" : "هنوز ویدیویی اضافه نشده است"}
          </p>
        </div>
      )}

      {/* Video Form Modal */}
      <VideoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editingVideo={editingVideo}
        isSubmitting={isSubmitting}
      />
    </motion.div>
  );
};

// Video Form Modal Component
interface VideoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<Video, "_id" | "createdAt">) => void;
  editingVideo: Video | null;
  isSubmitting: boolean;
}

const VideoFormModal: React.FC<VideoFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingVideo,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    src: "",
    alt: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (editingVideo) {
      setFormData({
        title: editingVideo.title,
        description: editingVideo.description,
        src: editingVideo.src,
        alt: editingVideo.alt,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        src: "",
        alt: "",
      });
    }
  }, [editingVideo, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileUpload = async (file: File) => {
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch("/api/videos/upload", {
        method: "POST",
        headers: { token: localStorage.getItem("token") || "" },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, src: data.data.src }));
        setUploadProgress(100);
      } else {
        alert(data.message || "خطا در آپلود فایل");
      }
    } catch (error) {
      alert("خطا در آپلود فایل");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        handleFileUpload(file);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {editingVideo ? "ویرایش ویدیو" : "افزودن ویدیو جدید"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <FiX className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              فایل ویدیو
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                dragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                فایل ویدیو را اینجا بکشید یا کلیک کنید
              </p>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
              >
                انتخاب فایل
              </label>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {uploadProgress}%
                  </p>
                </div>
              )}
              {formData.src && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ فایل آپلود شد: {formData.src}
                </p>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان ویدیو *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="عنوان ویدیو را وارد کنید"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              توضیحات *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="توضیحات ویدیو را وارد کنید"
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              متن جایگزین (Alt) *
            </label>
            <input
              type="text"
              required
              value={formData.alt}
              onChange={(e) =>
                setFormData({ ...formData, alt: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="متن جایگزین برای ویدیو"
            />
          </div>

          {/* Video URL (Alternative) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              لینک ویدیو (اختیاری)
            </label>
            <input
              type="url"
              value={formData.src}
              onChange={(e) =>
                setFormData({ ...formData, src: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="https://example.com/video.mp4"
            />
            <p className="text-xs text-gray-500 mt-1">
              می‌توانید به جای آپلود فایل، لینک مستقیم ویدیو را وارد کنید
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-start gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              انصراف
            </button>
            <motion.button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.title ||
                !formData.description ||
                !formData.alt ||
                !formData.src
              }
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
              )}
              {isSubmitting
                ? "در حال ذخیره..."
                : editingVideo
                ? "بروزرسانی"
                : "ذخیره"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VideoManagement;
