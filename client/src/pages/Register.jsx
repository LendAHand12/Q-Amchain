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
  const [referrerCodeStatus, setReferrerCodeStatus] = useState(null); // null, 'checking', 'valid', 'invalid'
  const [referrerCodeMessage, setReferrerCodeMessage] = useState("");

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
      // Check referrer code when loaded from URL
      checkReferrerCode(upperRef);
    }
  }, [searchParams, setValue]);

  // Check referrer code when user types
  useEffect(() => {
    if (referrerCodeValue && referrerCodeValue.trim().length >= 6) {
      const timeoutId = setTimeout(() => {
        checkReferrerCode(referrerCodeValue.trim().toLowerCase());
      }, 500); // Debounce 500ms

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
      const response = await api.get(`/auth/check-referrer?referrerCode=${encodeURIComponent(code)}`);
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

      // Check referrer code one more time before submitting
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

      const payload = {
        email: data.email,
        username: data.username.toLowerCase().replace(/[^a-z0-9]/g, ""),
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

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name (as on ID card) *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name as shown on ID card"
                {...register("fullName", {
                  required: "Full name is required",
                  maxLength: {
                    value: 100,
                    message: "Full name must be less than 100 characters",
                  },
                })}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  maxLength: {
                    value: 20,
                    message: "Phone number must be less than 20 characters",
                  },
                })}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="identityNumber">Identity Number (ID Card/Passport) *</Label>
              <Input
                id="identityNumber"
                type="text"
                placeholder="Enter your ID card, passport, or identity number"
                {...register("identityNumber", {
                  required: "Identity number is required",
                  maxLength: {
                    value: 50,
                    message: "Identity number must be less than 50 characters",
                  },
                })}
              />
              {errors.identityNumber && (
                <p className="text-sm text-destructive">{errors.identityNumber.message}</p>
              )}
            </div>

            {/* Hidden referrerCode field - auto-filled from URL */}
            <input
              type="hidden"
              {...register("referrerCode", {
                required: "Referrer code is required",
              })}
            />
            {referrerCodeFromUrl && (
              <div className="space-y-2">
                <Label>Referrer Code</Label>
                <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      Referred by: <Badge variant="default">{referrerCodeFromUrl}</Badge>
                    </p>
                    {referrerCodeStatus === "checking" && (
                      <span className="text-xs text-muted-foreground">Checking...</span>
                    )}
                    {referrerCodeStatus === "valid" && (
                      <span className="text-xs text-green-600">✓ Valid</span>
                    )}
                    {referrerCodeStatus === "invalid" && (
                      <span className="text-xs text-destructive">✗ Invalid</span>
                    )}
                  </div>
                  {referrerCodeMessage && (
                    <p
                      className={`text-xs mt-2 ${
                        referrerCodeStatus === "valid"
                          ? "text-green-600"
                          : referrerCodeStatus === "invalid"
                          ? "text-destructive"
                          : "text-muted-foreground"
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
                <Label htmlFor="referrerCode">Referrer Code *</Label>
                <Input
                  id="referrerCode"
                  type="text"
                  placeholder="Enter referrer code (e.g., root001)"
                  {...register("referrerCode", {
                    required: "Referrer code is required",
                    onChange: (e) => {
                      setValue("referrerCode", e.target.value.toLowerCase().trim());
                    },
                  })}
                />
                {referrerCodeStatus === "checking" && (
                  <p className="text-xs text-muted-foreground">Checking referrer code...</p>
                )}
                {referrerCodeStatus === "valid" && (
                  <p className="text-xs text-green-600">✓ {referrerCodeMessage}</p>
                )}
                {referrerCodeStatus === "invalid" && (
                  <p className="text-xs text-destructive">✗ {referrerCodeMessage}</p>
                )}
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
