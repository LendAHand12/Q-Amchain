import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying')
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      api.get(`/auth/verify-email?token=${token}`)
        .then(() => {
          setStatus('success')
          toast.success('Email verified successfully!')
        })
        .catch(() => {
          setStatus('error')
          toast.error('Verification failed')
        })
    } else {
      setStatus('error')
    }
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold mb-4">Verifying Email...</h2>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. You can now login to your account.
            </p>
            <Link
              to="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              The verification link is invalid or has expired.
            </p>
            <Link
              to="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

