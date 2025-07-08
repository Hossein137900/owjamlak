"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface BlogCardProps {
  blog: {
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
  };
  index?: number;
}

export default function BlogCard({ blog, index = 0 }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <i className="fas fa-blog text-4xl text-white/70"></i>
          </div>
        )}
        
        {/* Read Time Badge */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {blog.readTime} دقیقه مطالعه
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 2).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
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
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {blog.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <i className="fas fa-user text-xs"></i>
            {/* <span>{blog.userId.name || blog.userId.username || 'نویسنده'}</span> */}
          </div>
          
          <div className="flex items-center gap-2">
            <i className="fas fa-calendar text-xs"></i>
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>

        {/* Read More Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={`/blog/${blog._id}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors group"
          >
            ادامه مطالعه
            <i className="fas fa-arrow-left text-xs group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
