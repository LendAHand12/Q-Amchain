import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import registerBackground from "../assets/register-background.png";
import registerLeftBackground from "../assets/register-left-background.png";
import AuthFooter from "../components/AuthFooter";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error("Invalid reset token");
      navigate("/forgot-password");
    }
  }, [searchParams, navigate]);

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });
      setPasswordReset(true);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (passwordReset) {
    return (
      <div
        className="flex min-h-screen bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${registerBackground})` }}
      >
        <div className="flex items-center justify-center flex-1 p-8 lg:p-12">
          <div className="w-full max-w-[654px]">
            <h1 className="mb-12 text-5xl font-bold text-white">Password Reset</h1>
            <div className="bg-gray-800/90 rounded-lg p-8 space-y-4">
              <p className="text-gray-300 text-center">
                Your password has been reset successfully! You will be redirected to the login page
                shortly.
              </p>
              <div className="flex justify-center">
                <Link
                  to="/login"
                  className="font-medium transition-colors text-accent-red hover:text-accent-red-hover hover:underline"
                >
                  Go to Login
                </Link>
              </div>
            </div>
            <AuthFooter />
          </div>
        </div>
      </div>
    );
  }

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

      {/* Right Side - Reset Password Form */}
      <div className="flex items-center justify-center flex-1 p-8 lg:p-12">
        <div className="w-full max-w-[654px]">
          <h1 className="mb-12 text-5xl font-bold text-white">Reset Password</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[27px]" autoComplete="off">
            {/* New Password */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
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
                  placeholder="Confirm New Password"
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !token}
              className="w-full h-[60px] text-base font-medium bg-gray-800/90 hover:bg-gray-700/90 text-white border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <div className="flex items-center gap-2 text-sm mt-6">
            <span className="text-gray-400">Remember your password?</span>
            <Link
              to="/login"
              className="font-medium transition-colors text-accent-red hover:text-accent-red-hover hover:underline"
            >
              Login here
            </Link>
          </div>

          {/* Footer */}
          <AuthFooter />
        </div>
      </div>
    </div>
  );
}

