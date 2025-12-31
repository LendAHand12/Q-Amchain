import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import registerBackground from "../assets/register-background.png";
import registerLeftBackground from "../assets/register-left-background.png";
import AuthFooter from "../components/AuthFooter";

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email: data.email });
      setEmailSent(true);
      toast.success("If that email exists, a password reset link has been sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsSubmitting(false);
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

      {/* Right Side - Forgot Password Form */}
      <div className="flex items-center justify-center flex-1 p-8 lg:p-12">
        <div className="w-full max-w-[654px]">
          <h1 className="mb-12 text-5xl font-bold text-white">Forgot Password</h1>

          {emailSent ? (
            <div className="space-y-6">
              <div className="bg-gray-800/90 rounded-lg p-8 space-y-4">
                <p className="text-gray-300 text-center">
                  If that email exists, a password reset link has been sent to your email address.
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <p className="text-gray-400 text-sm text-center">
                  The link will expire in 1 hour.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Remember your password?</span>
                <Link
                  to="/login"
                  className="font-medium transition-colors text-accent-red hover:text-accent-red-hover hover:underline"
                >
                  Login here
                </Link>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-[27px]" autoComplete="off">
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="off"
                    className="h-[60px] text-base px-[22px] bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
                </div>

                <p className="text-sm text-gray-400">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[60px] text-base font-medium bg-gray-800/90 hover:bg-gray-700/90 text-white border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
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
            </>
          )}

          {/* Footer */}
          <AuthFooter />
        </div>
      </div>
    </div>
  );
}

