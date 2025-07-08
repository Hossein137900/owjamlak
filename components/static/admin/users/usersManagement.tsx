import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiUserPlus,
  FiFilter,
  FiLoader,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface ApiResponse {
  success: boolean;
  users?: User[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  message?: string;
  error?: string;
}

interface User {
  _id: string;
  name: string;
  phone: string;
  password?: string;
  role: "admin" | "user" | "superadmin" | "consultant";
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  status?: "active" | "inactive";
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showPasswords, setShowPasswords] = useState<{
    [key: string]: boolean;
  }>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    password: "",
    role: "user" as "admin" | "user" | "superadmin" | "consultant",
  });
  const [editFormErrors, setEditFormErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  // Add these state variables after existing state declarations
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isChangingPage, setIsChangingPage] = useState(false);

  // Fetch users from API
  const fetchUsers = async (showLoader = true, page = 1) => {
    const token = localStorage.getItem("token");
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      // Add search parameter
      if (searchTerm) {
        queryParams.append("search", searchTerm);
      }

      // Add role filter
      if (selectedRole !== "all") {
        queryParams.append("role", selectedRole);
      }

      // Add status filter
      if (selectedStatus !== "all") {
        queryParams.append("status", selectedStatus);
      }

      const response = await fetch(`/api/auth?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      console.log("API Response:", data);

      if (data.success && data.users) {
        // Add default status if not present
        const usersWithStatus = data.users.map((user: User) => ({
          ...user,
          status: user.status || ("active" as "active" | "inactive"),
        }));

        setUsers(usersWithStatus);
        setFilteredUsers(usersWithStatus); // For pagination, we don't need client-side filtering

        // Update pagination info
        if (data.pagination) {
          setPagination(data.pagination);
        }

        setError(null);
      } else {
        throw new Error(data.message || "No users data received");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        err instanceof Error ? err.message : "خطا در دریافت اطلاعات کاربران"
      );
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsChangingPage(false);
    }
  };
  useEffect(() => {
    fetchUsers(true, 1); // Reset to page 1 when filters change
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [searchTerm, selectedRole, selectedStatus]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch("/api/auth", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("کاربر با موفقیت حذف شد");
        setShowDeleteModal(false);
        setUserToDelete(null);
      } else {
        throw new Error(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err instanceof Error ? err.message : "خطا در حذف کاربر");
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      phone: user.phone,
      password: "",
      role: user.role,
    });
    setEditFormErrors({});
    setShowEditModal(true);
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (editFormErrors[name]) {
      setEditFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateEditForm = () => {
    const errors: { [key: string]: string } = {};

    if (!editFormData.name.trim()) {
      errors.name = "نام الزامی است";
    }

    if (!editFormData.phone.trim()) {
      errors.phone = "شماره تلفن الزامی است";
    } else if (!/^09\d{9}$/.test(editFormData.phone.trim())) {
      errors.phone = "شماره تلفن معتبر نیست";
    }

    if (!editFormData.role) {
      errors.role = "نقش الزامی است";
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEditForm() || !editingUser) return;

    setIsSubmittingEdit(true);

    try {
      const response = await fetch("/api/auth", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: editingUser._id,
          name: editFormData.name.trim(),
          phone: editFormData.phone.trim(),
          password: editFormData.password.trim(),
          role: editFormData.role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("کاربر با موفقیت ویرایش شد");
        // Update users in state
        const updatedUsers = users.map((user) =>
          user._id === editingUser._id
            ? { ...user, ...editFormData, password: user.password } // Keep original password for display
            : user
        );

        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setShowEditModal(false);
        setEditingUser(null);
        setEditFormData({ name: "", phone: "", password: "", role: "user" });

        // Optional: Show success message
        console.log(data.message);
      } else {
        setError(data.message || "خطا در ویرایش کاربر");
        toast.success("خطا در ویرایش کاربر");
      }
    } catch (err) {
      toast.success("خطا در ویرایش کاربر");

      console.log("Error editing user:", err);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({ name: "", phone: "", password: "", role: "user" });
    setEditFormErrors({});
  };
  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fa-IR");
    } catch {
      return dateString;
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Get role display name
  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: "مدیر",
      user: "کاربر",
      superadmin: "مدیر کل",
      consultant: "مشاور",
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  // Get role color
  const getRoleColor = (role: string) => {
    const roleColors = {
      admin: "bg-blue-100 text-blue-800",
      user: "bg-gray-100 text-gray-800",
      superadmin: "bg-purple-100 text-purple-800",
      consultant: "bg-green-100 text-green-800",
    };
    return (
      roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800"
    );
  };

  // Add these functions after existing functions
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && !isChangingPage) {
      setIsChangingPage(true);
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
      fetchUsers(false, newPage);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      handlePageChange(pagination.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      handlePageChange(pagination.currentPage - 1);
    }
  };

  // const handleLimitChange = (newLimit: number) => {
  //   setPagination((prev) => ({ ...prev, limit: newLimit, currentPage: 1 }));
  //   fetchUsers(true, 1);
  // };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-md"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <FiLoader className="text-4xl text-[#66308d]" />
          </motion.div>
          <p className="text-gray-600">در حال بارگذاری کاربران...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="text-center py-10">
          <FiAlertCircle className="text-6xl text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            خطا در بارگذاری
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchUsers()}
            className="bg-[#66308d] hover:bg-[#4a1f5f] text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            تلاش مجدد
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            مدیریت کاربران
          </h1>
          <span className="bg-[#66308d] text-white px-3 py-1 rounded-full text-sm">
            {pagination.totalUsers} کاربر
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو نام، تلفن، نقش..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#66308d] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#66308d] focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">همه نقش‌ها</option>
              <option value="user">کاربر</option>
              <option value="admin">مدیر</option>
              <option value="consultant">مشاور</option>
              <option value="superadmin">مدیر کل</option>
            </select>
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchUsers(false)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 bg-[#01ae9b] hover:bg-[#017a6b] text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <motion.div
              animate={refreshing ? { rotate: 360 } : {}}
              transition={
                refreshing
                  ? { duration: 1, repeat: Infinity, ease: "linear" }
                  : {}
              }
            >
              <FiRefreshCw />
            </motion.div>
            <span className="hidden sm:inline">بروزرسانی</span>
          </motion.button>

          {/* Add User Button */}
          <button className="flex items-center justify-center gap-2 bg-[#66308d] hover:bg-[#4a1f5f] text-white px-4 py-2 rounded-lg transition-colors duration-200">
            <FiUserPlus />
            <span>کاربر جدید</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                نام کاربر
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                شماره تماس
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                نقش
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                رمز عبور
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                تاریخ ثبت نام
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                آخرین بروزرسانی
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                وضعیت
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ backgroundColor: "rgba(102, 48, 141, 0.05)" }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#66308d] to-[#01ae9b] flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {user.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {getRoleDisplayName(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {showPasswords[user._id] && user.password
                        ? user.password.substring(0, 20) + "..."
                        : "••••••••"}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(user._id)}
                      className="text-gray-400 hover:text-[#66308d] transition-colors duration-200"
                      title={
                        showPasswords[user._id] ? "مخفی کردن رمز" : "نمایش رمز"
                      }
                    >
                      {showPasswords[user._id] ? (
                        <FiEyeOff size={16} />
                      ) : (
                        <FiEye size={16} />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.updatedAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "inactive"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {user.status === "inactive" ? "غیرفعال" : "فعال"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      className="text-[#01ae9b] hover:text-[#017a6b] transition-colors duration-200"
                      title="مشاهده جزئیات"
                    >
                      <FiEye className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditUser(user)}
                      className="text-[#66308d] hover:text-[#4a1f5f] transition-colors duration-200"
                      title="ویرایش کاربر"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setUserToDelete(user);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      title="حذف کاربر"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#66308d]/20 to-[#01ae9b]/20 rounded-full flex items-center justify-center">
            <FiSearch className="text-4xl text-[#66308d]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            کاربری یافت نشد
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || selectedStatus !== "all" || selectedRole !== "all"
              ? "هیچ کاربری با فیلترهای انتخابی پیدا نشد"
              : "هنوز هیچ کاربری ثبت نشده است"}
          </p>
        </motion.div>
      )}

      {/* Pagination */}
      {/* Enhanced Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            نمایش {(pagination.currentPage - 1) * pagination.limit + 1} تا{" "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalUsers
            )}{" "}
            از {pagination.totalUsers} کاربر
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <motion.button
              whileHover={pagination.hasPrevPage ? { scale: 1.05 } : {}}
              whileTap={pagination.hasPrevPage ? { scale: 0.95 } : {}}
              onClick={handlePrevPage}
              disabled={!pagination.hasPrevPage || isChangingPage}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {isChangingPage && pagination.currentPage > 1 ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                "قبلی"
              )}
            </motion.button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, index) => {
                  let pageNumber;
                  if (pagination.totalPages <= 5) {
                    pageNumber = index + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNumber = index + 1;
                  } else if (
                    pagination.currentPage >=
                    pagination.totalPages - 2
                  ) {
                    pageNumber = pagination.totalPages - 4 + index;
                  } else {
                    pageNumber = pagination.currentPage - 2 + index;
                  }

                  return (
                    <motion.button
                      key={pageNumber}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={isChangingPage}
                      className={`px-3 py-2 rounded-md text-sm transition-colors duration-200 disabled:cursor-not-allowed ${
                        pageNumber === pagination.currentPage
                          ? "bg-[#66308d] text-white"
                          : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </motion.button>
                  );
                }
              )}
            </div>

            {/* Next Button */}
            <motion.button
              whileHover={pagination.hasNextPage ? { scale: 1.05 } : {}}
              whileTap={pagination.hasNextPage ? { scale: 0.95 } : {}}
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage || isChangingPage}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {isChangingPage &&
              pagination.currentPage < pagination.totalPages ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                "بعدی"
              )}
            </motion.button>
          </div>

          {/* Page Info */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            صفحه {pagination.currentPage} از {pagination.totalPages}
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUserModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  جزئیات کاربر {selectedUser.name}
                </h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#66308d] to-[#01ae9b] flex items-center justify-center text-white font-bold text-2xl">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {getRoleDisplayName(selectedUser.role)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    شناسه کاربر
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    {selectedUser._id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    شماره تماس
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    {selectedUser.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    نقش کاربری
                  </label>
                  <span
                    className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getRoleColor(
                      selectedUser.role
                    )}`}
                  >
                    {getRoleDisplayName(selectedUser.role)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    وضعیت
                  </label>
                  <span
                    className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                      selectedUser.status === "inactive"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {selectedUser.status === "inactive" ? "غیرفعال" : "فعال"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    تاریخ ثبت نام
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    آخرین بروزرسانی
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    {formatDate(selectedUser.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-start gap-3">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                بستن
              </button>
            
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <FiTrash2 className="text-2xl text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                حذف کاربر
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                آیا از حذف کاربر <strong>{userToDelete.name}</strong> اطمینان
                دارید؟
                <br />
                این عمل قابل بازگشت نیست.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  انصراف
                </button>
                <button
                  onClick={() => deleteUser(userToDelete._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  حذف کاربر
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseEditModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  ویرایش کاربر {editingUser.name}
                </h2>
                <button
                  onClick={handleCloseEditModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  نام کاربر *
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66308d] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    editFormErrors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="نام کاربر را وارد کنید"
                />
                {editFormErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {editFormErrors.name}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  شماره تلفن *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66308d] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    editFormErrors.phone
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="09xxxxxxxxx"
                />
                {editFormErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {editFormErrors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  رمز عبور جدید
                </label>
                <input
                  type="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66308d] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="خالی بگذارید تا تغییر نکند"
                />
                <p className="text-gray-500 text-xs mt-1">
                  اگر می‌خواهید رمز عبور تغییر نکند، این فیلد را خالی بگذارید
                </p>
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  نقش کاربری *
                </label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditFormChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66308d] focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    editFormErrors.role
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <option value="user">کاربر</option>
                  <option value="admin">مدیر</option>
                  <option value="consultant">مشاور</option>
                  <option value="superadmin">مدیر کل</option>
                </select>
                {editFormErrors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {editFormErrors.role}
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={isSubmittingEdit}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                >
                  انصراف
                </button>
                <motion.button
                  type="submit"
                  disabled={isSubmittingEdit}
                  whileHover={!isSubmittingEdit ? { scale: 1.05 } : {}}
                  whileTap={!isSubmittingEdit ? { scale: 0.95 } : {}}
                  className="px-4 py-2 bg-[#66308d] text-white rounded-lg hover:bg-[#4a1f5f] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmittingEdit ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      در حال ذخیره...
                    </>
                  ) : (
                    "ذخیره تغییرات"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UsersManagement;
