"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiSend,
  FiHome,
  FiDollarSign,
  FiHelpCircle,
  FiMapPin,
} from "react-icons/fi";

type FormType = "general" | "property" | "support";

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ElementType;
  required?: boolean;
}

const formTypes = [
  { id: "general", label: "تماس عمومی", icon: FiMessageSquare },
  { id: "property", label: "درخواست ملک", icon: FiHome },
  { id: "support", label: "پشتیبانی", icon: FiHelpCircle },
];

const generalFields: FormField[] = [
  {
    id: "name",
    label: "نام و نام خانوادگی",
    type: "text",
    placeholder: "نام خود را وارد کنید",
    icon: FiUser,
    required: true,
  },
  {
    id: "email",
    label: "ایمیل",
    type: "email",
    placeholder: "ایمیل خود را وارد کنید",
    icon: FiMail,
    required: true,
  },
  {
    id: "phone",
    label: "شماره تماس",
    type: "tel",
    placeholder: "شماره تماس خود را وارد کنید",
    icon: FiPhone,
  },
  {
    id: "message",
    label: "پیام",
    type: "textarea",
    placeholder: "پیام خود را بنویسید",
    icon: FiMessageSquare,
    required: true,
  },
];

const propertyFields: FormField[] = [
  {
    id: "name",
    label: "نام و نام خانوادگی",
    type: "text",
    placeholder: "نام خود را وارد کنید",
    icon: FiUser,
    required: true,
  },
  {
    id: "email",
    label: "ایمیل",
    type: "email",
    placeholder: "ایمیل خود را وارد کنید",
    icon: FiMail,
    required: true,
  },
  {
    id: "phone",
    label: "شماره تماس",
    type: "tel",
    placeholder: "شماره تماس خود را وارد کنید",
    icon: FiPhone,
    required: true,
  },
  {
    id: "propertyType",
    label: "نوع ملک",
    type: "select",
    placeholder: "نوع ملک مورد نظر را انتخاب کنید",
    icon: FiHome,
    required: true,
  },
  {
    id: "budget",
    label: "بودجه (تومان)",
    type: "number",
    placeholder: "بودجه مورد نظر خود را وارد کنید",
    icon: FiDollarSign,
    required: true,
  },
  {
    id: "location",
    label: "منطقه مورد نظر",
    type: "text",
    placeholder: "منطقه مورد نظر خود را وارد کنید",
    icon: FiMapPin,
  },
  {
    id: "requirements",
    label: "توضیحات و نیازمندی‌ها",
    type: "textarea",
    placeholder: "توضیحات و نیازمندی‌های خود را بنویسید",
    icon: FiMessageSquare,
  },
];

const supportFields: FormField[] = [
  {
    id: "name",
    label: "نام و نام خانوادگی",
    type: "text",
    placeholder: "نام خود را وارد کنید",
    icon: FiUser,
    required: true,
  },
  {
    id: "email",
    label: "ایمیل",
    type: "email",
    placeholder: "ایمیل خود را وارد کنید",
    icon: FiMail,
    required: true,
  },
  {
    id: "phone",
    label: "شماره تماس",
    type: "tel",
    placeholder: "شماره تماس خود را وارد کنید",
    icon: FiPhone,
    required: true,
  },
  {
    id: "subject",
    label: "موضوع",
    type: "text",
    placeholder: "موضوع پیام خود را وارد کنید",
    icon: FiHelpCircle,
    required: true,
  },
  {
    id: "message",
    label: "پیام",
    type: "textarea",
    placeholder: "پیام خود را بنویسید",
    icon: FiMessageSquare,
    required: true,
  },
];

const propertyTypes = [
  "آپارتمان مسکونی",
  "خانه ویلایی",
  "دفتر کار",
  "مغازه تجاری",
  "زمین",
  "باغ و ویلا",
  "سوله صنعتی",
  "سایر",
];

const ContactForm = () => {
  const [formType, setFormType] = useState<FormType>("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form submitted:", { formType, ...formData });
      setIsSuccess(true);
      setFormData({});

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentFields = () => {
    switch (formType) {
      case "property":
        return propertyFields;
      case "support":
        return supportFields;
      default:
        return generalFields;
    }
  };

  return (
    <div dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">ارسال پیام</h2>

        {/* Form Type Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {formTypes.map((type) => (
              <motion.button
                key={type.id}
                type="button"
                onClick={() => setFormType(type.id as FormType)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  formType === type.id
                    ? "bg-[#01ae9b] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <type.icon size={18} />
                <span>{type.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">
                  پیام شما با موفقیت ارسال شد. کارشناسان ما در اسرع وقت با شما
                  تماس خواهند گرفت.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getCurrentFields().map((field) => (
              <div
                key={field.id}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute right-3 top-3 text-gray-400">
                    <field.icon size={18} />
                  </div>

                  {field.type === "textarea" ? (
                    <textarea
                      id={field.id}
                      name={field.id}
                      placeholder={field.placeholder}
                      rows={4}
                      required={field.required}
                      onChange={handleInputChange}
                      className="w-full pr-10 py-2 px-4 text-right text-gray-600 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent transition-colors resize-none"
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={field.id}
                      name={field.id}
                      required={field.required}
                      onChange={handleInputChange}
                      className="w-full pr-10 py-2 px-4 text-right text-gray-600 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent transition-colors appearance-none bg-white"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.id === "propertyType" &&
                        propertyTypes.map((type, index) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={handleInputChange}
                      className="w-full pr-10 py-2 px-4 text-right text-gray-600 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01ae9b] focus:border-transparent transition-colors"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <motion.div
            className="mt-8 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#01ae9b] hover:bg-[#019485]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  در حال ارسال...
                </>
              ) : (
                <>
                  <FiSend size={18} />
                  ارسال پیام
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactForm;
