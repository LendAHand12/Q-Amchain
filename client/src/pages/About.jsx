export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About Q-Amchain</h1>
      <div className="max-w-3xl space-y-6 text-gray-700">
        <p>
          Q-Amchain is a platform that offers validator packages with a transparent
          affiliate system. Our mission is to provide users with opportunities to earn
          through our 2-tier commission structure.
        </p>
        <h2 className="text-2xl font-semibold mt-8">How It Works</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Purchase validator packages using USDT on BNB Chain</li>
          <li>Refer others using your unique referral code</li>
          <li>Earn commissions from direct referrals (F1) and indirect referrals (F2)</li>
          <li>Withdraw your earnings when ready</li>
        </ul>
      </div>
    </div>
  )
}

