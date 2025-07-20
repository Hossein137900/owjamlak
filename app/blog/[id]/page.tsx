"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Link from "next/link";

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
    name?: string;
    username?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SingleBlogPage({ params }: PageProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [blogId, setBlogId] = useState<string | null>(null);

  // Handle the Promise params
  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await params;
        setBlogId(resolvedParams.id);
      } catch (error) {
        console.log("Error resolving params:", error);
        toast.error("خطا در دریافت شناسه بلاگ");
      }
    };

    getParams();
  }, [params]);

  useEffect(() => {
    if (blogId) {
      fetchBlog(blogId);
      fetchRelatedBlogs();
    }
  }, [blogId]);

  const fetchBlog = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${id}`);
      const data = await response.json();

      if (response.ok) {
        setBlog(data.blog);
        // Update page title
        document.title = data.blog.seoTitle || data.blog.title;
      } else {
        toast.error("بلاگ یافت نشد");
      }
    } catch (error) {
      console.log("Error fetching blog:", error);
      toast.error("خطا در دریافت بلاگ");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch("/api/blog");
      const data = await response.json();

      if (response.ok) {
        // Get 3 random blogs for related section
        const shuffled = data.blogs.sort(() => 0.5 - Math.random());
        setRelatedBlogs(shuffled.slice(0, 3));
      }
    } catch (error) {
      console.log("Error fetching related blogs:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <i className="fas fa-exclamation-triangle text-6xl text-gray-300 mb-4"></i>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              بلاگ یافت نشد
            </h1>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <i className="fas fa-arrow-right"></i>
              بازگشت به لیست بلاگ‌ها
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24" dir="rtl">
      <article className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600">
                خانه
              </Link>
            </li>
            <li>
              <i className="fas fa-chevron-left text-xs"></i>
            </li>
            <li>
              <Link href="/blog" className="hover:text-blue-600">
                وبلاگ
              </Link>
            </li>
            <li>
              <i className="fas fa-chevron-left text-xs"></i>
            </li>
            <li className="text-gray-900 truncate">{blog.title}</li>
          </ol>
        </nav>

        {/* Blog Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="mb-6">
            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {blog.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <i className="fas fa-user"></i>
                {/* <span>{blog.userId.name || blog.userId.username || 'نویسنده'}</span> */}
              </div>

              <div className="flex items-center gap-2">
                <i className="fas fa-calendar"></i>
                <span>{formatDate(blog.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2">
                <i className="fas fa-clock"></i>
                <span>{blog.readTime} دقیقه مطالعه</span>
              </div>

              {blog.updatedAt !== blog.createdAt && (
                <div className="flex items-center gap-2">
                  <i className="fas fa-edit"></i>
                  <span>آخرین بروزرسانی: {formatDate(blog.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Image */}
          {blog.image && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}
        </motion.header>

        {/* Blog Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Second Image */}
          {blog.secondImage && (
            <div className="mt-8 rounded-lg overflow-hidden">
              <img
                src={blog.secondImage}
                alt="تصویر تکمیلی"
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            اشتراک‌گذاری این مقاله
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const url = window.location.href;
                const text = `${blog.title} - ${blog.description}`;
                if (navigator.share) {
                  navigator.share({ title: blog.title, text, url });
                } else {
                  navigator.clipboard.writeText(url);
                  toast.success("لینک کپی شد");
                }
              }}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <i className="fas fa-share"></i>
              اشتراک‌گذاری
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("لینک کپی شد");
              }}
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <i className="fas fa-copy"></i>
              کپی لینک
            </button>
          </div>
        </motion.div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              مقالات مرتبط
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs
                .filter((relatedBlog) => relatedBlog._id !== blog._id)
                .slice(0, 3)
                .map((relatedBlog) => (
                  <Link
                    key={relatedBlog._id}
                    href={`/blog/${relatedBlog._id}`}
                    className="group block"
                  >
                    <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {relatedBlog.image ? (
                        <img
                          src={relatedBlog.image}
                          alt={relatedBlog.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <i className="fas fa-blog text-2xl text-white/70"></i>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {relatedBlog.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{relatedBlog.readTime} دقیقه</span>
                          <span>{formatDate(relatedBlog.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </motion.section>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <i className="fas fa-arrow-right"></i>
            بازگشت به لیست بلاگ‌ها
          </Link>
        </div>
      </article>
    </div>
  );
}
