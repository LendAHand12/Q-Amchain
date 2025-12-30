import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()
  const [requires2FA, setRequires2FA] = useState(false)
  const [tempToken, setTempToken] = useState(null)
  const [twoFAToken, setTwoFAToken] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      localStorage.setItem('refCode', ref)
    }
  }, [searchParams])

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/login', data)
      
      if (response.data.requires2FA) {
        setRequires2FA(true)
        setTempToken(response.data.tempToken)
        toast.success('Please enter your 2FA code')
      } else {
        const { accessToken, refreshToken, user } = response.data.data
        setAuth(user, accessToken, refreshToken)
        toast.success('Login successful!')
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  const verify2FA = async () => {
    try {
      const response = await api.post('/auth/2fa/verify', {
        token: twoFAToken,
        tempToken
      })
      
      const { accessToken, refreshToken, user } = response.data.data
      setAuth(user, accessToken, refreshToken)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || '2FA verification failed')
    }
  }

  if (requires2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">2FA Verification</CardTitle>
            <CardDescription className="text-center">
              Enter 6-digit code from Google Authenticator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                maxLength="6"
                value={twoFAToken}
                onChange={(e) => setTwoFAToken(e.target.value)}
                placeholder="000000"
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <Button
              onClick={verify2FA}
              disabled={twoFAToken.length !== 6}
              className="w-full"
            >
              Verify
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
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
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

