"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiMinimize,
  FiSkipBack,
  FiSkipForward,
  FiLoader,
  FiGrid,
  FiList,
  FiClock,
  FiX,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

interface Video {
  _id: string;
  title: string;
  description: string;
  src: string;
  alt: string;
  filename: string;
  originalName: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface VideoContainerProps {
  videos?: Video[];
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  videos = [],
  // autoPlay = false,
  // showControls = true,
  className = "",
}) => {
  const [apiVideos, setApiVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/videos");
        const data = await response.json();

        if (data.videos && Array.isArray(data.videos)) {
          setApiVideos(data.videos);
        } else {
          setError("خطا در دریافت ویدیوها");
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("خطا در بارگذاری ویدیوها");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Use provided videos or fetched videos
  const displayVideos = videos.length > 0 ? videos : apiVideos;

  // Filter videos based on search
  const filteredVideos = displayVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const toggleTextExpansion = () => {
    setIsTextExpanded(!isTextExpanded);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-[#66308d] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری ویدیوها...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPlay className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            خطا در بارگذاری
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#66308d] text-white rounded-lg hover:bg-[#4a1f5f] transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (filteredVideos.length === 0) {
    return (
      <div className={`w-full max-w-7xl mx-auto mt-20 ${className}`} dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            گالری ویدیو املاک و مستغلات
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
        >
          <FiPlay className="text-6xl text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            {searchTerm
              ? "ویدیویی با این جستجو یافت نشد"
              : "هیچ ویدیویی موجود نیست"}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-7xl mx-auto mt-20 ${className}`} dir="rtl">
      {/* SEO Optimized Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 bg-white/80 backdrop-blur-sm   p-6 "
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-12 md:h-12 ml-1 bg-gradient-to-r from-[#66308d] to-purple-600 rounded-full flex items-center justify-center">
              <FiPlay className="text-white text-xl" />
            </div>
            <h1 className="md:text-2xl text-base text-nowrap font-bold text-gray-800">
              گالری ویدیو املاک و مستغلات
            </h1>
          </div>
          <button
            onClick={toggleTextExpansion}
            className="flex items-center text-xs gap-2 text-nowrap bg-[#66308d] text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors duration-300"
          >
            <span>{isTextExpanded ? "بستن" : "ادامه مطلب"}</span>
            {isTextExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          دنیای املاک و مستغلات همیشه یکی از پیچیده ترین و مهم ترین حوزه ها برای
          سرمایه گذاری و خرید و فروش بوده است. ما در این بخش مجموعهای از{" "}
          <strong>ویدیوهای آموزشی حقوقی و املاک</strong> را فراهم کرده ایم.
        </p>

        <motion.div
          initial={false}
          animate={{
            height: isTextExpanded ? "auto" : 0,
            opacity: isTextExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-4">
            <p className="mb-4">
              دنیای املاک و مستغلات همیشه یکی از پیچیده‌ترین و مهم‌ترین حوزه‌ها
              برای سرمایه‌گذاری و خرید و فروش بوده است. آشنایی با قوانین حقوقی
              مرتبط با ملک، نحوه تنظیم قراردادها، بررسی سند و آگاهی از حقوق و
              تعهدات خریدار و فروشنده از موضوعاتی هستند که هر فردی باید قبل از
              ورود به این بازار با آن‌ها آشنا شود. به همین دلیل ما در این بخش
              مجموعه‌ای از
              <strong>ویدیوهای آموزشی حقوقی و املاک</strong> را فراهم کرده‌ایم
              تا بتوانید با خیالی آسوده‌تر تصمیم‌گیری کنید.
            </p>
            <p className="mb-4">
              در این ویدیوها موضوعات متنوعی پوشش داده می‌شود؛ از
              <em>اصول خرید و فروش آپارتمان و ویلا</em> گرفته تا نکات مهم در
              خرید زمین، مشارکت در ساخت، و آشنایی با قوانین پیش‌فروش ساختمان.
              همچنین مسائل مهمی مانند چگونگی تنظیم قولنامه، بررسی حقوقی سند، فسخ
              قرارداد و راهکارهای قانونی در صورت بروز اختلاف در معاملات املاک
              نیز به زبان ساده و کاربردی آموزش داده می‌شود. این محتوای آموزشی
              برای تمام افرادی که قصد <strong>سرمایه‌گذاری در املاک</strong>
              یا حتی خرید اولین خانه خود را دارند، بسیار ارزشمند است.
            </p>
            <p className="mb-4">
              علاوه بر مباحث حقوقی، ما در این گالری بخش ویژه‌ای از
              <strong>تورهای مجازی املاک</strong> را نیز قرار داده‌ایم. شما
              می‌توانید پروژه‌های ساختمانی، آپارتمان‌ها، ویلاها و حتی املاک
              تجاری را به صورت
              <strong>ویدیوهای HD و با کیفیت</strong> مشاهده کنید. این امکان به
              شما کمک می‌کند تا بدون نیاز به حضور فیزیکی در محل، ملک مورد نظر
              خود را بررسی کرده و مقایسه‌ای دقیق بین گزینه‌های مختلف داشته
              باشید. این ویژگی مخصوصاً برای کسانی که زمان محدودی برای بازدید
              حضوری دارند یا به دنبال
              <em>خرید املاک در شهرهای دیگر</em> هستند، بسیار کارآمد است.
            </p>
            <p className="mb-4">
              نکته مهم دیگر، وجود <strong>ویدیوهای آموزشی حقوقی</strong> است که
              توسط کارشناسان برجسته و مشاوران حقوقی تهیه شده‌اند. این ویدیوها به
              شما کمک می‌کنند تا با جزئیات حقوقی قراردادها و قوانین ملکی آشنا
              شوید و در صورت مواجهه با مشکلات حقوقی، بهترین راهکارها را انتخاب
              کنید. بسیاری از اختلافات حقوقی در معاملات ملک به دلیل بی‌اطلاعی
              خریداران و فروشندگان از قوانین رخ می‌دهد، اما با دیدن این آموزش‌ها
              می‌توانید از بروز چنین مشکلاتی جلوگیری کنید.
            </p>
            <p className="mb-4">
              هدف ما این است که شما بتوانید با استفاده از این مجموعه ویدیوها،
              تجربه‌ای متفاوت در انتخاب و خرید ملک داشته باشید. چه قصد خرید یک
              <em>آپارتمان مسکونی</em> داشته باشید، چه به دنبال
              <em>سرمایه‌گذاری در پروژه‌های ساختمانی</em> باشید، و یا بخواهید با
              قوانین و مسائل حقوقی املاک بیشتر آشنا شوید، این گالری می‌تواند
              بهترین منبع آموزشی و راهنمای شما باشد.
            </p>
            <p className="mb-4">
              اگر به دنبال راهی مطمئن و سریع برای یادگیری مسائل حقوقی در حوزه
              املاک هستید و می‌خواهید قبل از هر تصمیمی اطلاعات کافی داشته باشید،
              پیشنهاد می‌کنیم همین حالا مجموعه کامل{" "}
              <strong>ویدیوهای آموزشی املاک و مستغلات</strong>
              ما را تماشا کنید. با این کار، نه تنها انتخاب‌های دقیق‌تر و
              هوشمندانه‌تری خواهید داشت، بلکه از بروز بسیاری از مشکلات و
              خسارت‌های احتمالی در معاملات ملکی نیز جلوگیری می‌کنید.
            </p>
          </div>
        </motion.div>

        {/*  Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm"
        >
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-3">
              <span className="text-black">
                نمایش {filteredVideos.length} ویدیو
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="چیدمان ویدیوها"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className={`p-3 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-[#66308d] text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {viewMode === "grid" ? (
                  <FiGrid size={20} />
                ) : (
                  <FiList size={20} />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Video Playlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6 mx-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">لیست ویدیوها</h2>
          </div>

          {/* Video Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredVideos.map((video, index) => (
                <motion.article
                  key={video._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`group cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200"
                      : "flex items-center gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg border border-gray-200"
                  } transition-all duration-300 hover:border-[#66308d]/50`}
                  onClick={() => handleVideoClick(video)}
                >
                  {/* Video Thumbnail */}
                  <div
                    className={`relative bg-gradient-to-br from-[#66308d]/20 to-[#01ae9b]/20 flex items-center justify-center overflow-hidden ${
                      viewMode === "grid"
                        ? "aspect-video"
                        : "w-32 h-20 rounded-lg flex-shrink-0"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#66308d]/10 to-[#01ae9b]/10" />

                    {/* Play Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative z-10 p-4 bg-white/20 backdrop-blur-sm rounded-full group-hover:bg-[#66308d]/80 transition-all duration-300"
                    >
                      <FiPlay className="text-2xl text-[#66308d] group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                  </div>

                  {/* Video Info */}
                  <div
                    className={viewMode === "grid" ? "p-4" : "flex-1 min-w-0"}
                  >
                    <h3
                      className={`font-bold text-gray-900 group-hover:text-[#66308d] transition-colors duration-200 ${
                        viewMode === "grid"
                          ? "mb-2 line-clamp-2 text-lg"
                          : "line-clamp-1 mb-1 text-base"
                      }`}
                    >
                      {video.title}
                    </h3>
                    <p
                      className={`text-gray-600 text-sm leading-relaxed ${
                        viewMode === "grid"
                          ? "line-clamp-3 mb-3"
                          : "line-clamp-2 mb-2"
                      }`}
                    >
                      {video.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FiClock className="text-xs" />
                      <time dateTime={video.createdAt}>
                        {new Date(video.createdAt).toLocaleDateString("fa-IR")}
                      </time>
                    </div>
                  </div>

                  {/* Play Button for List View */}
                  {viewMode === "list" && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-gradient-to-r from-[#66308d] to-[#01ae9b] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <FiPlay className="text-lg" />
                    </motion.button>
                  )}
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Video Modal */}
        {isModalOpen &&
          typeof window !== "undefined" &&
          createPortal(
            <VideoModal
              isOpen={isModalOpen}
              video={selectedVideo}
              onClose={closeModal}
              allVideos={filteredVideos}
            />,
            document.body
          )}

        {/* Schema.org structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoGallery",
              name: "گالری ویدیو املاک و مستغلات",
              description:
                "مجموعه جامع ویدیوهای املاک شامل تورهای مجازی، بازدید از ملک و معرفی پروژههای ساختمانی",
              video: filteredVideos.map((video) => ({
                "@type": "VideoObject",
                name: video.title,
                description: video.description,
                contentUrl: video.src,
                uploadDate: video.createdAt,
                duration: "PT0M0S",
              })),
            }),
          }}
        />
      </motion.div>
    </div>
  );
};

// Video Modal Component
interface VideoModalProps {
  isOpen: boolean;
  video: Video | null;
  onClose: () => void;
  allVideos: Video[];
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  video,
  onClose,
  allVideos,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Update current video index when video changes
  useEffect(() => {
    if (video && allVideos.length > 0) {
      const index = allVideos.findIndex((v) => v._id === video._id);
      setCurrentVideoIndex(index);
    }
  }, [video, allVideos]);

  // Show/hide controls with timeout
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Video event handlers
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < allVideos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      // Update the video prop by calling parent's handler
      // This would need to be passed as a prop
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      // Update the video prop by calling parent's handler
    }
  };

  // Format time helper
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Video event listeners
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedData = () => {
      setIsVideoLoading(false);
      setDuration(videoElement.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
      setProgress((videoElement.currentTime / videoElement.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (currentVideoIndex < allVideos.length - 1) {
        handleNextVideo();
      }
    };

    const handleLoadStart = () => setIsVideoLoading(true);
    const handleCanPlay = () => setIsVideoLoading(false);

    videoElement.addEventListener("loadeddata", handleLoadedData);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("ended", handleEnded);
    videoElement.addEventListener("loadstart", handleLoadStart);
    videoElement.addEventListener("canplay", handleCanPlay);

    return () => {
      videoElement.removeEventListener("loadeddata", handleLoadedData);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("ended", handleEnded);
      videoElement.removeEventListener("loadstart", handleLoadStart);
      videoElement.removeEventListener("canplay", handleCanPlay);
    };
  }, [video, currentVideoIndex, allVideos.length]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen || !video) return null;

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black/50 z-[99999] flex items-center justify-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
      }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            ref={containerRef}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-black rounded-2xl overflow-hidden shadow-2xl w-full max-w-5xl aspect-video mx-auto"
            style={{ maxHeight: "80vh" }}
            onClick={(e) => e.stopPropagation()}
            onMouseMove={showControlsTemporarily}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => !isPlaying && setShowControls(false)}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <FiX className="text-xl" />
            </motion.button>

            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={video.src}
              preload="metadata"
              title={video.title}
              aria-label={video.alt}
              autoPlay
            />

            {/* Loading Overlay */}
            <AnimatePresence>
              {isVideoLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="p-4 bg-white bg-opacity-20 rounded-full"
                  >
                    <FiLoader className="text-4xl text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Controls */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6"
                >
                  {/* Progress Bar */}
                  <div
                    ref={progressRef}
                    className="w-full h-2 bg-white/30 rounded-full mb-4 cursor-pointer group/progress"
                    onClick={handleProgressClick}
                  >
                    <div className="relative h-full">
                      <motion.div
                        className="h-full bg-[#01ae9b] rounded-full"
                        style={{ width: `${progress}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePlayPause}
                        className="text-white hover:text-[#01ae9b] transition-colors duration-200"
                      >
                        {isPlaying ? (
                          <FiPause className="text-2xl" />
                        ) : (
                          <FiPlay className="text-2xl" />
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePrevVideo}
                        disabled={currentVideoIndex === 0}
                        className="text-white hover:text-[#01ae9b] transition-colors duration-200 disabled:opacity-50"
                      >
                        <FiSkipBack className="text-xl" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleNextVideo}
                        disabled={currentVideoIndex === allVideos.length - 1}
                        className="text-white hover:text-[#01ae9b] transition-colors duration-200 disabled:opacity-50"
                      >
                        <FiSkipForward className="text-xl" />
                      </motion.button>

                      {/* Volume Control */}
                      <div className="relative flex items-center group/volume">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleMute}
                          className="text-white hover:text-[#01ae9b] transition-colors duration-200"
                        >
                          {isMuted || volume === 0 ? (
                            <FiVolumeX className="text-xl" />
                          ) : (
                            <FiVolume2 className="text-xl" />
                          )}
                        </motion.button>
                      </div>

                      {/* Time Display */}
                      <div className="text-white text-sm flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
                        <FiClock className="text-sm" />
                        <span>
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleFullscreen}
                      className="text-white hover:text-[#01ae9b] transition-colors duration-200"
                    >
                      {isFullscreen ? (
                        <FiMinimize className="text-xl" />
                      ) : (
                        <FiMaximize className="text-xl" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VideoContainer;
