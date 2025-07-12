"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Consultant } from "@/types/type";
import { FaUsers } from "react-icons/fa";
import ConsultantFilters, { FilterState } from "./consultantFilters";
import ConsultantCard from "./consultantCard";

interface ConsultantsListProps {
  initialConsultants: Consultant[];
}

const ConsultantsList: React.FC<ConsultantsListProps> = ({
  initialConsultants,
}) => {
  const [consultants, setConsultants] =
    useState<Consultant[]>(initialConsultants);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: initialConsultants.length,
    pages: Math.ceil(initialConsultants.length / 12),
  });
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    workArea: "",
    minExperience: "",
    sortBy: "experience",
  });

  const fetchConsultants = useCallback(
    async (newFilters: FilterState, page: number = 1) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pagination.limit.toString(),
          ...(newFilters.search && { search: newFilters.search }),
          ...(newFilters.workArea && { workArea: newFilters.workArea }),
          ...(newFilters.minExperience && {
            minExperience: newFilters.minExperience,
          }),
        });

        const res = await fetch(`/api/consultants?${queryParams}`);
        const data = await res.json();

        if (data.success) {
          // Apply client-side sorting
          let sortedConsultants = [...data.consultants];
          switch (newFilters.sortBy) {
            case "rating":
              sortedConsultants.sort(
                (a, b) => (b.rating || 0) - (a.rating || 0)
              );
              break;
            case "posters":
              sortedConsultants.sort((a, b) => b.posterCount - a.posterCount);
              break;
            case "name":
              sortedConsultants.sort((a, b) =>
                a.name.localeCompare(b.name, "fa")
              );
              break;
            case "experience":
            default:
              sortedConsultants.sort(
                (a, b) => b.experienceYears - a.experienceYears
              );
              break;
          }

          setConsultants(sortedConsultants);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error fetching consultants:", error);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    fetchConsultants(newFilters, 1);
  };

  const handlePageChange = (page: number) => {
    fetchConsultants(filters, page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <FaUsers className="text-3xl text-[#01ae9b]" />
          <h1 className="text-3xl font-bold text-gray-800">مشاوران املاک</h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 text-lg max-w-2xl mx-auto"
        >
          با بهترین مشاوران املاک در تماس باشید. مشاوران با تجربه و متخصص در
          زمینه خرید و فروش املاک
        </motion.p>
      </div>

      {/* Filters */}
      <ConsultantFilters
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">
          {loading ? (
            <span>در حال جستجو...</span>
          ) : (
            <span>
              {pagination.total} مشاور یافت شد
              {filters.search && ` برای "${filters.search}"`}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">
          صفحه {pagination.page} از {pagination.pages}
        </div>
      </div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {consultants.map((consultant, index) => (
          <ConsultantCard
            key={consultant._id}
            consultant={consultant}
            index={index}
          />
        ))}
      </div>

      {/* Empty State */}
      {!loading && consultants.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            مشاوری یافت نشد
          </h3>
          <p className="text-gray-500 mb-4">
            با تغییر فیلترها یا جستجوی جدید دوباره تلاش کنید
          </p>
          <button
            onClick={() =>
              handleFilterChange({
                search: "",
                workArea: "",
                minExperience: "",
                sortBy: "experience",
              })
            }
            className="bg-[#01ae9b] text-white px-6 py-2 rounded-lg hover:bg-[#019688] transition-colors"
          >
            مشاهده همه مشاوران
          </button>
        </motion.div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1 || loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            قبلی
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const pageNum = Math.max(1, pagination.page - 2) + i;
            if (pageNum > pagination.pages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pageNum === pagination.page
                    ? "bg-[#01ae9b] text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages || loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsultantsList;
