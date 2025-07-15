"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Consultant } from "@/types/type";
import { FaUsers } from "react-icons/fa";
import ConsultantFilters, { FilterState } from "./consultantFilters";
import ConsultantCard from "./consultantCard";

const ConsultantsList = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [allConsultants, setAllConsultants] = useState<Consultant[]>([]); // Store all consultants
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    workArea: "",
    minExperience: "",
    sortBy: "experience",
  });

  const fetchConsultants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/consultants`);
      const data = await res.json();
      console.log(data);

      if (data.success) {
        setAllConsultants(data.consultants); // Store all consultants
        applyFiltersAndSort(data.consultants, filters); // Apply initial filters
      }
    } catch (error) {
      console.log("Error fetching consultants:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFiltersAndSort = useCallback(
    (consultantsList: Consultant[], currentFilters: FilterState) => {
      let filteredConsultants = [...consultantsList];

      // Apply search filter
      if (currentFilters.search.trim()) {
        const searchTerm = currentFilters.search.toLowerCase().trim();
        filteredConsultants = filteredConsultants.filter(
          (consultant) =>
            consultant.name.toLowerCase().includes(searchTerm) ||
            consultant.specialties?.some((specialty) =>
              specialty.toLowerCase().includes(searchTerm)
            )
        );
      }

      // Apply work area filter
      if (currentFilters.workArea) {
        filteredConsultants = filteredConsultants.filter((consultant) =>
          consultant.workAreas?.includes(currentFilters.workArea)
        );
      }

      // Apply minimum experience filter
      if (currentFilters.minExperience) {
        const minExp = parseInt(currentFilters.minExperience);
        filteredConsultants = filteredConsultants.filter(
          (consultant) => consultant.experienceYears >= minExp
        );
      }

      // Apply sorting
      switch (currentFilters.sortBy) {
        case "rating":
          filteredConsultants.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "posters":
          filteredConsultants.sort((a, b) => b.posterCount - a.posterCount);
          break;
        case "name":
          filteredConsultants.sort((a, b) =>
            a.name.localeCompare(b.name, "fa")
          );
          break;
        case "experience":
        default:
          filteredConsultants.sort(
            (a, b) => b.experienceYears - a.experienceYears
          );
          break;
      }

      setConsultants(filteredConsultants);
    },
    []
  );

  // Fetch consultants on component mount
  useEffect(() => {
    fetchConsultants();
  }, [fetchConsultants]);

  // Apply filters when filters change
  useEffect(() => {
    if (allConsultants.length > 0) {
      applyFiltersAndSort(allConsultants, filters);
    }
  }, [filters, allConsultants, applyFiltersAndSort]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };



  return (
    <div className="container mx-auto mt-20 px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <FaUsers className="text-3xl text-[#01ae9b]" />
          <h1 className="text-3xl font-bold text-gray-800">
            مشاوران املاک اوج
          </h1>
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
              {consultants.length} مشاور یافت شد
              {filters.search && ` برای "${filters.search}"`}
            </span>
          )}
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
    </div>
  );
};

export default ConsultantsList;
