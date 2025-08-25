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
  filename: string;
  url: string;
  originalName?: string;
  size?: number;
  uploadedAt: string;
}

const VideoManagement: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) =>
    (video.originalName || video.filename).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteVideo = async (filename: string) => {
    if (confirm("آیا از حذف این ویدیو اطمینان دارید؟")) {
      try {
        const response = await fetch("/api/videos", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: getToken() || "",
          },
          body: JSON.stringify({ filename }),
        });
        const data = await response.json();
        if (data.success) {
          setVideos(videos.filter((video) => video.filename !== filename));
        } else {
          alert(data.message || "خطا در حذف ویدیو");
        }
      } catch (error) {
        alert("خطا در حذف ویدیو");
      }
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
          onClick={() => setIsModalOpen(true)}
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
              key={video.filename}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <FiPlay className="text-4xl text-gray-400" />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <button 
                    onClick={() => window.open(video.url, '_blank')}
                    className="p-2 bg-white bg-opacity-80 rounded-full"
                  >
                    <FiEye className="text-gray-800" />
                  </button>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                  {video.originalName || video.filename}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                  {new Date(video.uploadedAt).toLocaleDateString('fa-IR')}
                </p>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 space-x-reverse">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        navigator.clipboard.writeText(video.url);
                        alert("لینک کپی شد");
                      }}
                      className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors duration-200"
                    >
                      <FiEdit className="text-sm" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteVideo(video.filename)}
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

      {/* Upload Modal */}
      <VideoUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchVideos}
      />
    </motion.div>
  );
};

// Upload Modal Component
interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("video", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { token: token || "" },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        alert(data.message || "خطا در آپلود ویدیو");
      }
    } catch (error) {
      alert("خطا در آپلود ویدیو");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            آپلود ویدیو جدید
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <FiX className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {uploading ? "در حال آپلود..." : "فایل ویدیو را انتخاب کنید"}
            </p>
            <input
              type="file"
              accept="video/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200 disabled:opacity-50"
            >
              انتخاب فایل
            </label>
            <p className="text-xs text-gray-500 mt-2">
              فرمتهای پشتیبانی شده: MP4, WebM, OGG, AVI, MOV (حداکثر 50MB)
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoManagement;