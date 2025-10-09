"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaRegClock, FaChevronLeft } from "react-icons/fa";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  excerpt,
  coverImage,
  author,
  date,
  readTime,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-full flex flex-col bg-white rounded-lg overflow-hidden"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
      whileHover={{
        boxShadow: "0 10px 30px rgba(0,0,0,0.05), 0 5px 15px rgba(0,0,0,0.03)",
      }}
    >
      <div
        className="absolute bottom-0 left-10 h-1 z-10 transition-all duration-[1500ms] ease-out"
        style={{
          width: isHovered ? "78%" : "0%",
          background: `linear-gradient(to right, #01ae9b, #66308d)`,
        }}
      />
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {/* Category Indicator - Minimal Line */}

        {/* Image with Zoom Effect */}
        <motion.div
          className="absolute inset-0 bg-gray-100"
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={coverImage ? (coverImage.startsWith('/uploads/blog/') ? `/api/blog/${coverImage.split('/').pop()}` : coverImage) : "/assets/images/hero2.png"}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />

          {/* Subtle Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-5 relative">
        {/* Date and Read Time - Minimal Design */}
        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4 rtl:space-x-reverse">
          <time dateTime={date} className="font-light">
            {date}
          </time>
          <div className="flex items-center">
            <FaRegClock className="mx-1 text-[#01ae9b]" size={10} />
            <span>{readTime}</span>
          </div>
        </div>

        {/* Title - Clean Typography */}
        <h3 className="text-lg font-medium mb-2 leading-tight text-gray-400 transition-colors duration-300 group-hover:text-[#66308d]">
          <Link href={`/blogs/${id}`} className="block">
            {title}
          </Link>
        </h3>

        {/* Excerpt - Minimal and Clean */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 font-light leading-relaxed">
          {excerpt.slice(0, 50)} ...
        </p>

        {/* Author and Read More - Elegant Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
          {/* Author */}
          <div className="flex items-center">
            <span className="mr-2 rtl:mr-0 rtl:ml-2 text-xs font-medium text-gray-800">
              {author}
            </span>
          </div>

          {/* Read More Link - Minimal Design */}
          <Link
            href={`/blogs/${id}`}
            className="group/link flex   items-center text-xs font-medium text-[#66308d] hover:text-[#01ae9b] transition-colors duration-300"
          >
            <span>ادامه مطلب</span>
            <motion.div
              animate={{ x: isHovered ? -3 : 0 }}
              transition={{ duration: 0.3 }}
              className="mr-1  flex items-center"
            >
              <FaChevronLeft size={10} className="" />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
