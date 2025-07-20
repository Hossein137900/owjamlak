"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { FaUser, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const [rememberMe, setRememberMe] = useState(false);

  // Success/Error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));

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
    setSignupForm((prev) => ({ ...prev, [name]: value }));

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
    } else if (!/^(09|\+989)\d{9}$/.test(loginForm.phone)) {
      errors.phone = "شماره موبایل نامعتبر است";
    }

    // Password validation
    if (!loginForm.password) {
      errors.password = "رمز عبور الزامی است";
    } else if (loginForm.password.length < 6) {
      errors.password = "رمز عبور باید حداقل 6 کاراکتر باشد";
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
      errors.name = "نام باید حداقل 2 کاراکتر باشد";
    }

    // Phone validation
    if (!signupForm.phone) {
      errors.phone = "شماره موبایل الزامی است";
    } else if (!/^(09|\+989)\d{9}$/.test(signupForm.phone)) {
      errors.phone = "شماره موبایل نامعتبر است";
    }

    // Password validation
    if (!signupForm.password) {
      errors.password = "رمز عبور الزامی است";
    } else if (signupForm.password.length < 6) {
      errors.password = "رمز عبور باید حداقل 6 کاراکتر باشد";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/.test(
        signupForm.password
      )
    ) {
      errors.password = "رمز عبور باید شامل حروف بزرگ، کوچک و اعداد باشد";
    }

    // Confirm password validation
    if (!signupForm.confirmPassword) {
      errors.confirmPassword = "تکرار رمز عبور الزامی است";
    } else if (signupForm.confirmPassword !== signupForm.password) {
      errors.confirmPassword = "رمز عبور مطابقت ندارد";
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
      console.log(data);

      if (data.token) {
        setSuccessMessage(data.message || "ورود با موفقیت انجام شد");

        // Store user data if needed
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Redirect after successful login
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setErrorMessage(data.message || "خطا در ورود");
      }
    } catch (error) {
      console.log("Login error:", error);
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
          setMode("login");
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const switchVariants = {
    login: { x: 0 },
    signup: { x: "100%" },
  };

  return (
    <div
      className={`min-h-screen ${
        mode === "login" ? "" : "mt-24"
      } flex items-center justify-center p-4`}
    >
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Image */}
        <div className="md:w-1/2 bg-green-500 p-8 hidden md:flex flex-col justify-between relative">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/assets/images/aboutus1.png"
              alt="Real Estate"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white"
            >
              <h1 className="text-3xl font-bold mb-2">مشاور املاک اوج</h1>
              <p className="text-white/80">همراه شما در مسیر خانه‌دار شدن</p>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative z-10"
          >
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <p className="text-white text-sm leading-relaxed">
                با عضویت در سایت مشاور املاک اوج، به راحتی می‌توانید به هزاران
                آگهی ملک دسترسی داشته باشید و از مشاوره‌های تخصصی ما بهره‌مند
                شوید.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8">
          {/* Mode Switch */}
          <div className="relative h-12 mb-8 bg-gray-100 rounded-lg w-64 mx-auto">
            <div className="flex h-full">
              <button
                className={`flex-1 h-full flex items-center justify-center relative z-10 ${
                  mode === "login" ? "text-white" : "text-gray-500"
                }`}
                onClick={() => setMode("login")}
                type="button"
                disabled={isLoading}
              >
                ورود
              </button>
              <button
                className={`flex-1 h-full flex items-center justify-center relative z-10 ${
                  mode === "signup" ? "text-white" : "text-gray-500"
                }`}
                onClick={() => setMode("signup")}
                type="button"
                disabled={isLoading}
              >
                ثبت نام
              </button>
            </div>
            <motion.div
              className="absolute top-0 left-0 w-1/2 h-full bg-green-500 rounded-lg"
              variants={switchVariants}
              animate={mode}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Success/Error Messages */}
          <AnimatePresence>
            {(successMessage || errorMessage) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-4 p-4 rounded-lg text-center ${
                  successMessage
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {successMessage || errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login-form"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleLoginSubmit}
                className="space-y-4 text-right"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    خوش آمدید
                  </h2>
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaPhone />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="شماره موبایل"
                    value={loginForm.phone}
                    onChange={handleLoginChange}
                    disabled={isLoading}
                    className={`w-full px-10 py-3 text-black bg-gray-50 rounded-lg text-right ${
                      loginErrors.phone
                        ? "border-red-500 border"
                        : "border-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {loginErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {loginErrors.phone}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </div>
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
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
                    className={`w-full px-10 py-3 text-black bg-gray-50 rounded-lg text-right ${
                      loginErrors.password
                        ? "border-red-500 border"
                        : "border-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {loginErrors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {loginErrors.password}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex justify-between items-center"
                >
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    فراموشی رمز عبور
                  </Link>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="ml-2"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      disabled={isLoading}
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      مرا به خاطر بسپار
                    </label>
                  </div>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
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
                key="signup-form"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSignupSubmit}
                className="space-y-4 text-right"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    ایجاد حساب کاربری
                  </h2>
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="نام و نام خانوادگی"
                    value={signupForm.name}
                    onChange={handleSignupChange}
                    disabled={isLoading}
                    className={`w-full px-10 py-3 text-black bg-gray-50 rounded-lg text-right ${
                      signupErrors.name
                        ? "border-red-500 border"
                        : "border-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {signupErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupErrors.name}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaPhone />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="شماره موبایل (09xxxxxxxxx)"
                    value={signupForm.phone}
                    onChange={handleSignupChange}
                    disabled={isLoading}
                    className={`w-full px-10 py-3 text-black bg-gray-50 rounded-lg text-right ${
                      signupErrors.phone
                        ? "border-red-500 border"
                        : "border-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {signupErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupErrors.phone}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </div>
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
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
                    className={`w-full px-10 py-3 text-black bg-gray-50 rounded-lg text-right ${
                      signupErrors.password
                        ? "border-red-500 border"
                        : "border-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {signupErrors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupErrors.password}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </div>
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
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
                    className={`w-full px-10 py-3 text-black bg-gray-50 rounded-lg text-right ${
                      signupErrors.confirmPassword
                        ? "border-red-500 border"
                        : "border-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {signupErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupErrors.confirmPassword}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-start gap-3 justify-end"
                >
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 text-green-500 border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
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
                      className="text-[#01ae9b] hover:text-[#018a7a] hover:underline transition-colors duration-200 font-medium"
                    >
                      قوانین و مقررات
                    </Link>{" "}
                    سایت موافقم
                  </label>
                </motion.div>
                {signupErrors.terms && (
                  <p className="text-red-500 text-xs mt-1 text-right">
                    {signupErrors.terms}
                  </p>
                )}

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
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

                {/* Additional Info */}
                <motion.div
                  variants={itemVariants}
                  className="text-center text-xs text-gray-500 mt-4"
                >
                  <p>
                    با ثبت نام، شما عضو خانواده بزرگ املاک ایران می‌شوید و از
                    خدمات ویژه ما بهره‌مند خواهید شد.
                  </p>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Additional Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center text-sm text-gray-600"
          >
            <p>
              {mode === "login"
                ? "حساب کاربری ندارید؟"
                : "قبلاً ثبت نام کرده‌اید؟"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setLoginErrors({});
                  setSignupErrors({});
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                disabled={isLoading}
                className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors disabled:opacity-50"
              >
                {mode === "login" ? "ثبت نام کنید" : "وارد شوید"}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
