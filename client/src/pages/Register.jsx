import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, User, Mail, Smartphone, Lock, Wallet, FileText } from "lucide-react";
import loginBg from "../assets/background/login.png";

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

      const cleanedUsername = data.username.toLowerCase().trim();
      if (!/^[a-z0-9]+$/.test(cleanedUsername)) {
        toast.error("Username must be lowercase alphanumeric only (a-z, 0-9)");
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
        packageId: searchParams.get("package") || null,
      };

      await api.post("/auth/register", payload);
      toast.success("Registration successful! Please verify your email.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const inputClass = "h-[64px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:bg-white/10 focus:border-[#EC3535]/50 transition-all font-['Barlow'] px-12";

  return (
    <div className="relative min-h-screen bg-[#0C0B0B] flex items-center justify-center py-20 overflow-hidden font-['Space_Grotesk']">
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}
      />

      <div className="relative z-10 w-full max-w-[700px] px-6">
        <h1 className="text-6xl md:text-7xl font-black text-center text-white uppercase tracking-tighter mb-12">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
          <div className="space-y-4">
            {/* User Name */}
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#EC3535] transition-colors" />
              <Input
                placeholder="User Name"
                className={inputClass}
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && <p className="text-xs text-red-400 mt-1 ml-4 tracking-wide">{errors.username.message}</p>}
            </div>

            {/* Full Name */}
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#EC3535] transition-colors" />
              <Input
                placeholder="Full Name"
                className={inputClass}
                {...register("fullName", { required: "Full name is required" })}
              />
              {errors.fullName && <p className="text-xs text-red-400 mt-1 ml-4 tracking-wide">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#EC3535] transition-colors" />
              <Input
                type="email"
                placeholder="Email"
                className={inputClass}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1 ml-4 tracking-wide">{errors.email.message}</p>}
            </div>

            {/* Phone & Identity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#EC3535] transition-colors" />
                <Input
                  placeholder="Phone number"
                  className={inputClass}
                  {...register("phoneNumber", { required: "Phone number is required" })}
                />
                {errors.phoneNumber && <p className="text-xs text-red-400 mt-1 ml-4 tracking-wide text-nowrap">{errors.phoneNumber.message}</p>}
              </div>

              <div className="relative group">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#EC3535] transition-colors" />
                <Input
                  placeholder="ID/DL/Passport"
                  className={inputClass}
                  {...register("identityNumber", { required: "Identity number is required" })}
                />
                {errors.identityNumber && <p className="text-xs text-red-400 mt-1 ml-4 tracking-wide text-nowrap">{errors.identityNumber.message}</p>}
              </div>
            </div>

            {/* Wallet Address */}
            <div className="relative group">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#EC3535] transition-colors" />
              <Input
                placeholder="Wallet Address"
                className={inputClass}
                {...register("walletAddress", { required: "Wallet address is required" })}
              />
              {errors.walletAddress && <p className="text-xs text-red-400 mt-1 ml-4 tracking-wide">{errors.walletAddress.message}</p>}
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#EC3535] transition-colors" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={inputClass}
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#EC3535] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && <p className="text-xs text-red-400 mt-1 ml-4 tracking-wide">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#EC3535] transition-colors" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className={inputClass}
                {...register("confirmPassword", { required: "Please confirm password" })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#EC3535] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1 ml-4 tracking-wide">{errors.confirmPassword.message}</p>}
            </div>

            {/* Referrer Display */}
            {(referrerCodeValue || referrerCodeFromUrl) && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#EC3535] animate-pulse" />
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-300">
                    Referred by: <span className="text-white ml-2">{referrerCodeValue || referrerCodeFromUrl}</span>
                  </span>
                </div>
                {referrerCodeStatus === "valid" && <span className="text-[10px] font-black uppercase tracking-tighter text-green-500">✓ Active</span>}
                {referrerCodeStatus === "invalid" && <span className="text-[10px] font-black uppercase tracking-tighter text-red-500">✗ Invalid</span>}
              </div>
            )}
          </div>

          <div className="space-y-6 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[64px] bg-transparent border-2 border-white/20 hover:border-[#EC3535] text-white uppercase font-black tracking-[0.2em] rounded-xl transition-all duration-300 group"
            >
              <span className="group-hover:text-[#EC3535] transition-colors">
                {isSubmitting ? "Processing..." : "Confirm"}
              </span>
            </Button>

            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-400">Already have an account?</span>
              <Link to="/login" className="text-white font-black uppercase tracking-widest hover:text-[#EC3535] transition-colors decoration-2 underline-offset-4 hover:underline">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
