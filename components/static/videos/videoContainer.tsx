"use client";
import React, { useState, useEffect, useRef } from "react";
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
  FiSearch,
  FiGrid,
  FiList,
  FiClock,
} from "react-icons/fi";

interface Video {
  _id: string;
  title: string;
  description: string;
  src: string;
  alt: string;
  createdAt?: string;
}

interface VideoContainerProps {
  videos?: Video[];
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  videos = [],
  autoPlay = false,
  showControls = true,
  className = "",
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showControls_, setShowControls_] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Mock data if no videos provided
  const mockVideos: Video[] = [
    {
      _id: "1",
      title: "تور ویلای لوکس در شمال",
      description: "بازدید کامل از ویلای 500 متری در محمودآباد با امکانات کامل",
      src: "/videos/sample1.mp4",
      alt: "تور ویلای لوکس",
      createdAt: "1402/06/15",
    },
    {
      _id: "2",
      title: "آپارتمان مدرن در تهران",
      description: "نمایش آپارتمان 120 متری در منطقه ولنجک با دکوراسیون مدرن",
      src: "/videos/sample2.mp4",
      alt: "آپارتمان مدرن",
      createdAt: "1402/06/10",
    },
    {
      _id: "3",
      title: "پروژه ساختمانی جدید",
      description: "معرفی پروژه ساختمانی 20 طبقه در منطقه پونک",
      src: "/videos/sample3.mp4",
      alt: "پروژه ساختمانی",
      createdAt: "1402/06/05",
    },
  ];

  const displayVideos = videos.length > 0 ? videos : mockVideos;
  const currentVideo = displayVideos[currentVideoIndex];

  // Filter videos based on search


  // Show/hide controls with timeout
  const showControlsTemporarily = () => {
    setShowControls_(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls_(false);
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

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
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
    const nextIndex = (currentVideoIndex + 1) % displayVideos.length;
    setCurrentVideoIndex(nextIndex);
    setIsLoading(true);
  };

  const handlePrevVideo = () => {
    const prevIndex =
      currentVideoIndex === 0
        ? displayVideos.length - 1
        : currentVideoIndex - 1;
    setCurrentVideoIndex(prevIndex);
    setIsLoading(true);
  };

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
    setIsLoading(true);
  };

  // Format time helper
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration);
      if (autoPlay) {
        video.play();
        setIsPlaying(true);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (currentVideoIndex < displayVideos.length - 1) {
        handleNextVideo();
      }
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [currentVideoIndex, autoPlay, displayVideos.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === "ArrowRight") {
        handleNextVideo();
      } else if (e.code === "ArrowLeft") {
        handlePrevVideo();
      } else if (e.code === "KeyM") {
        handleMute();
      } else if (e.code === "KeyF") {
        handleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  if (displayVideos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700"
      >
        <FiPlay className="text-6xl text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">هیچ ویدیویی موجود نیست</p>
      </motion.div>
    );
  }

  return (
    <div className={`w-full max-w-7xl mx-auto mt-40 ${className}`} dir="rtl">
      {/* Header */}
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-4"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
          گالری ویدیو املاک و مستغلات
        </h1>
        <div className="prose prose-lg max-w-none text-gray-600  leading-relaxed">
          <p className="mb-4">
            مجموعه جامع و کاملی از <strong>ویدیوهای املاک و مستغلات</strong> که
            شامل تورهای مجازی، بازدید از ملک، و معرفی پروژه‌های ساختمانی
            می‌باشد. در این بخش می‌توانید از
            <strong> ویدیوهای با کیفیت HD </strong>برای مشاهده انواع املاک شامل
            <em>آپارتمان، ویلا، زمین، و املاک تجاری</em> استفاده کنید.
          </p>

          <p className="mb-4">
            <strong>پلتفرم ویدیویی املاک آملاک</strong> به شما امکان مشاهده دقیق
            و کامل املاک را قبل از بازدید حضوری فراهم می‌کند. هر ویدیو شامل
            توضیحات کامل، مشخصات فنی، و جزئیات مهم ملک است که به شما در{" "}
            <strong>تصمیم‌گیری آگاهانه برای خرید، فروش یا اجاره</strong>
            کمک می‌کند. سیستم جستجوی پیشرفته ما امکان فیلتر کردن ویدیوها بر اساس
            نوع ملک، منطقه، و قیمت را فراهم می‌کند.
          </p>

          <p className="mb-4">
            ویژگی‌های منحصر به فرد پلیر ویدیویی ما شامل{" "}
            <strong>
              کنترل‌های پیشرفته، قابلیت تمام‌صفحه، تنظیم کیفیت، و پخش خودکار
            </strong>{" "}
            است. همچنین امکان مشاهده در حالت‌های مختلف (شبکه‌ای و لیستی) و{" "}
            <strong>پشتیبانی کامل از دستگاه‌های موبایل و تبلت</strong>
            فراهم شده است. تمامی ویدیوها با <em>کیفیت بالا ضبط و تدوین</em>{" "}
            شده‌اند تا بهترین تجربه مشاهده را برای کاربران فراهم کنند.
          </p>

          <p>
            با استفاده از <strong>فناوری‌های مدرن وب</strong> و رابط کاربری
            بهینه‌شده، این پلتفرم تجربه‌ای روان و سریع در مرور و مشاهده ویدیوهای
            املاک ارائه می‌دهد.
            <strong>مشاوران املاک، سرمایه‌گذاران، و متقاضیان خرید</strong>{" "}
            می‌توانند از این ابزار قدرتمند برای بررسی دقیق‌تر املاک و صرفه‌جویی
            در زمان استفاده کنند. همچنین قابلیت اشتراک‌گذاری ویدیوها در شبکه‌های
            اجتماعی و ارسال لینک مستقیم به دوستان و آشنایان نیز فراهم است.
          </p>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white  p-4 rounded-xl shadow-sm"
      >
        <div className="flex justify-between gap-3 items-center w-full">
          <div className=" text-black">نمایش {displayVideos.length} ویدیو</div>
          <div>
            {" "}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="چیدمان ویدیوها"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className={`p-3 rounded-lg transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-[#66308d] text-white shadow-lg"
                  : "bg-gray-100 text-gray-600  hover:bg-gray-200 "
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

      {/* Main Video Player */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative bg-black rounded-xl overflow-hidden shadow-2xl mb-8 group"
        onMouseMove={showControlsTemporarily}
        onMouseEnter={() => setShowControls_(true)}
        onMouseLeave={() => !isPlaying && setShowControls_(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full aspect-video object-cover"
          src={currentVideo.src}
          poster={`/images/video-thumbnails/${currentVideo._id}.jpg`}
          preload="metadata"
        />

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="p-4 bg-white bg-opacity-20 rounded-full"
              >
                <FiLoader className="text-4xl text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play/Pause Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={handlePlayPause}
        >
          <AnimatePresence>
            {(!isPlaying || showControls_) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-6 bg-[#66308d] bg-opacity-90 rounded-full backdrop-blur-sm shadow-2xl hover:bg-opacity-100 transition-all duration-300"
              >
                {isPlaying ? (
                  <FiPause className="text-4xl text-white" />
                ) : (
                  <FiPlay className="text-4xl text-white ml-1" />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Video Info Overlay */}
        <AnimatePresence>
          {showControls_ && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-4 right-4"
            >
              <div className="bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-md rounded-lg p-4">
                <h3 className="text-white font-bold text-xl mb-2">
                  {currentVideo.title}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {currentVideo.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Controls */}
        {showControls && (
          <AnimatePresence>
            {showControls_ && (
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
                      className="h-full bg-gradient-to-r from-[#66308d] to-[#01ae9b] rounded-full"
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                    <motion.div
                      className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200"
                      style={{ left: `${progress}%`, marginLeft: "-8px" }}
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
                      className="text-white hover:text-[#01ae9b] transition-colors duration-200"
                    >
                      <FiSkipBack className="text-xl" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleNextVideo}
                      className="text-white hover:text-[#01ae9b] transition-colors duration-200"
                    >
                      <FiSkipForward className="text-xl" />
                    </motion.button>

                    {/* Volume Control */}
                    <div
                      className="relative flex items-center group/volume"
                      onMouseEnter={() => setShowVolumeSlider(true)}
                      onMouseLeave={() => setShowVolumeSlider(false)}
                    >
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

                      <AnimatePresence>
                        {showVolumeSlider && (
                          <motion.div
                            initial={{ opacity: 0, x: -10, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -10, scale: 0.9 }}
                            className="absolute left-full ml-3 bg-black/90 backdrop-blur-sm rounded-lg p-3 shadow-xl"
                          >
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={volume}
                              onChange={(e) =>
                                handleVolumeChange(parseFloat(e.target.value))
                              }
                              className="w-20 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                              style={{
                                background: `linear-gradient(to right, #66308d 0%, #01ae9b ${
                                  volume * 100
                                }%, rgba(255,255,255,0.3) ${
                                  volume * 100
                                }%, rgba(255,255,255,0.3) 100%)`,
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
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
        )}
      </motion.div>

      {/* Video Playlist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6 mx-2"
      >
        <div className="flex flex-row-reverse items-center justify-end">
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
            {displayVideos.map((video, index) => (
              <motion.div
                key={video._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`group cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700"
                    : "flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700"
                } transition-all duration-300 hover:border-[#66308d]/50`}
                onClick={() => handleVideoSelect(displayVideos.indexOf(video))}
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

                  {/* Active Video Indicator */}
                  {currentVideo._id === video._id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 flex items-center gap-2 bg-[#01ae9b] text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
                    >
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      در حال پخش
                    </motion.div>
                  )}

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                    {formatTime(duration || 0)}
                  </div>
                </div>

                {/* Video Info */}
                <div className={viewMode === "grid" ? "p-4" : "flex-1 min-w-0"}>
                  <h3
                    className={`font-bold text-gray-900 dark:text-white group-hover:text-[#66308d] transition-colors duration-200 ${
                      viewMode === "grid"
                        ? "mb-2 line-clamp-2 text-lg"
                        : "line-clamp-1 mb-1 text-base"
                    }`}
                  >
                    {video.title}
                  </h3>
                  <p
                    className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed ${
                      viewMode === "grid"
                        ? "line-clamp-3 mb-3"
                        : "line-clamp-2 mb-2"
                    }`}
                  >
                    {video.description}
                  </p>
                  {video.createdAt && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <FiClock className="text-xs" />
                      <span>{video.createdAt}</span>
                    </div>
                  )}
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {displayVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#66308d]/20 to-[#01ae9b]/20 rounded-full flex items-center justify-center">
              <FiSearch className="text-4xl text-[#66308d]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              نتیجه‌ای یافت نشد
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              هیچ ویدیویی با این جستجو پیدا نشد. لطفاً کلمات کلیدی دیگری امتحان
              کنید.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #01ae9b;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #01ae9b;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .aspect-video {
            aspect-ratio: 16 / 9;
          }
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #66308d, #01ae9b);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #4a1f5f, #017a6b);
        }

        /* Focus styles for accessibility */
        button:focus-visible,
        input:focus-visible {
          outline: 2px solid #66308d;
          outline-offset: 2px;
        }

        /* Smooth transitions for dark mode */
        * {
          transition: background-color 0.2s ease, border-color 0.2s ease,
            color 0.2s ease;
        }

        /* Video element styles */
        video {
          background: #000;
        }

        video::-webkit-media-controls {
          display: none !important;
        }

        video::-webkit-media-controls-enclosure {
          display: none !important;
        }

        /* Loading animation */
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Gradient text */
        .gradient-text {
          background: linear-gradient(45deg, #66308d, #01ae9b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Hover effects */
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .mobile-padding {
            padding: 1rem;
          }

          .mobile-text {
            font-size: 0.875rem;
          }

          .mobile-button {
            padding: 0.5rem;
            min-width: 44px;
            min-height: 44px;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .bg-gradient-to-r {
            background: #66308d !important;
          }

          .border-gray-200 {
            border-color: #000 !important;
          }

          .text-gray-600 {
            color: #000 !important;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Print styles */
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoContainer;
