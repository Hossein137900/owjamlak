"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaPlus, FaSave, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { FiTrash2, FiEye, FiEdit2 } from "react-icons/fi";
import { FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { Admin } from "@/types/type";
import { User } from "@/types/type"; // type User

const AdminManager = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]); //
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    image: "",
    position: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchAdminUsers();
    fetchAdmins();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch("/api/admins/adminRole");
      const data = await res.json();
      setAdminUsers(data.users);
    } catch (error) {
      console.log("Error fetching admin users:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admins");
      const data = await res.json();
      setAdmins(data.admins);
    } catch (error) {
      console.log("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingAdmin ? "PUT" : "POST";
      const url = editingAdmin
        ? `/api/admins/${editingAdmin._id}`
        : "/api/admins";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(
          editingAdmin ? "اطلاعات با موفقیت ویرایش شد" : "مدیر با موفقیت ثبت شد"
        );
        await fetchAdmins();
        resetForm();
        setShowForm(false);
      } else {
        toast.error(
          editingAdmin ? "خطا در ویرایش اطلاعات" : "خطا در ثبت اطلاعات"
        );
      }
    } catch (error) {
      console.log("Error saving admin:", error);
      toast.error(
        editingAdmin ? "خطا در ویرایش اطلاعات" : "خطا در ثبت اطلاعات"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admins/${adminToDelete._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("مدیر با موفقیت حذف شد");
        await fetchAdmins();
        setShowDeleteModal(false);
        setAdminToDelete(null);
      } else {
        toast.error("خطا در حذف مدیر");
      }
    } catch (error) {
      console.log("Error deleting admin:", error);
      toast.error("خطا در حذف مدیر");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      userId: admin.user._id,
      email: admin.email || "",
      image: admin.image,
      position: admin.position,
      description: admin.description || "",
      isActive: admin.isActive,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      userId: "",
      email: "",
      image: "",
      position: "",
      description: "",
      isActive: true,
    });
    setEditingAdmin(null);
  };

  const handleUserSelect = (userId: string) => {
    const selectedUser = adminUsers.find((u) => u._id === userId);
    if (selectedUser) {
      setFormData((prev) => ({
        ...prev,
        userId,
        // name/phone auto-fill نمی‌خوایم در فرم، چون read-only در جدول
      }));
    }
  };

  if (loading && admins.length === 0) {
    return (
      <div className="h-64 bg-transparent flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری مدیران...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="md:text-2xl text-base font-bold text-gray-500">مدیریت مدیران</h1>
          <p className="text-gray-600 text-xs md:text-base">{admins.length} عدد در لیست مدیران</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 text-xs md:text-base bg-[#01ae9b] text-white px-4 py-2 rounded-lg hover:bg-[#019688] transition-colors"
        >
          <FaPlus />
          <span>افزودن مدیر جدید</span>
        </button>
      </div>

      {/* Admins List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مدیر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تماس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  سمت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          src={
                            admin.image || "/assets/images/default-admin.jpg"
                          }
                          alt={admin.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {admin.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {admin.user?.phone || "-"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {admin.user?.phone || "-"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {admin.email || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {admin.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        admin.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {admin.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          window.open(`/admins/${admin._id}`, "_blank")
                        }
                        className="text-blue-600 hover:text-blue-900"
                        title="مشاهده"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="ویرایش"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setAdminToDelete(admin);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="حذف"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {admins.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">هیچ مدیری یافت نشد</p>
          </div>
        )}
      </div>

      {/* Delete Modal - مشابه Consultant */}
      <AnimatePresence>
        {showDeleteModal && adminToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  حذف مدیر
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  آیا از حذف مدیر {adminToDelete.name} اطمینان دارید؟
                  <br />
                  این عمل قابل بازگشت نیست.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <FiTrash2 className="text-sm" />
                    <span>{isDeleting ? "در حال حذف..." : "حذف"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setAdminToDelete(null);
                    }}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <FaTimes className="text-sm" />
                    <span>انصراف</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md max-h-[70vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">
                  {editingAdmin ? "ویرایش مدیر" : "افزودن مدیر جدید"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Select User */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    کاربر مدیر *
                  </label>
                  <select
                    required
                    value={formData.userId}
                    onChange={(e) => handleUserSelect(e.target.value)}
                    className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01ae9b]"
                  >
                    <option value="">انتخاب مدیر...</option>
                    {adminUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} - {user.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full p-3 border text-black placeholder:text-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01ae9b]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    سمت و جایگاه *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        position: e.target.value,
                      }))
                    }
                    placeholder="مثال: مدیرعامل"
                    className="w-full p-3 border text-black placeholder:text-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01ae9b]"
                  />
                </div>

                {/* Image Upload - مشابه Consultant، اما endpoint /api/admins/images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تصویر مدیر
                  </label>
                  <div className="space-y-3">
                    {formData.image && (
                      <div className="relative inline-block">
                        <Image
                          src={formData.image}
                          alt="تصویر مدیر"
                          width={100}
                          height={100}
                          className="w-20 h-20 rounded-full object-cover border"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await fetch("/api/admins/images", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  imageUrl: formData.image,
                                }),
                              });
                              setFormData((prev) => ({ ...prev, image: "" }));
                            } catch (error) {
                              console.log("Error deleting image:", error);
                            }
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        id="adminImage"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setImageUploading(true);
                          try {
                            const formDataUpload = new FormData();
                            formDataUpload.append("image", file);

                            const response = await fetch("/api/admins/images", {
                              method: "POST",
                              body: formDataUpload,
                            });

                            const result = await response.json();
                            if (response.ok) {
                              setFormData((prev) => ({
                                ...prev,
                                image: result.imageUrl,
                              }));
                              toast.success("تصویر با موفقیت آپلود شد");
                            } else {
                              toast.error(
                                result.message || "خطا در آپلود تصویر"
                              );
                            }
                          } catch (error) {
                            console.log("Error uploading image:", error);
                            toast.error("خطا در آپلود تصویر");
                          } finally {
                            setImageUploading(false);
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="adminImage"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        {imageUploading ? (
                          <FiLoader className="w-8 h-8 text-gray-400 mb-2 animate-spin" />
                        ) : (
                          <FaPlus className="w-8 h-8 text-gray-400 mb-2" />
                        )}
                        <span className="text-sm text-gray-500">
                          {imageUploading ? "در حال آپلود..." : "انتخاب تصویر"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    توضیحات
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="اختیاری"
                    rows={3}
                    className="w-full p-3 border text-black placeholder:text-gray-300 focus:outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-[#01ae9b] focus:ring-[#01ae9b]"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    فعال
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#01ae9b] text-white px-6 py-2 rounded-lg hover:bg-[#019688] transition-colors disabled:opacity-50"
                  >
                    <FaSave />
                    <span>{loading ? "در حال ذخیره..." : "ذخیره"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <FaTimes />
                    <span>انصراف</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminManager;
