"use client";
import { useState, useRef, useEffect, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheck, FaPaperPlane } from "react-icons/fa";

interface CustomFormData {
  [key: string]: string | number | boolean | null;
}
export type FileState = {
  file: File | string;
  key: string; // used to identify the file in the progress callback
  progress: "PENDING" | "COMPLETE" | "ERROR" | number;
};

interface FormErrors {
  [key: string]: string;
}

interface FormSubmissionResponse {
  success: boolean;
  errors?: FormErrors;
  message?: string;
}

interface ContactFormProps {
  onSubmit: (formData: CustomFormData) => Promise<FormSubmissionResponse>;
  serviceTypes: string;
  fields: Field[];
  primaryColor?: string;
  secondaryColor?: string;
  isSubmitting?: boolean;
  externalErrors?: FormErrors;
}

interface Field {
  name: string;
  label: string;
  icon: ReactNode;
  type:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "select"
    | "number"
    | "date"
    | "file";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    min?: number;
    max?: number;
  };
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  serviceTypes,
  fields,
  primaryColor = "purple",
  // secondaryColor = "blue",
  isSubmitting: externalIsSubmitting,
  externalErrors,
}) => {
  const [formData, setFormData] = useState<CustomFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);
  console.log(isSubmitting, focusedField, fileStates);

  // Sync external errors with local errors state
  useEffect(() => {
    if (externalErrors && Object.keys(externalErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...externalErrors }));
    }
  }, [externalErrors]);

  // Sync external isSubmitting with local state
  useEffect(() => {
    if (externalIsSubmitting !== undefined) {
      setIsSubmitting(externalIsSubmitting);
    }
  }, [externalIsSubmitting]);

  // Reset success message when form data changes
  useEffect(() => {
    if (successMessage) {
      setSuccessMessage(null);
    }
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFocus = (name: string) => {
    setFocusedField(name);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} الزامی است`;
        isValid = false;
      }

      // Email validation
      if (field.type === "email" && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const value = String(formData[field.name]);
        if (!emailRegex.test(value)) {
          newErrors[field.name] = "ایمیل معتبر نیست";
          isValid = false;
        }
      }

      // Phone validation
      if (field.type === "tel" && formData[field.name]) {
        const phoneRegex = /^[0-9]{11}$/;
        const value = String(formData[field.name]);
        if (!phoneRegex.test(value)) {
          newErrors[field.name] = "شماره تماس باید 11 رقم باشد";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorField);
      errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Only set isSubmitting if not controlled externally
    if (externalIsSubmitting === undefined) {
      setIsSubmitting(true);
    }

    try {
      // Add service type and file to form data
      const submissionData: CustomFormData = {
        ...formData,
        serviceTypes,
        file: selectedFile ? selectedFile.name : null,
      };

      // Call the onSubmit function passed as prop
      const result = await onSubmit(submissionData);

      if (result.success) {
        // Show success message
        setSuccessMessage(
          "اطلاعات شما با موفقیت ارسال شد. کارشناسان ما به زودی با شما تماس خواهند گرفت."
        );

        // Reset form after successful submission
        setFormData({});
        setSelectedFile(null);

        // Reset form fields
        if (formRef.current) {
          formRef.current.reset();
        }
      } else if (result.errors) {
        // Update errors state with returned errors
        setErrors((prev) => ({ ...prev, ...result.errors }));

        // Scroll to the first error
        const firstErrorField = Object.keys(result.errors)[0];
        const errorElement = document.getElementById(firstErrorField);
        errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      setSuccessMessage(null);
      // Handle submission error
      setErrors({
        ...errors,
        general: "خطا در ارسال فرم. لطفا دوباره تلاش کنید.",
      });
    } finally {
      // Only update isSubmitting if not controlled externally
      if (externalIsSubmitting === undefined) {
        setIsSubmitting(false);
      }
    }
  };

  const handleFileRemove = (index: number) => {
    setFileStates((prev) => prev.filter((_, i) => i !== index));
    setUploadedFileUrl("");
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, file: "" }));
  };

  const getColorClasses = (
    type: "primary" | "secondary" | "light" | "focus"
  ) => {
    const colorMap: Record<string, Record<string, string>> = {
      purple: {
        primary: "bg-purple-600 hover:bg-purple-700 text-white",
        secondary: "text-purple-600",
        light: "bg-purple-50",
        focus: "border-purple-500 ring-purple-500",
      },
      blue: {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "text-blue-600",
        light: "bg-blue-50",
        focus: "border-blue-500 ring-blue-500",
      },
      green: {
        primary: "bg-green-600 hover:bg-green-700 text-white",
        secondary: "text-green-600",
        light: "bg-green-50",
        focus: "border-green-500 ring-green-500",
      },
    };

    return colorMap[primaryColor]?.[type] || colorMap.purple[type];
  };

  return (
    <div className="relative">
      {/* Display general error if it exists */}

      <AnimatePresence>
        {successMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${getColorClasses("light")} border ${getColorClasses(
              "secondary"
            ).replace("text-", "border-")} rounded-lg p-6 text-center mb-8`}
          >
            <div className="flex justify-center mb-4">
              <div className={`${getColorClasses("light")} p-3 rounded-full`}>
                <FaCheck size={30} className={getColorClasses("secondary")} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              درخواست شما با موفقیت ثبت شد
            </h3>
            <p className="mb-4 text-gray-600">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className={`${getColorClasses(
                "primary"
              )} px-6 py-2 rounded-lg transition-colors`}
            >
              ثبت درخواست جدید
            </button>
          </motion.div>
        ) : (
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => {
                const isFieldFocused = focusedField === field.name;

                if (field.type === "textarea") {
                  return (
                    <div key={field.name} className="md:col-span-2">
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-200"
                      >
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <div className="relative">
                        <motion.textarea
                          id={field.name}
                          name={field.name}
                          rows={4}
                          value={String(formData[field.name] || "")}
                          onChange={handleChange}
                          onFocus={() => handleFocus(field.name)}
                          onBlur={handleBlur}
                          animate={
                            isFieldFocused ? { scale: [1, 1.02, 1] } : {}
                          }
                          transition={{ duration: 0.3 }}
                          className={`block w-full rounded-md border-gray-300 text-black shadow-sm focus:ring-2 sm:text-sm p-3 placeholder-gray-400 
                            ${
                              errors[field.name]
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : `focus:${getColorClasses("focus")}`
                            }
                            ${isFieldFocused ? getColorClasses("focus") : ""}
                            transition-all duration-200
                          `}
                          placeholder={
                            field.placeholder ||
                            `${field.label} را وارد کنید...`
                          }
                        />
                        {field.icon && (
                          <div
                            className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${
                              isFieldFocused
                                ? getColorClasses("secondary")
                                : "text-gray-400"
                            }`}
                          >
                            {field.icon}
                          </div>
                        )}
                      </div>
                      <AnimatePresence>
                        {errors[field.name] && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {errors[field.name]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                } else if (field.type === "select") {
                  return (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <motion.select
                        id={field.name}
                        name={field.name}
                        value={String(formData[field.name] || "")}
                        onChange={handleChange}
                        onFocus={() => handleFocus(field.name)}
                        onBlur={handleBlur}
                        animate={isFieldFocused ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ duration: 0.3 }}
                        className={`block w-full rounded-md border-gray-300 text-black shadow-sm focus:ring-2 sm:text-sm p-3
                          ${
                            errors[field.name]
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : `focus:${getColorClasses("focus")}`
                          }
                          ${isFieldFocused ? getColorClasses("focus") : ""}
                          transition-all duration-200
                        `}
                      >
                        <option value="">
                          {field.placeholder || "انتخاب کنید"}
                        </option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </motion.select>
                      <AnimatePresence>
                        {errors[field.name] && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {errors[field.name]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                if (field.type === "file") {
                  return (
                    <div key={field.name} className="md:col-span-2">
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>

                      {/* <MultiImageDropzone
                        value={fileStates}
                        onChange={setFileStates}
                        onFilesAdded={handleFilesAdded}
                        dropzoneOptions={{
                          maxFiles: 1,
                          maxSize: 5 * 1024 * 1024, // 5MB
                          accept: {
                            "application/pdf": [".pdf"],
                            "application/msword": [".doc"],
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                              [".docx"],
                            "image/jpeg": [".jpg", ".jpeg"],
                            "image/png": [".png"],
                          },
                        }}
                        className="w-full"
                      /> */}

                      {uploadedFileUrl && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-2 text-sm ${getColorClasses(
                            "secondary"
                          )} flex items-center gap-2`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          فایل با موفقیت آپلود شد
                          <button
                            type="button"
                            onClick={() => handleFileRemove(0)}
                            className="text-red-500 hover:text-red-700 mr-2"
                          >
                            حذف
                          </button>
                        </motion.div>
                      )}

                      <AnimatePresence>
                        {errors[field.name] && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {errors[field.name]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                } else {
                  return (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <div className="relative">
                        <motion.input
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          value={String(formData[field.name] || "")}
                          onChange={handleChange}
                          onFocus={() => handleFocus(field.name)}
                          onBlur={handleBlur}
                          animate={
                            isFieldFocused ? { scale: [1, 1.02, 1] } : {}
                          }
                          transition={{ duration: 0.3 }}
                          className={`block w-full rounded-md text-black border-gray-300 shadow-sm focus:ring-2 sm:text-sm p-3 
                            ${field.icon ? "pr-10" : ""} 
                            ${
                              errors[field.name]
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : `focus:${getColorClasses("focus")}`
                            }
                            ${isFieldFocused ? getColorClasses("focus") : ""}
                            placeholder-gray-400 transition-all duration-200
                          `}
                          placeholder={
                            field.placeholder ||
                            `${field.label} را وارد کنید...`
                          }
                        />
                        {field.icon && (
                          <div
                            className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${
                              isFieldFocused
                                ? getColorClasses("secondary")
                                : "text-gray-400"
                            }`}
                          >
                            {field.icon}
                          </div>
                        )}
                      </div>
                      <AnimatePresence>
                        {errors[field.name] && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {errors[field.name]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
              })}
            </div>
            {/* {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6"
              >
                <p className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.general}
                </p>
              </motion.div>
            )} */}

            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                whileHover={{
                  scale: 1.03,
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex justify-center items-center gap-2 rounded-md border border-transparent ${getColorClasses(
                  "primary"
                )} px-6 py-3 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${primaryColor}-500 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                } transition-all duration-300`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    <FaPaperPlane />
                    ارسال درخواست
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
export type { CustomFormData, FormSubmissionResponse, FormErrors };
