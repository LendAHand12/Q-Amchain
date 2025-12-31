import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      api
        .get(`/auth/verify-email?token=${token}`)
        .then((response) => {
          // If email is already verified (either just now or previously)
          if (response.data.alreadyVerified || response.data.success) {
            if (response.data.alreadyVerified) {
              // Email was already verified previously
              setStatus("already-verified");
              toast.success("Email has already been verified");
            } else {
              // Email was just verified successfully
              setStatus("success");
              toast.success("Email verified successfully!");
            }
          } else {
            // This case shouldn't happen, but for safety
            setStatus("success");
            toast.success("Email verified successfully!");
          }
        })
        .catch((error) => {
          // Check if the error is due to email already being verified
          const errorMessage = error.response?.data?.message || "Verification failed";
          const errorCode = error.response?.data?.code;

          // If message contains "already verified" or similar, treat as verified
          if (
            errorMessage.toLowerCase().includes("already verified") ||
            errorMessage.toLowerCase().includes("has already been verified")
          ) {
            setStatus("already-verified");
            toast.success("Email has already been verified");
          } else {
            // Only show error if it's a real error (invalid or expired token)
            setStatus("error");
            toast.error(errorMessage);
          }
        });
    } else {
      setStatus("error");
      toast.error("Verification token is missing");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          {status === "verifying" && (
            <>
              <div className="text-4xl mb-4">⏳</div>
              <CardTitle className="text-2xl">Verifying Email...</CardTitle>
              <CardDescription>Please wait while we verify your email address.</CardDescription>
            </>
          )}

          {status === "success" && (
            <>
              <div className="text-4xl mb-4">✅</div>
              <CardTitle className="text-2xl text-green-600">Email Verified!</CardTitle>
              <CardDescription>
                Your email has been successfully verified. You can now login to your account.
              </CardDescription>
            </>
          )}

          {status === "already-verified" && (
            <>
              <div className="text-4xl mb-4">✅</div>
              <CardTitle className="text-2xl text-blue-600">Email Already Verified</CardTitle>
              <CardDescription>
                Your email has already been verified. You can login to your account.
              </CardDescription>
            </>
          )}

          {status === "error" && (
            <>
              <div className="text-4xl mb-4">❌</div>
              <CardTitle className="text-2xl text-red-600">Verification Failed</CardTitle>
              <CardDescription>
                The verification link is invalid or has expired. Please try again or contact
                support.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="text-center">
          {(status === "success" || status === "already-verified" || status === "error") && (
            <Link to="/login">
              <Button className="w-full sm:w-auto">Go to Login</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
