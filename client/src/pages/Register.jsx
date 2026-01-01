import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import registerBackground from "../assets/register-background.png";
import registerLeftBackground from "../assets/register-left-background.png";
import AuthFooter from "../components/AuthFooter";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [referrerCodeFromUrl, setReferrerCodeFromUrl] = useState("");
  const [referrerCodeStatus, setReferrerCodeStatus] = useState(null);
  const [referrerCodeMessage, setReferrerCodeMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const referrerCodeValue = watch("referrerCode") || referrerCodeFromUrl;

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      const upperRef = ref.toLowerCase().trim();
      setReferrerCodeFromUrl(upperRef);
      setValue("referrerCode", upperRef);
      checkReferrerCode(upperRef);
    }
  }, [searchParams, setValue]);

  useEffect(() => {
    if (referrerCodeValue && referrerCodeValue.trim().length >= 6) {
      const timeoutId = setTimeout(() => {
        checkReferrerCode(referrerCodeValue.trim().toLowerCase());
      }, 500);

      return () => clearTimeout(timeoutId);
    } else if (referrerCodeValue && referrerCodeValue.trim().length > 0) {
      setReferrerCodeStatus(null);
      setReferrerCodeMessage("");
    }
  }, [referrerCodeValue]);

  const checkReferrerCode = async (code) => {
    if (!code || code.trim().length < 6) {
      setReferrerCodeStatus(null);
      setReferrerCodeMessage("");
      return;
    }

    setReferrerCodeStatus("checking");
    try {
      const response = await api.get(
        `/auth/check-referrer?referrerCode=${encodeURIComponent(code)}`
      );
      if (response.data.isValid) {
        setReferrerCodeStatus("valid");
        setReferrerCodeMessage("Referrer code is valid");
      } else {
        setReferrerCodeStatus("invalid");
        setReferrerCodeMessage(response.data.message || "Invalid referrer code");
      }
    } catch (error) {
      setReferrerCodeStatus("invalid");
      setReferrerCodeMessage(error.response?.data?.message || "Failed to verify referrer code");
    }
  };

  const onSubmit = async (data) => {
    try {
      const referrerCode = (data.referrerCode || referrerCodeFromUrl).trim().toLowerCase();

      if (!referrerCode) {
        toast.error("Referrer code is required");
        return;
      }

      if (referrerCodeStatus !== "valid") {
        const checkResponse = await api.get(
          `/auth/check-referrer?referrerCode=${encodeURIComponent(referrerCode)}`
        );
        if (!checkResponse.data.isValid) {
          toast.error(
            checkResponse.data.message ||
              "This referrer has not purchased any package yet. You cannot register with this referral code."
          );
          return;
        }
      }

      // Validate username format before submitting
      const cleanedUsername = data.username.toLowerCase().trim();
      if (!/^[a-z0-9]+$/.test(cleanedUsername)) {
        toast.error(
          "Username must be lowercase alphanumeric only (a-z, 0-9), no spaces or special characters"
        );
        return;
      }
      if (cleanedUsername.length < 3 || cleanedUsername.length > 20) {
        toast.error("Username must be between 3 and 20 characters");
        return;
      }

      const payload = {
        email: data.email,
        username: cleanedUsername,
        password: data.password,
        walletAddress: data.walletAddress.trim(),
        fullName: data.fullName.trim(),
        phoneNumber: data.phoneNumber.trim(),
        identityNumber: data.identityNumber.trim(),
        referrerCode,
      };

      await api.post("/auth/register", payload);
      toast.success("Registration successful! Please check your email to verify your account.");
      navigate("/login");
    } catch (error) {
      // Handle validation errors from backend
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Find username error first, or show first error
        const usernameError = error.response.data.errors.find((err) => err.field === "username");
        if (usernameError) {
          toast.error(`Username: ${usernameError.message || "Invalid username format"}`);
        } else {
          const firstError = error.response.data.errors[0];
          toast.error(
            `${
              firstError.field
                ? firstError.field.charAt(0).toUpperCase() + firstError.field.slice(1) + ": "
                : ""
            }${firstError.message || "Validation failed"}`
          );
        }
      } else {
        const errorMessage = error.response?.data?.message || "Registration failed";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div
      className="flex min-h-screen bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${registerBackground})` }}
    >
      {/* Left Sidebar */}
      <div
        className="hidden lg:flex lg:w-[300px] relative flex-col"
        style={{ backgroundImage: `url(${registerLeftBackground})` }}
      ></div>

      {/* Right Side - Registration Form */}
      <div className="flex items-center justify-center flex-1 p-8 lg:p-12">
        <div className="w-full max-w-[654px]">
          <h1 className="mb-12 text-5xl font-bold text-white">Sign Up</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[27px]" autoComplete="off">
            {/* User Name */}
            <div className="space-y-2">
              <Input
                id="username"
                type="text"
                placeholder="User Name"
                autoComplete="off"
                className="h-[60px] text-base px-[22px] bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Username must be less than 20 characters",
                  },
                  pattern: {
                    value: /^[a-z0-9]+$/,
                    message:
                      "Username must be lowercase alphanumeric only (a-z, 0-9), no spaces or special characters",
                  },
                  onChange: (e) => {
                    // Auto convert to lowercase
                    const value = e.target.value.toLowerCase();
                    e.target.value = value;
                  },
                })}
              />
              {errors.username && <p className="text-sm text-red-400">{errors.username.message}</p>}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Input
                id="fullName"
                type="text"
                placeholder="Full Name"
                autoComplete="off"
                className="h-[60px] text-base px-[22px] bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                {...register("fullName", {
                  required: "Full name is required",
                  maxLength: {
                    value: 100,
                    message: "Full name must be less than 100 characters",
                  },
                })}
              />
              {errors.fullName && <p className="text-sm text-red-400">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                autoComplete="off"
                className="h-[60px] text-base px-[22px] bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
            </div>

            {/* Phone Number and Identity Number - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[27px]">
              <div className="space-y-2">
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Phone number"
                  autoComplete="off"
                  className="h-[60px] text-base px-[22px] bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    maxLength: {
                      value: 20,
                      message: "Phone number must be less than 20 characters",
                    },
                  })}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-400">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  id="identityNumber"
                  type="text"
                  placeholder="ID/DL/Passport"
                  autoComplete="off"
                  className="h-[60px] text-base px-[22px] bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                  {...register("identityNumber", {
                    required: "Identity number is required",
                    maxLength: {
                      value: 50,
                      message: "Identity number must be less than 50 characters",
                    },
                  })}
                />
                {errors.identityNumber && (
                  <p className="text-sm text-red-400">{errors.identityNumber.message}</p>
                )}
              </div>
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <Input
                id="walletAddress"
                type="text"
                placeholder="Wallet Address"
                autoComplete="off"
                className="h-[60px] text-base px-[22px] bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                {...register("walletAddress", {
                  required: "Wallet address is required",
                  pattern: {
                    value: /^0x[a-fA-F0-9]{40}$/,
                    message:
                      "Invalid BEP20 wallet address format (must start with 0x and be 42 characters)",
                  },
                })}
              />
              {errors.walletAddress && (
                <p className="text-sm text-red-400">{errors.walletAddress.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="new-password"
                  className="h-[60px] text-base px-[22px] pr-[58px] bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[18px] top-1/2 -translate-y-1/2 text-accent-red hover:text-accent-red-hover transition-colors"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  className="h-[60px] text-base px-[22px] pr-[58px] bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => {
                      const password = watch("password");
                      return value === password || "Passwords do not match";
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-[18px] top-1/2 -translate-y-1/2 text-accent-red hover:text-accent-red-hover transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-6 h-6" />
                  ) : (
                    <Eye className="w-6 h-6" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Referrer Code */}
            <input
              type="hidden"
              {...register("referrerCode", {
                required: "Referrer code is required",
              })}
            />
            {referrerCodeFromUrl && (
              <div className="space-y-2">
                <div className="p-3 border border-gray-700 rounded-lg bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white">
                      Referred by:{" "}
                      <Badge variant="default" className="text-white bg-gray-700">
                        {referrerCodeFromUrl}
                      </Badge>
                    </p>
                    {referrerCodeStatus === "checking" && (
                      <span className="text-xs text-gray-400">Checking...</span>
                    )}
                    {referrerCodeStatus === "valid" && (
                      <span className="text-xs text-green-400">✓ Valid</span>
                    )}
                    {referrerCodeStatus === "invalid" && (
                      <span className="text-xs text-red-400">✗ Invalid</span>
                    )}
                  </div>
                  {referrerCodeMessage && (
                    <p
                      className={`text-xs mt-2 ${
                        referrerCodeStatus === "valid"
                          ? "text-green-400"
                          : referrerCodeStatus === "invalid"
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {referrerCodeMessage}
                    </p>
                  )}
                </div>
              </div>
            )}
            {!referrerCodeFromUrl && (
              <div className="space-y-2">
                <Input
                  id="referrerCode"
                  type="text"
                  placeholder="Referrer Code"
                  autoComplete="off"
                  className="h-[60px] text-base px-[22px] bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                  {...register("referrerCode", {
                    required: "Referrer code is required",
                    onChange: (e) => {
                      setValue("referrerCode", e.target.value.toLowerCase().trim());
                    },
                  })}
                />
                {referrerCodeStatus === "checking" && (
                  <p className="text-xs text-gray-400">Checking referrer code...</p>
                )}
                {referrerCodeStatus === "valid" && (
                  <p className="text-xs text-green-400">✓ {referrerCodeMessage}</p>
                )}
                {referrerCodeStatus === "invalid" && (
                  <p className="text-xs text-red-400">✗ {referrerCodeMessage}</p>
                )}
                {errors.referrerCode && (
                  <p className="text-sm text-red-400">{errors.referrerCode.message}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[60px] text-base font-medium bg-gray-800/90 hover:bg-gray-700/90 text-white border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Registering..." : "Confirm"}
            </Button>

            {/* Login Link */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Already have an account?</span>
              <Link
                to="/login"
                className="font-medium transition-colors text-accent-red hover:text-accent-red-hover hover:underline"
              >
                Login
              </Link>
            </div>
          </form>

          {/* Footer */}
          <AuthFooter />
        </div>
      </div>
    </div>
  );
}
