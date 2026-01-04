import { useEffect, useState } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function ReferralTree() {
  const [f1Referrals, setF1Referrals] = useState([])
  const [f2Referrals, setF2Referrals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTree()
  }, [])

  const fetchTree = async () => {
    try {
      const response = await api.get('/users/referral-tree')
      const data = response.data.data || {}
      setF1Referrals(Array.isArray(data.f1) ? data.f1 : [])
      setF2Referrals(Array.isArray(data.f2) ? data.f2 : [])
    } catch (error) {
      toast.error('Failed to load referral tree')
      setF1Referrals([])
      setF2Referrals([])
    } finally {
      setLoading(false)
    }
  }

  const getF2ForF1 = (f1Id) => {
    return f2Referrals.filter(f2 => f2.parentId?._id?.toString() === f1Id?.toString())
  }

  const renderNode = (node, level = 0) => {
    const f2Children = level === 0 ? getF2ForF1(node._id) : []
    
    return (
      <div key={node._id || node.id} className="ml-2 sm:ml-8 mt-4">
        <div className={`bg-[#252525] border-2 p-3 sm:p-4 rounded-lg ${
          level === 0 ? 'border-blue-500' : level === 1 ? 'border-purple-500' : 'border-orange-500'
        }`}>
          <div className="font-semibold text-sm sm:text-base text-white">{node.username}</div>
          <div className="text-xs sm:text-sm text-gray-400">Ref: {node.refCode}</div>
          <div className="text-xs sm:text-sm text-gray-400 mt-1">
            <div className="flex flex-wrap gap-2">
              <span>Referrals: {node.directReferrals || 0}</span>
              <span className="hidden sm:inline">|</span>
              <span>Package: {node.purchasedPackageName || 'No package'}</span>
              <span className="hidden sm:inline">|</span>
              <span>Earnings: {node.totalEarnings?.toFixed(2) || '0.00'} USDT</span>
            </div>
          </div>
        </div>
        {f2Children.length > 0 && (
          <div className="ml-2 sm:ml-4">
            {f2Children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading referral tree...</div>
      </div>
    );
  }

  const totalReferrals = f1Referrals.length + f2Referrals.length

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-wrap gap-3 sm:gap-4 text-sm">
        <div className="bg-blue-900/30 border border-blue-700 px-4 py-2 rounded-lg">
          <span className="font-semibold text-blue-400">F1 (Direct):</span> <span className="text-white">{f1Referrals.length}</span>
        </div>
        <div className="bg-purple-900/30 border border-purple-700 px-4 py-2 rounded-lg">
          <span className="font-semibold text-purple-400">F2 (Indirect):</span> <span className="text-white">{f2Referrals.length}</span>
        </div>
        <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg">
          <span className="font-semibold text-gray-300">Total:</span> <span className="text-white">{totalReferrals}</span>
        </div>
      </div>
      
      {f1Referrals.length === 0 ? (
        <div className="bg-[#252525] border border-gray-700 p-8 rounded-lg text-center">
          <p className="text-gray-400 mb-4">You don't have any referrals yet.</p>
          <p className="text-sm text-gray-500">
            Share your referral link to start building your network!
          </p>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] border border-gray-700 p-6 rounded-lg">
          {f1Referrals.map((node) => renderNode(node, 0))}
        </div>
      )}
    </div>
  )
}

