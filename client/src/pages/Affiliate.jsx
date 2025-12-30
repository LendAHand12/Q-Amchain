export default function Affiliate() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Affiliate Program</h1>
      <div className="max-w-3xl space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">2-Tier Commission System</h2>
          <p className="text-gray-700 mb-4">
            Our affiliate program offers a simple 2-tier commission structure:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Level 1 (F1):</strong> Earn commission from direct referrals</li>
            <li><strong>Level 2 (F2):</strong> Earn commission from referrals of your referrals</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">How to Get Started</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Create a free account</li>
            <li>Get your unique referral code</li>
            <li>Share your referral link with others</li>
            <li>Start earning commissions!</li>
          </ol>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Ready to Start?</h3>
          <p className="text-gray-700 mb-4">
            Join our affiliate program today and start earning commissions.
          </p>
          <a
            href="/register"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign Up Now
          </a>
        </div>
      </div>
    </div>
  )
}

