"use client";

import { useState, useEffect } from "react";
import { FiUpload, FiTrash2, FiPlay, FiDownload } from "react-icons/fi";

interface Video {
  filename: string;
  url: string;
  originalName?: string;
  size?: number;
  uploadedAt: string;
}

export default function VideoUpload() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load videos on component mount
  useEffect(() => {
    loadVideos();
  }, []);

  // Load videos on component mount
  const loadVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.log("Error loading videos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Upload video
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
        headers: {
          token: token || "",
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        await loadVideos(); // Reload videos list
        event.target.value = ""; // Clear input
      } else {
        alert(data.message || "خطا در آپلود ویدیو");
      }
    } catch (error) {
      console.log("Upload error:", error);
      alert("خطا در آپلود ویدیو");
    } finally {
      setUploading(false);
    }
  };

  // Delete video
  const handleDelete = async (filename: string) => {
    if (!confirm("آیا از حذف این ویدیو اطمینان دارید؟")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/videos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify({ filename }),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadVideos(); // Reload videos list
      } else {
        alert(data.message || "خطا در حذف ویدیو");
      }
    } catch (error) {
      console.log("Delete error:", error);
      alert("خطا در حذف ویدیو");
    }
  };

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "نامشخص";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">مدیریت ویدیوها</h2>
        <button
          onClick={loadVideos}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "درحال بارگذاری" : "بروزرسانی"}
        </button>
      </div>

      {/* Upload Section */}
      <div className="mb-8 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <label className="cursor-pointer">
            <span className="mt-2 block text-sm font-medium text-gray-900">
              {uploading ? "در حال آپلود..." : "انتخاب ویدیو برای آپلود"}
            </span>
            <input
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
          <p className="mt-1 text-xs text-gray-500">
            فرمت‌های پشتیبانی شده: MP4, WebM, OGG, AVI, MOV (حداکثر 50MB)
          </p>
        </div>
      </div>

      {/* Videos List */}
      <div className="space-y-4">
        {videos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            هیچ ویدیویی یافت نشد
          </div>
        ) : (
          videos.map((video) => (
            <div
              key={video.filename}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex-shrink-0">
                  <FiPlay className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {video.originalName || video.filename}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(video.size)} • {new Date(video.uploadedAt).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                {/* Preview Button */}
                <button
                  onClick={() => window.open(video.url, '_blank')}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                  title="پیش‌نمایش"
                >
                  <FiPlay className="h-4 w-4" />
                </button>

                {/* Copy URL Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(video.url);
                    alert("لینک کپی شد");
                  }}
                  className="p-2 text-green-600 hover:bg-green-100 rounded"
                  title="کپی لینک"
                >
                  <FiDownload className="h-4 w-4" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(video.filename)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                  title="حذف"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}