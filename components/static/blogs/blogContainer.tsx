"use client";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import Link from "next/link";
import BlogGrid from "@/components/static/blogs/blogGrid";
import { useState, useEffect } from "react";
import { Blog } from "@/data/data";

const BlogContainer = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  // const [isOpen, setIsOpen] = useState(false);
  // const [selectedOption, setSelectedOption] = useState("newest");

  useEffect(() => {
    fetch("/api/blog", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.log("Failed to load blogs:", err));
  }, []);
  // const toggleDropdown = () => setIsOpen(!isOpen);

  // const selectOption = (value: string) => {
  //   setSelectedOption(value);
  //   setIsOpen(false);
  // };

  return (
    <div className="container mx-auto mt-20 px-4 py-12" dir="rtl">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#01ae9b] to-[#01ae9b] rounded-2xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/images/blog-pattern.png')] opacity-10"></div>
        <div className="relative z-10 py-16 px-8 md:px-16 text-white text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            وبلاگ تخصصی املاک
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-blue-100">
            آخرین مقالات، راهنماها و تحلیل‌های تخصصی در زمینه خرید، فروش، اجاره
            و سرمایه‌گذاری در بازار املاک ایران
          </p>
        </div>
      </div>

      {/* Featured Article */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 border-r-4 border-[#66308d] pr-4">
            مقاله ویژه
          </h2>
          {blogs.length > 0 ? (
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                <div className="lg:col-span-3 relative h-64 lg:h-auto">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${blogs[0].coverImage}')` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white lg:hidden">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold inline-block mb-3">
                      {blogs[0].category}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{blogs[0].title}</h3>
                    <p className="text-sm text-gray-200 mb-2">
                      {blogs[0].excerpt}
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-2 p-8">
                  <div className="hidden lg:block">
                    <div className="bg-[#66308d] text-white px-3 py-1 rounded-full text-xs font-semibold inline-block mb-3">
                      {blogs[0].category}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">
                      {blogs[0].title}
                    </h3>
                    <p className="text-gray-600 mb-6">{blogs[0].excerpt}</p>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-6 space-x-4 rtl:space-x-reverse">
                    <div className="flex items-center">
                      <FaCalendarAlt className="ml-1 rtl:ml-0 rtl:mr-1" />
                      <span>{blogs[0].date}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="ml-1 rtl:ml-0 rtl:mr-1" />
                      <span>{blogs[0].readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">
                        {blogs[0].author}
                      </span>
                    </div>
                    <Link
                      href={`/blogs/${blogs[0].id}`}
                      className="bg-[#66308d] hover:bg-[#66308d]/80 text-white px-5 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      ادامه مطلب
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              هنوز مقاله‌ای منتشر نشده است
            </div>
          )}
        </div>

        {/* Filter and Sort */}
        <div className="flex flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-gray-500 pr-4 mb-4 md:mb-0">
            آخرین مقالات
          </h2>
        </div>

        {/* Blog Grid */}
        <BlogGrid blogs={blogs.length > 1 ? blogs.slice(1) : []} />

        {/* Newsletter */}
        {/* <div className="mt-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              عضویت در خبرنامه املاک
            </h3>
            <p className="text-gray-600 mb-6">
              با عضویت در خبرنامه ما، از آخرین مقالات، تحلیل‌های بازار و
              فرصت‌های سرمایه‌گذاری مطلع شوید.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 rtl:space-x-reverse">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-grow px-5 py-3 rounded-lg placeholder:text-black/40 border-white border focus:outline-none focus:ring-2 focus:ring-blue-500 rtl:text-right"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors whitespace-nowrap">
                عضویت در خبرنامه
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default BlogContainer;
