"use client";
import { useState, useEffect } from "react";
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
import toast from "react-hot-toast";

interface Video {
  _id: string;
  title: string;
  description: string;
  alt: string;
  src: string;
  filename: string;
  originalName: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

const VideoManagement: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getToken = () => localStorage.getItem("token");

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteVideo = async (id: string) => {
    try {
      const response = await fetch("/api/videos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: getToken() || "",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        setVideos(videos.filter((video) => video._id !== id));
        setIsDeleteModalOpen(false);
        setSelectedVideo(null);
      } else {
        alert(data.message || "خطا در حذف ویدیو");
      }
    } catch (error) {
      alert("خطا در حذف ویدیو");
    }
  };

  const handleCopyLink = (video: Video) => {
    setSelectedVideo(video);
    setIsCopyModalOpen(true);
  };

  const handleDeleteClick = (video: Video) => {
    setSelectedVideo(video);
    setIsDeleteModalOpen(true);
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setIsEditModalOpen(true);
  };

  const handleUpdateVideo = async (
    id: string,
    title: string,
    description: string,
    alt: string
  ) => {
    try {
      const response = await fetch("/api/videos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: getToken() || "",
        },
        body: JSON.stringify({ id, title, description, alt }),
      });
      const data = await response.json();
      if (data.success) {
        setVideos(
          videos.map((video) =>
            video._id === id ? { ...video, title, description, alt } : video
          )
        );
        toast.success("ویدیو با موفقیت به روزرسانی شد");
        setIsEditModalOpen(false);
        setEditingVideo(null);
      } else {
        toast.error(data.message || "خطا در بهروزرسانی ویدیو");
      }
    } catch (error) {
      alert("خطا در بهروزرسانی ویدیو");
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
                  <button
                    onClick={() => window.open(video.src, "_blank")}
                    className="p-2 bg-white bg-opacity-80 rounded-full"
                  >
                    <FiEye className="text-gray-800" />
                  </button>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {video.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                  {new Date(video.createdAt).toLocaleDateString("fa-IR")}
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
                      onClick={() => handleCopyLink(video)}
                      className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors duration-200"
                    >
                      <FiUpload className="text-sm" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteClick(video)}
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

      {/* Edit Modal */}
      <VideoEditModal
        isOpen={isEditModalOpen}
        video={editingVideo}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingVideo(null);
        }}
        onUpdate={handleUpdateVideo}
      />

      {/* Copy Link Modal */}
      <CopyLinkModal
        isOpen={isCopyModalOpen}
        video={selectedVideo}
        onClose={() => {
          setIsCopyModalOpen(false);
          setSelectedVideo(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        video={selectedVideo}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedVideo(null);
        }}
        onConfirm={() => selectedVideo && handleDeleteVideo(selectedVideo._id)}
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [alt, setAlt] = useState("");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!title || !description || !alt) {
      toast("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("alt", alt);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { token: token || "" },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("ویدیو با موفقیت آپلود شد");
        onSuccess();
        onClose();
        setTitle("");
        setDescription("");
        setAlt("");
      } else {
        toast("خطا در آپلود ویدیو");
      }
    } catch (error) {
      console.log(error);
      toast.error("خطا در آپلود ویدیو");
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

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان ویدیو
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="عنوان ویدیو را وارد کنید"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              توضیحات
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="توضیحات ویدیو را وارد کنید"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              متن جایگزین (Alt)
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="متن جایگزین برای ویدیو"
            />
          </div>

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

// Edit Modal Component
interface VideoEditModalProps {
  isOpen: boolean;
  video: Video | null;
  onClose: () => void;
  onUpdate: (
    id: string,
    title: string,
    description: string,
    alt: string
  ) => void;
}

const VideoEditModal: React.FC<VideoEditModalProps> = ({
  isOpen,
  video,
  onClose,
  onUpdate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [alt, setAlt] = useState("");

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDescription(video.description);
      setAlt(video.alt);
    }
  }, [video]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !title || !description || !alt) return;

    onUpdate(video._id, title, description, alt);
  };

  if (!isOpen || !video) return null;

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
            ویرایش ویدیو
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <FiX className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان ویدیو
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              توضیحات
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              متن جایگزین (Alt)
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              به روزرسانی
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              لغو
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Copy Link Modal Component
interface CopyLinkModalProps {
  isOpen: boolean;
  video: Video | null;
  onClose: () => void;
}

const CopyLinkModal: React.FC<CopyLinkModalProps> = ({
  isOpen,
  video,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (video) {
      await navigator.clipboard.writeText(video.src);
      setCopied(true);
      toast(`لینک ویدیو کپی شد!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !video) return null;

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
            کپی لینک ویدیو
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <FiX className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {video.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {video.description}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
              {video.src}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-200 ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {copied ? "کپی شد!" : "کپی لینک"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              بستن
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Delete Confirmation Modal Component
interface DeleteConfirmModalProps {
  isOpen: boolean;
  video: Video | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  video,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-red-600">حذف ویدیو</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <FiX className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              آیا از حذف این ویدیو اطمینان دارید؟
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <h3 className="font-semibold text-red-800 dark:text-red-400 mb-1">
                {video.title}
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                این عمل قابل بازگشت نیست
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              حذف ویدیو
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              لغو
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoManagement;
