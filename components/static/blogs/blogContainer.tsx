"use client";
import { FaSearch, FaCalendarAlt, FaClock } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import BlogGrid from "@/components/static/blogs/blogGrid";
import { blogs } from "@/data/data";
import { useState } from "react";

const BlogContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("newest");
  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  const options = [
    { value: "newest", label: "جدیدترین" },
    { value: "popular", label: "محبوب‌ترین" },
    { value: "trending", label: "پربازدیدترین" },
  ];

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

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center bg-white rounded-full overflow-hidden p-1 shadow-lg">
              <input
                type="text"
                placeholder="جستجو در مقالات..."
                className="w-full px-5 py-3 text-gray-700 focus:outline-none rtl:text-right"
              />
              <button className="bg-[#66308d] hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Article */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 border-r-4 border-[#66308d] pr-4">
            مقاله ویژه
          </h2>
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
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden relative">
                      <Image
                        src={`/images/authors/${blogs[0].author
                          .toLowerCase()
                          .replace(/\s+/g, "-")}.jpg`}
                        alt={blogs[0].author}
                        fill
                        className="object-cover"
                      />
                    </div>
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
        </div>

        {/* Filter and Sort */}
        <div className="flex flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-gray-500 pr-4 mb-4 md:mb-0">
            آخرین مقالات
          </h2>
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#66308d] hover:border-[#66308d] transition-all cursor-pointer shadow-sm w-40"
              >
                <span>
                  {options.find((opt) => opt.value === selectedOption)?.label}
                </span>
                <svg
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute right-0 z-50 mt-1 w-40 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-lg shadow-lg  py-1 overflow-hidden">
                  {options.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => selectOption(option.value)}
                      className={`px-4 py-2.5 cursor-pointer hover:bg-gray-100 transition-colors ${
                        selectedOption === option.value
                          ? "bg-[#66308d]/10 text-[#66308d] font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <BlogGrid blogs={blogs.slice(1)} />

        {/* Newsletter */}
        <div className="mt-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-8 md:p-12">
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
        </div>
      </div>
    </div>
  );
};

export default BlogContainer;
