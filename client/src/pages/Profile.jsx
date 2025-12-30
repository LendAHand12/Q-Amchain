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
    } catch (error) {
      toast.error('Failed to setup 2FA')
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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Profile & Security</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Profile Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <p className="text-gray-900">{profile.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Referral Code</label>
              <p className="text-gray-900 font-mono">{profile.refCode}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Verified</label>
              <p className={profile.isEmailVerified ? 'text-green-600' : 'text-red-600'}>
                {profile.isEmailVerified ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2FA Status
              </label>
              <p className={profile.isTwoFactorEnabled ? 'text-green-600' : 'text-gray-600'}>
                {profile.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>

            {!profile.isTwoFactorEnabled ? (
              <button
                onClick={handleSetup2FA}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Enable 2FA
              </button>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  To disable 2FA, enter your password and 2FA code:
                </p>
                <form onSubmit={handleSubmit(handleDisable2FA)} className="space-y-4">
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    maxLength="6"
                    value={twoFAToken}
                    onChange={(e) => setTwoFAToken(e.target.value)}
                    placeholder="2FA Code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-4">
                Scan this QR code with Google Authenticator:
              </p>
              <img src={qrCode} alt="2FA QR Code" className="mx-auto mb-4" />
              <p className="text-xs text-gray-500 text-center">
                After scanning, you'll need to verify with a code on your next login.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

