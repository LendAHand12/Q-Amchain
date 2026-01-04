import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function Profile() {
  const { user, checkAuth } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [show2FASetup, setShow2FASetup] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [twoFAToken, setTwoFAToken] = useState('')
  const [setup2FAToken, setSetup2FAToken] = useState('')
  const [isVerifyingSetup, setIsVerifyingSetup] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me')
      setProfile(response.data.data)
    } catch (error) {
      toast.error('Failed to load profile')
    }
  }

  const handleSetup2FA = async () => {
    try {
      const response = await api.post('/auth/2fa/setup')
      setQrCode(response.data.data.qrCode)
      setShow2FASetup(true)
      setSetup2FAToken('')
      toast.success('QR code generated. Please scan with Google Authenticator and enter the 6-digit code to verify.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to setup 2FA')
    }
  }

  const handleVerify2FASetup = async () => {
    if (setup2FAToken.length !== 6) {
      toast.error('Please enter a 6-digit code')
      return
    }

    setIsVerifyingSetup(true)
    try {
      await api.post('/auth/2fa/verify-setup', {
        token: setup2FAToken
      })
      toast.success('2FA enabled successfully!')
      setShow2FASetup(false)
      setQrCode(null)
      setSetup2FAToken('')
      fetchProfile()
      checkAuth()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify 2FA setup')
    } finally {
      setIsVerifyingSetup(false)
    }
  }

  const handleDisable2FA = async (data) => {
    try {
      await api.post('/auth/2fa/disable', {
        ...data,
        token: twoFAToken
      })
      toast.success('2FA disabled successfully')
      setShow2FASetup(false)
      fetchProfile()
      checkAuth()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to disable 2FA')
    }
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="bg-[#252525] border border-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">Email</label>
              <p className="text-white">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Username</label>
              <p className="text-white">{profile.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Full Name</label>
              <p className="text-white">{profile.fullName || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Phone Number</label>
              <p className="text-white">{profile.phoneNumber || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Identity Number</label>
              <p className="text-white font-mono">{profile.identityNumber || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Referral Code</label>
              <p className="text-white font-mono">{profile.refCode}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Email Verified</label>
              <p className={profile.isEmailVerified ? 'text-accent-green' : 'text-red-400'}>
                {profile.isEmailVerified ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-[#252525] border border-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Security Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                2FA Status
              </label>
              <p className={profile.isTwoFactorEnabled ? 'text-accent-green' : 'text-gray-400'}>
                {profile.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>

            {!profile.isTwoFactorEnabled ? (
              <button
                onClick={handleSetup2FA}
                className="w-full py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-hover"
              >
                Enable 2FA
              </button>
            ) : (
              <div>
                <p className="text-sm text-gray-400 mb-4">
                  To disable 2FA, enter your password and 2FA code:
                </p>
                <form onSubmit={handleSubmit(handleDisable2FA)} className="space-y-4">
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg"
                  />
                  <input
                    type="text"
                    maxLength="6"
                    value={twoFAToken}
                    onChange={(e) => setTwoFAToken(e.target.value)}
                    placeholder="2FA Code"
                    className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                  >
                    Disable 2FA
                  </button>
                </form>
              </div>
            )}
          </div>

          {show2FASetup && qrCode && (
            <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg space-y-4">
              <div>
                <p className="text-sm text-gray-300 mb-2 font-medium">
                  Step 1: Scan this QR code with Google Authenticator
                </p>
                <img src={qrCode} alt="2FA QR Code" className="mx-auto mb-4 max-w-[200px]" />
              </div>
              
              <div>
                <p className="text-sm text-gray-300 mb-2 font-medium">
                  Step 2: Enter the 6-digit code from Google Authenticator
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength="6"
                    value={setup2FAToken}
                    onChange={(e) => setSetup2FAToken(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="flex-1 px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg text-center text-lg tracking-widest"
                  />
                  <button
                    onClick={handleVerify2FASetup}
                    disabled={setup2FAToken.length !== 6 || isVerifyingSetup}
                    className="px-6 py-2 bg-accent-green text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {isVerifyingSetup ? 'Verifying...' : 'Verify & Enable'}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  After scanning, enter the 6-digit code to complete 2FA setup.
                </p>
              </div>

              <button
                onClick={() => {
                  setShow2FASetup(false)
                  setQrCode(null)
                  setSetup2FAToken('')
                }}
                className="w-full py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

