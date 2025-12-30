export default function FAQ() {
  const faqs = [
    {
      q: "What is Q-Amchain?",
      a: "Q-Amchain is a platform that offers validator packages with an affiliate commission system."
    },
    {
      q: "How does the affiliate system work?",
      a: "You earn commissions from direct referrals (F1) and indirect referrals (F2) when they purchase packages."
    },
    {
      q: "How do I get paid?",
      a: "Commissions are added to your wallet balance. You can request withdrawals which will be processed by admin."
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept USDT payments on BNB Chain (BEP20 network)."
    },
    {
      q: "Is 2FA required?",
      a: "Yes, 2FA using Google Authenticator is required for login and withdrawals."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="max-w-3xl space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{faq.q}</h3>
            <p className="text-gray-700">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

