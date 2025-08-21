"use client";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
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

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const switchRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

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

    const container = containerRef.current;
    const leftSide = leftSideRef.current;
    const rightSide = rightSideRef.current;

    if (!container) return;

    // Initial animations
    gsap.fromTo(
      container,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
    );

    if (leftSide) {
      gsap.fromTo(
        leftSide.children,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.3,
          ease: "power2.out",
        }
      );
    }

    if (rightSide) {
      gsap.fromTo(
        rightSide,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    gsap.fromTo(
      form.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, [mode]);

  useEffect(() => {
    const message = messageRef.current;
    if (!message) return;

    if (successMessage || errorMessage) {
      gsap.fromTo(
        message,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [successMessage, errorMessage]);

  const handleModeSwitch = (newMode: FormMode) => {
    if (isLoading) return;

    const switchElement = switchRef.current;
    if (switchElement) {
      gsap.to(switchElement, {
        x: newMode === "login" ? "0%" : "100%",
        duration: 0.3,
        ease: "power2.out",
      });
    }

    setMode(newMode);
    setLoginErrors({});
    setSignupErrors({});
    setErrorMessage("");
    setSuccessMessage("");
  };

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
          // Dispatch custom event to update navbar
          window.dispatchEvent(new Event("authChange"));
        }

        // Check redirect flags
        const shouldRedirectToAdmin =
          localStorage.getItem("adminRedirect") === "true";
        const shouldRedirectToContact =
          localStorage.getItem("contactRedirect") === "true";
        const contactRedirectUrl = localStorage.getItem("contactRedirectUrl");

        // Redirect after successful login
        setTimeout(() => {
          if (shouldRedirectToAdmin) {
            localStorage.removeItem("adminRedirect");
            toast.success("در حال انتقال به پنل مدیریت...");
            router.replace("/");
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
    <div
      className={`min-h-screen ${
        mode === "login" ? "" : ""
      } flex items-center justify-center p-4 `}
    >
      <div
        ref={containerRef}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row py-10 md:py-0 md:mb-14"
      >
        {/* Left Side - Image */}
        <div
          ref={leftSideRef}
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
                همراه شما در مسیر خانه‌دار شدن
              </p>
            </div>
          </div>

          <div className="relative z-10" dir="rtl">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
              <p className="text-white text-lg leading-relaxed">
                با عضویت در سایت مشاور املاک اوج، به راحتی می‌توانید به هزاران
                آگهی ملک دسترسی داشته باشید و از مشاوره‌های تخصصی ما بهره‌مند
                شوید.
              </p>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 left-16 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Right Side - Form */}
        <div ref={rightSideRef} className="md:w-1/2 p-12">
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
            <div
              ref={switchRef}
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
            <div
              ref={messageRef}
              className={`mb-6 p-4 rounded-2xl text-center font-medium ${
                successMessage
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {successMessage || errorMessage}
            </div>
          )}

          {mode === "login" ? (
            <form
              ref={formRef}
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

              {/* <div className="flex justify-between items-center">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#01ae9b] hover:text-[#66308d] transition-colors font-medium"
                >
                  فراموشی رمز عبور
                </Link>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="ml-2 w-4 h-4 text-[#01ae9b] border-2 border-gray-300 rounded focus:ring-[#01ae9b]"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    disabled={isLoading}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    مرا به خاطر بسپار
                  </label>
                </div>
              </div> */}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r cursor-pointer  from-[#01ae9b] to-[#66308d] hover:from-[#66308d] hover:to-[#01ae9b] text-white rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال ورود...
                  </>
                ) : (
                  "ورود"
                )}
              </button>
            </form>
          ) : (
            <form
              ref={formRef}
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 cursor-pointer   bg-gradient-to-r from-[#01ae9b] to-[#66308d] hover:from-[#66308d] hover:to-[#01ae9b] text-white rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال ثبت نام...
                  </>
                ) : (
                  "ثبت نام"
                )}
              </button>

              <div className="text-center text-sm text-gray-500 mt-6">
                <p>
                  با ثبت نام، شما عضو خانواده بزرگ املاک ایران می‌شوید و از
                  خدمات ویژه ما بهره‌مند خواهید شد.
                </p>
              </div>
            </form>
          )}

          {/* Additional Links */}
          <div className="mt-10 text-center text-sm text-gray-600">
            <p>
              {mode === "login"
                ? "حساب کاربری ندارید؟"
                : "قبلاً ثبت نام کرده‌اید؟"}{" "}
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
        </div>
      </div>
    </div>
  );
}
