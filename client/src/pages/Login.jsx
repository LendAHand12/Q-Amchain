import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import registerBackground from "../assets/register-background.png";
import registerLeftBackground from "../assets/register-left-background.png";
import AuthFooter from "../components/AuthFooter";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState(null);
  const [twoFAToken, setTwoFAToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("refCode", ref);
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", data);

      if (response.data.requires2FA) {
        setRequires2FA(true);
        setTempToken(response.data.tempToken);
        toast.success("Please enter your 2FA code");
      } else {
        const { accessToken, refreshToken, user } = response.data.data;
        setAuth(user, accessToken, refreshToken);
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const verify2FA = async () => {
    try {
      const response = await api.post("/auth/2fa/verify", {
        token: twoFAToken,
        tempToken,
      });

      const { accessToken, refreshToken, user } = response.data.data;
      setAuth(user, accessToken, refreshToken);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "2FA verification failed");
    }
  };

  if (requires2FA) {
    return (
      <div
        className="flex min-h-screen bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${registerBackground})` }}
      >
        <div className="flex items-center justify-center flex-1 p-8 lg:p-12">
          <div className="w-full max-w-[654px]">
            <h1 className="mb-12 text-5xl font-bold text-white">2FA Verification</h1>
            <div className="bg-gray-800/90 rounded-lg p-8 space-y-6">
              <p className="text-gray-300 text-center">
                Enter 6-digit code from Google Authenticator
              </p>
              <div className="space-y-2">
                <Input
                  type="text"
                  maxLength="6"
                  value={twoFAToken}
                  onChange={(e) => setTwoFAToken(e.target.value)}
                  placeholder="000000"
                  className="h-[60px] text-center text-2xl tracking-widest bg-gray-700/50 border-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                />
              </div>
              <Button
                onClick={verify2FA}
                disabled={twoFAToken.length !== 6}
                className="w-full h-[60px] text-base font-medium bg-gray-800/90 hover:bg-gray-700/90 text-white border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify
              </Button>
            </div>
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

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center flex-1 p-8 lg:p-12">
        <div className="w-full max-w-[654px]">
          <h1 className="mb-12 text-5xl font-bold text-white">Login</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[27px]" autoComplete="off">
            {/* Email/User Name */}
            <div className="space-y-2">
              <Input
                id="email"
                type="text"
                placeholder="Email/User Name"
                autoComplete="off"
                className="h-[60px] text-base px-[22px] bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                {...register("email", { required: "Email or Username is required" })}
              />
              {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
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
                  {...register("password", { required: "Password is required" })}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-accent-red focus:ring-2 focus:ring-gray-600"
                />
                <label htmlFor="remember" className="text-sm text-gray-300 cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-accent-red hover:text-accent-red-hover transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[60px] text-base font-medium bg-gray-800/90 hover:bg-gray-700/90 text-white border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging in..." : "Confirm"}
            </Button>

            {/* Register Link */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Don't have an account?</span>
              <Link
                to="/register"
                className="font-medium transition-colors text-accent-red hover:text-accent-red-hover hover:underline"
              >
                Register here
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
