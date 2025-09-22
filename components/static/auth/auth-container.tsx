"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaUser, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  isValidNumber,
  isValidPhoneNumber,
  persianToLatinDigits,
} from "@/utils/digitConvertor";

type FormMode = "login" | "signup";

interface FormErrors {
  [key: string]: string;
}

interface ApiResponse {
  message: string;
  status: number;
  token: string;
}

export default function AuthPageContainer() {
  const router = useRouter();
  const [mode, setMode] = useState<FormMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    phone: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [signupErrors, setSignupErrors] = useState<FormErrors>({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Success/Error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [adminRedirectMessage, setAdminRedirectMessage] = useState("");
  const [contactRedirectMessage, setContactRedirectMessage] = useState("");

  useEffect(() => {
    // Check for admin redirect flag
    const adminRedirect = localStorage.getItem("adminRedirect");
    if (adminRedirect === "true") {
      setAdminRedirectMessage(
        "برای دسترسی به پنل مدیریت، ابتدا وارد حساب کاربری خود شوید"
      );
    }

    // Check for contact redirect flag
    const contactRedirect = localStorage.getItem("contactRedirect");
    if (contactRedirect === "true") {
      setContactRedirectMessage(
        "برای مشاهده اطلاعات تماس آگهی دهنده، ابتدا وارد حساب کاربری خود شوید"
      );
    }
  }, []);

  const handleModeSwitch = (newMode: FormMode) => {
    if (isLoading) return;

    setMode(newMode);
    setLoginErrors({});
    setSignupErrors({});
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Validate password (only letters and numbers)
  const isValidPassword = (password: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(password);
  };

  // Handle login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!isValidNumber(value)) {
        toast.error("لطفاً فقط اعداد وارد کنید");
        return;
      }
      const convertedValue = persianToLatinDigits(value);
      setLoginForm((prev) => ({ ...prev, [name]: convertedValue }));
    } else if (name === "password") {
      if (value && !isValidPassword(value)) {
        toast.error("رمز عبور فقط باید شامل حروف و اعداد باشد");
        return;
      }
      setLoginForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginForm((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user types
    if (loginErrors[name]) {
      setLoginErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear messages
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Handle signup form changes
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!isValidNumber(value)) {
        toast.error("لطفاً فقط اعداد وارد کنید");
        return;
      }
      const convertedValue = persianToLatinDigits(value);
      setSignupForm((prev) => ({ ...prev, [name]: convertedValue }));
    } else if (name === "password" || name === "confirmPassword") {
      if (value && !isValidPassword(value)) {
        toast.error("رمز عبور فقط باید شامل حروف و اعداد باشد");
        return;
      }
      setSignupForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setSignupForm((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user types
    if (signupErrors[name]) {
      setSignupErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear messages
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Validate login form
  const validateLoginForm = () => {
    const errors: FormErrors = {};

    // Phone validation
    if (!loginForm.phone) {
      errors.phone = "شماره موبایل الزامی است";
    } else if (!isValidPhoneNumber(loginForm.phone)) {
      errors.phone = "شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود";
    }

    // Password validation
    if (!loginForm.password) {
      errors.password = "رمز عبور الزامی است";
    } else if (loginForm.password.length < 6) {
      errors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    } else if (!isValidPassword(loginForm.password)) {
      errors.password = "رمز عبور فقط باید شامل حروف و اعداد باشد";
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate signup form
  const validateSignupForm = () => {
    const errors: FormErrors = {};

    // Name validation
    if (!signupForm.name.trim()) {
      errors.name = "نام و نام خانوادگی الزامی است";
    } else if (signupForm.name.trim().length < 2) {
      errors.name = "نام باید حداقل ۲ کاراکتر باشد";
    }

    // Phone validation
    if (!signupForm.phone) {
      errors.phone = "شماره موبایل الزامی است";
    } else if (!isValidPhoneNumber(signupForm.phone)) {
      errors.phone = "شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود";
    }

    // Password validation
    if (!signupForm.password) {
      errors.password = "رمز عبور الزامی است";
    } else if (signupForm.password.length < 6) {
      errors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    } else if (!isValidPassword(signupForm.password)) {
      errors.password = "رمز عبور فقط باید شامل حروف و اعداد باشد";
    }

    // Confirm password validation
    if (!signupForm.confirmPassword) {
      errors.confirmPassword = "تکرار رمز عبور الزامی است";
    } else if (signupForm.confirmPassword !== signupForm.password) {
      errors.confirmPassword = "رمز عبور مطابقت ندارد";
    } else if (!isValidPassword(signupForm.confirmPassword)) {
      errors.confirmPassword = "رمز عبور فقط باید شامل حروف و اعداد باشد";
    }

    // Terms validation
    if (!termsAccepted) {
      errors.terms = "پذیرش قوانین و مقررات الزامی است";
    }

    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: loginForm.phone,
          password: loginForm.password,
        }),
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.token) {
        setSuccessMessage(data.message || "ورود با موفقیت انجام شد");
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("authChange"));

        const shouldRedirectToAdmin =
          localStorage.getItem("adminRedirect") === "true";
        const shouldRedirectToContact =
          localStorage.getItem("contactRedirect") === "true";
        const contactRedirectUrl = localStorage.getItem("contactRedirectUrl");

        setTimeout(() => {
          if (shouldRedirectToAdmin) {
            localStorage.removeItem("adminRedirect");
            toast.success("در حال انتقال به پنل مدیریت...");
            router.replace("/admin");
          } else if (shouldRedirectToContact && contactRedirectUrl) {
            localStorage.removeItem("contactRedirect");
            localStorage.removeItem("contactRedirectUrl");
            toast.success("در حال بازگشت به صفحه قبلی...");
            router.replace(contactRedirectUrl);
          } else {
            toast.success("در حال انتقال به صفحه اصلی...");
            router.replace("/");
          }
        }, 1000);
      } else {
        setErrorMessage(data.message || "خطا در ورود. لطفاً دوباره تلاش کنید.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup form submission
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSignupForm()) return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupForm.name.trim(),
          phone: signupForm.phone,
          password: signupForm.password,
        }),
      });

      const data: ApiResponse = await response.json();

      if (data.status === 201) {
        toast.success("ثبت نام با موفقیت انجام شد");

        // Clear form
        setSignupForm({
          name: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        setTermsAccepted(false);

        // Switch to login mode after successful signup
        setTimeout(() => {
          handleModeSwitch("login");
          setLoginForm({
            phone: signupForm.phone,
            password: "",
          });
        }, 2000);
      } else {
        setErrorMessage(data.message || "خطا در ثبت نام");
      }
    } catch (error) {
      console.log("Signup error:", error);
      setErrorMessage("خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row py-10 md:py-0 md:mb-14"
      >
        {/* Left Side - Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="md:w-1/2 bg-gradient-to-br from-[#01ae9b] to-[#66308d] p-12 hidden md:flex flex-col justify-between relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="absolute inset-0 ">
            <Image
              src="/assets/images/hero2.png"
              alt="Real Estate"
              fill
              className="object-cover brightness-50"
            />
          </div>

          <div className="relative z-10" dir="rtl">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-4">مشاور املاک اوج</h1>
              <p className="text-white/90 text-lg">
                همراه شما در مسیر خانه دار شدن
              </p>
            </div>
          </div>

          <div className="relative z-10" dir="rtl">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
              <p className="text-white text-lg leading-relaxed">
                با عضویت در سایت مشاور املاک اوج، به راحتی میتوانید به هزاران
                آگهی ملک دسترسی داشته باشید و از مشاوره های تخصصی ما بهره مند
                شوید.
              </p>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 left-16 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="md:w-1/2 p-12"
        >
          {/* Mode Switch */}
          <div className="relative h-14 mb-10 bg-gray-100 rounded-2xl w-full mx-auto overflow-hidden">
            <div className="flex h-full relative z-10">
              <button
                className={`flex-1 h-full flex items-center justify-center font-semibold transition-colors duration-300 ${
                  mode === "login" ? "text-white" : "text-gray-600"
                }`}
                onClick={() => handleModeSwitch("login")}
                type="button"
                disabled={isLoading}
              >
                ورود
              </button>
              <button
                className={`flex-1 h-full flex items-center justify-center font-semibold transition-colors duration-300 ${
                  mode === "signup" ? "text-white" : "text-gray-600"
                }`}
                onClick={() => handleModeSwitch("signup")}
                type="button"
                disabled={isLoading}
              >
                ثبت نام
              </button>
            </div>
            <motion.div
              animate={{ x: mode === "login" ? "0%" : "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#01ae9b] to-[#66308d] rounded-2xl shadow-lg"
            />
          </div>

          {/* Admin Redirect Message */}
          {adminRedirectMessage && (
            <div className="mb-6 p-4 rounded-2xl text-center font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {adminRedirectMessage}
            </div>
          )}

          {/* Contact Redirect Message */}
          {contactRedirectMessage && (
            <div className="mb-6 p-4 rounded-2xl text-center font-medium bg-green-50 text-green-700 border border-green-200">
              {contactRedirectMessage}
            </div>
          )}

          {/* Success/Error Messages */}
          {(successMessage || errorMessage) && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className={`mb-6 p-4 rounded-2xl text-center font-medium ${
                successMessage
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {successMessage || errorMessage}
            </motion.div>
          )}

          {mode === "login" ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, stagger: 0.1, ease: "easeOut" }}
              onSubmit={handleLoginSubmit}
              className="space-y-6 text-right"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  خوش آمدید
                </h2>
              </div>

              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaPhone />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="شماره موبایل"
                  value={loginForm.phone}
                  onChange={handleLoginChange}
                  disabled={isLoading}
                  className={`w-full px-12 py-4 text-black bg-gray-50 rounded-2xl text-right border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#01ae9b]/50 ${
                    loginErrors.phone
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-[#01ae9b]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {loginErrors.phone && (
                  <p className="text-red-500 text-sm mt-2 text-right">
                    {loginErrors.phone}
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock />
                </div>
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#01ae9b] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="رمز عبور"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  disabled={isLoading}
                  className={`w-full px-12 py-4 text-black bg-gray-50 rounded-2xl text-right border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#01ae9b]/50 ${
                    loginErrors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-[#01ae9b]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {loginErrors.password && (
                  <p className="text-red-500 text-sm mt-2 text-right">
                    {loginErrors.password}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r cursor-pointer from-[#01ae9b] to-[#66308d] hover:from-[#66308d] hover:to-[#01ae9b] text-white rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال ورود...
                  </>
                ) : (
                  "ورود"
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, stagger: 0.1, ease: "easeOut" }}
              onSubmit={handleSignupSubmit}
              className="space-y-6 text-right"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  ایجاد حساب کاربری
                </h2>
              </div>

              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="نام و نام خانوادگی"
                  value={signupForm.name}
                  onChange={handleSignupChange}
                  disabled={isLoading}
                  className={`w-full px-12 py-4 text-black bg-gray-50 rounded-2xl text-right border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#01ae9b]/50 ${
                    signupErrors.name
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-[#01ae9b]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {signupErrors.name && (
                  <p className="text-red-500 text-sm mt-2 text-right">
                    {signupErrors.name}
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaPhone />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="شماره موبایل (09xxxxxxxxx)"
                  value={signupForm.phone}
                  onChange={handleSignupChange}
                  disabled={isLoading}
                  className={`w-full px-12 py-4 text-black bg-gray-50 rounded-2xl text-right border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#01ae9b]/50 ${
                    signupErrors.phone
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-[#01ae9b]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {signupErrors.phone && (
                  <p className="text-red-500 text-sm mt-2 text-right">
                    {signupErrors.phone}
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock />
                </div>
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#01ae9b] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="رمز عبور (حداقل 6 کاراکتر)"
                  value={signupForm.password}
                  onChange={handleSignupChange}
                  disabled={isLoading}
                  className={`w-full px-12 py-4 text-black bg-gray-50 rounded-2xl text-right border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#01ae9b]/50 ${
                    signupErrors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-[#01ae9b]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {signupErrors.password && (
                  <p className="text-red-500 text-sm mt-2 text-right">
                    {signupErrors.password}
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock />
                </div>
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#01ae9b] transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="تکرار رمز عبور"
                  value={signupForm.confirmPassword}
                  onChange={handleSignupChange}
                  disabled={isLoading}
                  className={`w-full px-12 py-4 text-black bg-gray-50 rounded-2xl text-right border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#01ae9b]/50 ${
                    signupErrors.confirmPassword
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-[#01ae9b]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {signupErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2 text-right">
                    {signupErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3 justify-end">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-5 h-5 text-[#01ae9b] border-2 border-gray-300 rounded focus:ring-[#01ae9b] focus:ring-2"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-relaxed"
                >
                  با{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-[#01ae9b] hover:text-[#66308d] hover:underline transition-colors duration-200 font-medium"
                  >
                    قوانین و مقررات
                  </Link>{" "}
                  سایت موافقم
                </label>
              </div>
              {signupErrors.terms && (
                <p className="text-red-500 text-sm mt-2 text-right">
                  {signupErrors.terms}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-4 cursor-pointer bg-gradient-to-r from-[#01ae9b] to-[#66308d] hover:from-[#66308d] hover:to-[#01ae9b] text-white rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال ثبت نام...
                  </>
                ) : (
                  "ثبت نام"
                )}
              </motion.button>

              <div className="text-center text-sm text-gray-500 mt-6">
                <p>
                  با ثبت نام، شما عضو خانواده بزرگ املاک ایران میشوید و از خدمات
                  ویژه ما بهرهمند خواهید شد.
                </p>
              </div>
            </motion.form>
          )}

          {/* Additional Links */}
          <div className="mt-10 text-center text-sm text-gray-600">
            <p>
              {mode === "login"
                ? "حساب کاربری ندارید؟"
                : "قبلاً ثبت نام کردهاید؟"}{" "}
              <button
                onClick={() =>
                  handleModeSwitch(mode === "login" ? "signup" : "login")
                }
                disabled={isLoading}
                className="text-[#01ae9b] cursor-pointer duration-300 hover:text-[#66308d] font-medium hover:underline transition-colors disabled:opacity-50"
              >
                {mode === "login" ? "ثبت نام کنید" : "وارد شوید"}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
