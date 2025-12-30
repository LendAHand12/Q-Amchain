import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [referrerCodeFromUrl, setReferrerCodeFromUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      const upperRef = ref.toLowerCase().trim();
      setReferrerCodeFromUrl(upperRef);
      setValue("referrerCode", upperRef);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        email: data.email,
        username: data.username.toLowerCase().replace(/[^a-z0-9]/g, ""),
        password: data.password,
        walletAddress: data.walletAddress.trim(),
        referrerCode: (data.referrerCode || referrerCodeFromUrl).trim(),
      };

      if (!payload.referrerCode) {
        toast.error("Referrer code is required");
        return;
      }

      await api.post("/auth/register", payload);
      toast.success("Registration successful! Please check your email to verify your account.");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Registration failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Sign up to start earning with Q-Amchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username (lowercase, no spaces)"
                {...register("username", {
                  required: "Username is required",
                  pattern: {
                    value: /^[a-z0-9]+$/,
                    message: "Username must be lowercase alphanumeric, no spaces",
                  },
                })}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="•••••••• (min 6 characters)"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="walletAddress">Wallet Address (USDT BEP20) *</Label>
              <Input
                id="walletAddress"
                type="text"
                placeholder="0x..."
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
                <p className="text-sm text-destructive">{errors.walletAddress.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                This wallet will be used for withdrawals. Only admin can change it later.
              </p>
            </div>

            {/* Hidden referrerCode field - auto-filled from URL */}
            <input
              type="hidden"
              {...register("referrerCode", {
                required: "Referrer code is required",
              })}
            />
            {referrerCodeFromUrl && (
              <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                <p className="text-sm">
                  Referred by: <Badge variant="default">{referrerCodeFromUrl}</Badge>
                </p>
              </div>
            )}
            {!referrerCodeFromUrl && (
              <div className="space-y-2">
                <Label htmlFor="referrerCode">Referrer Code *</Label>
                <Input
                  id="referrerCode"
                  type="text"
                  placeholder="Enter referrer code (e.g., ROOT001)"
                  {...register("referrerCode", {
                    required: "Referrer code is required",
                    onChange: (e) => {
                      setValue("referrerCode", e.target.value.toLowerCase().trim());
                    },
                  })}
                />
                {errors.referrerCode && (
                  <p className="text-sm text-destructive">{errors.referrerCode.message}</p>
                )}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
