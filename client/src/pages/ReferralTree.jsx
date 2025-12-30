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
        <div className={`bg-white p-3 sm:p-4 rounded-lg shadow-md border-l-4 ${
          level === 0 ? 'border-blue-500' : level === 1 ? 'border-purple-500' : 'border-orange-500'
        }`}>
          <div className="font-semibold text-sm sm:text-base">{node.username}</div>
          <div className="text-xs sm:text-sm text-gray-600">Ref: {node.refCode}</div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">
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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Referral Tree</h1>
      </div>
      <div className="mb-6 flex flex-wrap gap-3 sm:gap-4 text-sm">
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="font-semibold">F1 (Direct):</span> {f1Referrals.length}
        </div>
        <div className="bg-purple-50 px-4 py-2 rounded-lg">
          <span className="font-semibold">F2 (Indirect):</span> {f2Referrals.length}
        </div>
        <div className="bg-gray-50 px-4 py-2 rounded-lg">
          <span className="font-semibold">Total:</span> {totalReferrals}
        </div>
      </div>
      
      {f1Referrals.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">You don't have any referrals yet.</p>
          <p className="text-sm text-gray-500">
            Share your referral link to start building your network!
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg">
          {f1Referrals.map((node) => renderNode(node, 0))}
        </div>
      )}
    </div>
  )
}

