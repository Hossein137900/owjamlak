"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaPlus, FaSave, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { Consultant, User } from "@/types/type";
import toast from "react-hot-toast";
import { FiEdit2, FiEye, FiLoader, FiTrash2 } from "react-icons/fi";

const ConsultantManager = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingConsultant, setEditingConsultant] = useState<Consultant | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [consultantToDelete, setConsultantToDelete] =
    useState<Consultant | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
   const [imageUploading, setImageUploading] = useState(false);
  const [consultantUsers, setConsultantUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    userId: "", // 👈 جدید: ID یوزر انتخابی
    name: "",
    phone: "", // این رو می‌تونی read-only کنی بر اساس user انتخابی
    whatsapp: "",
    email: "",
    image: "",
    experienceYears: 0,
    workAreas: [""],
    specialties: [""],
    description: "",
    rating: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchConsultantUsers();
    fetchConsultants();
  }, []);

  const fetchConsultantUsers = async () => {
    try {
      const res = await fetch("/api/consultants/consultantsRole");
      const data = await res.json();
      setConsultantUsers(data.users);
    } catch (error) {
      console.log("Error fetching consultant users:", error);
    }
  };

  const fetchConsultants = async () => {
    try {
      const res = await fetch("/api/consultants");
      const data = await res.json();
      setConsultants(data.consultants);
    } catch (error) {
      console.log("Error fetching consultants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingConsultant ? "PUT" : "POST";
      const url = editingConsultant
        ? `/api/consultants/${editingConsultant._id}`
        : "/api/consultants";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: formData.userId, // 👈 بفرست userId
          workAreas: formData.workAreas.filter((area) => area.trim()),
          specialties: formData.specialties.filter((specialty) =>
            specialty.trim()
          ),
        }),
      });

      if (res.ok) {
        toast.success(
          editingConsultant
            ? "اطلاعات با موفقیت ویرایش شد"
            : "مشاور با موفقیت ثبت شد"
        );
        await fetchConsultants();
        resetForm();
        setShowForm(false);
      } else {
        toast.error(
          editingConsultant ? "خطا در ویرایش اطلاعات" : "خطا در ثبت اطلاعات"
        );
      }
    } catch (error) {
      console.log("Error saving consultant:", error);
      toast.error(
        editingConsultant ? "خطا در ویرایش اطلاعات" : "خطا در ثبت اطلاعات"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (consultant: Consultant) => {
    setConsultantToDelete(consultant);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!consultantToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/consultants/${consultantToDelete._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("مشاور با موفقیت حذف شد");
        await fetchConsultants();
        setShowDeleteModal(false);
        setConsultantToDelete(null);
      } else {
        toast.error("خطا در حذف مشاور");
      }
    } catch (error) {
      console.log("Error deleting consultant:", error);
      toast.error("خطا در حذف مشاور");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setConsultantToDelete(null);
  };

  const handleEdit = (consultant: Consultant) => {
    setEditingConsultant(consultant);
    setFormData({
      name: consultant.name,
      phone: consultant.phone,
      whatsapp: consultant.whatsapp,
      email: consultant.email || "",
      image: consultant.image,
      experienceYears: consultant.experienceYears,
      workAreas: consultant.workAreas,
      specialties: consultant.specialties || [""],
      description: consultant.description || "",
      rating: consultant.rating || 0,
      isActive: consultant.isActive,
      userId: consultant?.user?._id,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      whatsapp: "",
      email: "",
      image: "",
      experienceYears: 0,
      workAreas: [""],
      specialties: [""],
      description: "",
      rating: 0,
      isActive: true,
      userId: "",
    });
    setEditingConsultant(null);
  };

  const handleUserSelect = (userId: string) => {
    const selectedUser = consultantUsers.find((u) => u._id === userId);
    if (selectedUser) {
      setFormData((prev) => ({
        ...prev,
        userId,
        name: selectedUser.name,
        phone: selectedUser.phone, // auto-fill از User
      }));
    }
  };

  const addWorkArea = () => {
    setFormData((prev) => ({
      ...prev,
      workAreas: [...prev.workAreas, ""],
    }));
  };

  const removeWorkArea = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workAreas: prev.workAreas.filter((_, i) => i !== index),
    }));
  };

  const updateWorkArea = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      workAreas: prev.workAreas.map((area, i) => (i === index ? value : area)),
    }));
  };

  const addSpecialty = () => {
    setFormData((prev) => ({
      ...prev,
      specialties: [...prev.specialties, ""],
    }));
  };

  const removeSpecialty = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  const updateSpecialty = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.map((specialty, i) =>
        i === index ? value : specialty
      ),
    }));
  };

  if (loading && consultants.length === 0) {
    return (
      <div className="h-64 bg-transparent flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-[#01ae9b] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری مشاوران...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          {" "}
          <h1 className="text-2xl font-bold text-gray-500">مدیریت مشاوران</h1>
          <p className="text-gray-600">
            {consultants.length} عدد در لیست مشاورین
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#01ae9b] text-white px-4 py-2 rounded-lg hover:bg-[#019688] transition-colors"
        >
          <FaPlus />
          <span>افزودن مشاور جدید</span>
        </button>
      </div>

      {/* Consultants List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مشاور
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تماس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تجربه
                </th>

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  امتیاز
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
              {consultants.map((consultant) => (
                <tr key={consultant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          src={
                            consultant.image ||
                            "/assets/images/default-consultant.jpg"
                          }
                          alt={consultant.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {consultant.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {/* {consultant.workAreas.slice(0, 2).join(", ")} */}
                          {/* {consultant.workAreas.length > 2 && "..."} */}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {consultant.phone}
                    </div>
                    <div className="text-sm text-gray-500">
                      {consultant.whatsapp}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultant.experienceYears} سال
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">
                        {consultant.rating || "-"}
                      </span>
                      {consultant.rating && (
                        <span className="text-yellow-400 mr-1">★</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        consultant.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {consultant.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          window.open(`/consultant/${consultant._id}`, "_blank")
                        }
                        className="text-blue-600 hover:text-blue-900"
                        title="مشاهده"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(consultant)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="ویرایش"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(consultant)}
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

        {consultants.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">هیچ مشاوری یافت نشد</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && consultantToDelete && (
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
                  حذف مشاور
                </h3>

                <p className="text-sm text-gray-500 mb-6">
                  آیا از حذف مشاور {consultantToDelete.name} اطمینان دارید؟
                  <br />
                  این عمل قابل بازگشت نیست.
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 className="text-sm" />
                    <span>{isDeleting ? "در حال حذف..." : "حذف"}</span>
                  </button>

                  <button
                    onClick={handleDeleteCancel}
                    disabled={isDeleting}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
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
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[70vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">
                  {editingConsultant ? "ویرایش مشاور" : "افزودن مشاور جدید"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      کاربر مشاور *
                    </label>
                    <select
                      required
                      value={formData.userId}
                      onChange={(e) => handleUserSelect(e.target.value)}
                      className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01ae9b]"
                    >
                      <option value="">انتخاب مشاور...</option>
                      {consultantUsers.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} - {user.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نام مشاور *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="نام و نام خانوادگی مشاور"
                      value={formData.name}
                      readOnly // 👈 read-only، چون از user می‌آد
                      className="w-full p-3 border text-black bg-gray-100 border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شماره تلفن *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      readOnly
                      className="w-full p-3 border text-black bg-gray-100 border-gray-300 rounded-lg"
                      placeholder="09123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      واتساپ *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          whatsapp: e.target.value,
                        }))
                      }
                      className="w-full p-3 border text-black placeholder:text-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01ae9b]"
                      placeholder="09123456789"
                    />
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
                      سال تجربه *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={
                        formData.experienceYears === 0
                          ? ""
                          : formData.experienceYears
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          experienceYears: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="سال تجربه را وارد کنید"
                      className="w-full p-3 border text-black placeholder:text-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01ae9b]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      امتیاز (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating === 0 ? "" : formData.rating}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          rating: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="امتیاز بین 1 تا 5"
                      className="w-full p-3 border text-black placeholder:text-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01ae9b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تصویر مشاور
                  </label>
                  <div className="space-y-3">
                    {formData.image && (
                      <div className="relative inline-block">
                        <Image
                          src={formData.image}
                          alt="تصویر مشاور"
                          width={100}
                          height={100}
                          className="w-20 h-20 rounded-full object-cover border"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await fetch("/api/consultants/image", {
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
                        id="consultantImage"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setImageUploading(true);
                          try {
                            const formDataUpload = new FormData();
                            formDataUpload.append("image", file);

                            const response = await fetch(
                              "/api/consultants/image",
                              {
                                method: "POST",
                                body: formDataUpload,
                              }
                            );

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
                        htmlFor="consultantImage"
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
                    className="w-full p-3 border text-black placeholder:text-gray-300 focus:outline-none border-gray-300 rounded-lg  focus:ring-2 focus:ring-[#01ae9b]"
                  />
                </div>

                {/* Work Areas */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      مناطق فعالیت *
                    </label>
                    <button
                      type="button"
                      onClick={addWorkArea}
                      className="text-[#01ae9b] hover:text-[#019688] text-sm"
                    >
                      + افزودن منطقه
                    </button>
                  </div>
                  {formData.workAreas &&
                    formData.workAreas.map((area, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={area}
                          onChange={(e) =>
                            updateWorkArea(index, e.target.value)
                          }
                          className="flex-1 p-2 text-black border placeholder:text-gray-300 focus:outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b]"
                          placeholder="نام منطقه"
                        />
                        {formData.workAreas &&
                          formData.workAreas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeWorkArea(index)}
                              className="text-red-500 hover:text-red-700 px-2"
                            >
                              <FaTimes />
                            </button>
                          )}
                      </div>
                    ))}
                </div>

                {/* Specialties */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      تخصص‌ها
                    </label>
                    <button
                      type="button"
                      onClick={addSpecialty}
                      className="text-[#01ae9b] hover:text-[#019688] text-sm"
                    >
                      + افزودن تخصص
                    </button>
                  </div>
                  {formData.specialties.map((specialty, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => updateSpecialty(index, e.target.value)}
                        className="flex-1 text-black p-2 border placeholder:text-gray-300 focus:outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b]"
                        placeholder="تخصص"
                      />
                      {formData.specialties &&
                        formData.specialties.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSpecialty(index)}
                            className="text-red-500 hover:text-red-700 px-2"
                          >
                            <FaTimes />
                          </button>
                        )}
                    </div>
                  ))}
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

export default ConsultantManager;
