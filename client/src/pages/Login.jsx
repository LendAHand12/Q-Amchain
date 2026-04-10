import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";
import loginBg from "../assets/background/login.png";

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

  const inputClass = "h-[64px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:bg-white/10 focus:border-[#EC3535]/50 transition-all font-['Barlow'] px-12";

  if (requires2FA) {
    return (
      <div className="relative min-h-screen bg-[#0C0B0B] flex items-center justify-center overflow-hidden font-['Space_Grotesk']">
        <div className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${loginBg})` }} />
        <div className="relative z-10 w-full max-w-[500px] px-6">
          <h1 className="text-5xl md:text-6xl font-black text-center text-white uppercase tracking-tighter mb-8">2FA</h1>
          <div className="bg-[#1A1B1D]/80 border border-white/10 backdrop-blur-xl rounded-[32px] p-8 md:p-12 space-y-8">
            <div className="text-center space-y-2">
              <ShieldCheck className="w-12 h-12 text-[#EC3535] mx-auto mb-4" />
              <p className="text-gray-300 text-lg">Enter 6-digit code</p>
            </div>
            <Input
              type="text"
              maxLength="6"
              value={twoFAToken}
              onChange={(e) => setTwoFAToken(e.target.value)}
              placeholder="000000"
              className="h-[80px] text-center text-4xl font-black tracking-[0.5em] bg-white/5 border-white/10 text-[#EC3535] rounded-2xl focus:border-[#EC3535]/50 transition-all"
            />
            <Button
              onClick={verify2FA}
              disabled={twoFAToken.length !== 6}
              className="w-full h-[64px] bg-transparent border-2 border-white/20 hover:border-[#EC3535] text-white uppercase font-black tracking-[0.2em] rounded-xl transition-all duration-300 group"
            >
              <span className="group-hover:text-[#EC3535]">Verify</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0C0B0B] flex items-center justify-center py-20 overflow-hidden font-['Space_Grotesk']">
      <div className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${loginBg})` }} />
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-[600px] px-6">
        <h1 className="text-6xl md:text-7xl font-black text-center text-white uppercase tracking-tighter mb-12">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#EC3535] transition-colors" />
              <Input
                placeholder="Email/User Name"
                className={inputClass}
                {...register("email", { required: "Required" })}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1 ml-4 tracking-wide">{errors.email.message}</p>}
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#EC3535] transition-colors" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={inputClass}
                {...register("password", { required: "Required" })}
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

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-white/10 bg-white/5 accent-[#EC3535]" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" size="sm" className="text-sm text-[#EC3535] hover:text-white transition-colors uppercase font-black tracking-widest">
                Forgot Password?
              </Link>
            </div>
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
              <span className="text-gray-400">Don't have an account?</span>
              <Link to="/register" className="text-white font-black uppercase tracking-widest hover:text-[#EC3535] transition-colors decoration-2 underline-offset-4 hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
