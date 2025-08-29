"use client";
import   { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { WorkItem, worksData } from "../../data/data";
import { MdClose } from "react-icons/md";
interface OurWorksProps {
  works: WorkItem[];
}

export default function OurWorks({ works }: OurWorksProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(works);
  const categories = [
    { id: "all", label: "همه" },
    { id: "residential", label: "مسکونی" },
    { id: "commercial", label: "تجاری" },
    { id: "rental", label: "اجاره" },
    { id: "consultation", label: "مشاوره" },
  ];

  const filteredWorks =
    activeCategory === "all"
      ? worksData
      : worksData.filter((work) => work.category === activeCategory);

  const openModal = (work: WorkItem) => {
    setSelectedWork(work);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-[#66308d]">نمونه </span>
          <span className="text-gray-800">کارهای ما</span>
        </h2>
        <div className="w-20 h-1 bg-[#01ae9b] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ما با افتخار نمونه‌ای از پروژه‌های موفق خود را به شما نشان می‌دهیم.
          اعتماد مشتریان ما بزرگترین سرمایه ماست.
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 mb-10"
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(category.id)}
            className={`px-5 py-2 rounded-full text-sm md:text-base transition-all duration-300 ${
              activeCategory === category.id
                ? "bg-[#66308d] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
          >
            {category.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Works Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredWorks.map((work) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
            whileHover={{ y: -10 }}
            className="bg-white rounded-xl cursor-pointer overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            onClick={() => openModal(work)}
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src={work.imagePath}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-150 hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
              <div className="absolute bottom-4 right-4 left-4">
                <span className="inline-block px-3 py-1 bg-[#01ae9b]/90 text-white text-xs rounded-full mb-2">
                  {categories.find((c) => c.id === work.category)?.label}
                </span>
                <h3 className="text-white text-xl font-bold">{work.title}</h3>
                <p className="text-white/90 text-sm">{work.location}</p>
              </div>
            </div>
            <div className="p-4 text-right">
              <p className="text-gray-600 text-sm line-clamp-2">
                {work.description}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[#66308d] text-sm font-medium hover:text-[#01ae9b] transition-colors"
                >
                  مشاهده جزئیات
                </motion.button>
                <span className="text-gray-500 text-sm">
                  {work.completionDate}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredWorks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-gray-400 text-5xl mb-4">
            <i className="fas fa-search"></i>
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            نتیجه‌ای یافت نشد
          </h3>
          <p className="text-gray-500">
            در این دسته‌بندی هنوز پروژه‌ای ثبت نشده است.
          </p>
        </motion.div>
      )}

      {/* Detail Modal */}
      {isModalOpen && selectedWork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-xl overflow-hidden max-w-7xl w-full max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="relative h-72 sm:h-96">
              <Image
                src={selectedWork.imagePath}
                alt={selectedWork.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 70vw"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 left-4 bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white transition-colors"
                aria-label="Close modal"
              >
                <MdClose size={20} />
              </button>

              <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <span className="inline-block px-3 py-1 bg-[#01ae9b] text-white text-sm rounded-full mb-2">
                  {
                    categories.find((c) => c.id === selectedWork.category)
                      ?.label
                  }
                </span>
                <h2 className="text-white text-2xl sm:text-3xl font-bold">
                  {selectedWork.title}
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="text-gray-500">موقعیت:</span>
                  <span className="font-medium text-black mr-2">
                    {selectedWork.location}
                  </span>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="text-gray-500">تاریخ تکمیل:</span>
                  <span className="font-medium text-black mr-2">
                    {selectedWork.completionDate}
                  </span>
                </div>
                {selectedWork.clientName && (
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <span className="text-gray-500">کارفرما:</span>
                    <span className="font-medium text-black mr-2">
                      {selectedWork.clientName}
                    </span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold mb-4 text-gray-800">
                درباره این پروژه
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {selectedWork.description}
              </p>

              {selectedWork.testimonial && (
                <div className="bg-gray-50 border-r-4 border-[#66308d] p-4 rounded-lg mb-6">
                  <p className="text-gray-600 italic mb-2">
                    {selectedWork.testimonial}
                  </p>
                  <p className="text-[#01ae9b] font-medium">
                    — {selectedWork.clientName}
                  </p>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#66308d] text-white px-6 py-3 rounded-lg hover:bg-[#66308d]/90 transition-colors"
                  onClick={closeModal}
                >
                  بستن
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
