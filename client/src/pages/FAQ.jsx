import { useState } from "react";
import { Search, MessageCircleQuestion } from "lucide-react";
import faqBg from "../assets/background/faq.png";

export default function FAQ() {
	const [searchQuery, setSearchQuery] = useState("");

	const faqs = [
		{
			id: "01",
			q: "What is Q-Amchain?",
			a: "Q-Amchain is a platform that offers validator packages with an affiliate commission system."
		},
		{
			id: "02",
			q: "How does the affiliate system work?",
			a: "You earn commissions from direct referrals (F1) and indirect referrals (F2) when they purchase packages."
		},
		{
			id: "03",
			q: "How do I get paid?",
			a: "Commissions are added to your wallet balance. You can request withdrawals which will be processed by admin."
		},
		{
			id: "04",
			q: "What payment methods are accepted?",
			a: "We accept USDT payments on BNB Chain (BEP20 network)."
		},
		{
			id: "05",
			q: "Is 2FA required?",
			a: "Yes, 2FA using Google Authenticator is required for login and withdrawals."
		}
	];

	const filteredFaqs = faqs.filter(faq => 
		faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
		faq.a.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-[#0C0B0B] text-white font-['Space_Grotesk'] selection:bg-red-500">
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
				{/* Ambient Effects */}
				<div 
					className="absolute inset-0 opacity-[0.05] pointer-events-none" 
					style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}
				/>
				<div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#EC3535]/10 blur-[150px] rounded-full -z-10 translate-x-1/2" />
				
				<div className="container mx-auto px-6 relative z-10">
					<div className="grid lg:grid-cols-2 gap-16 items-center">
						{/* Left Side: Content */}
						<div className="space-y-8">
							
							<h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
								Frequently <br />
								Asked <br />
								Questions
							</h1>
						
						</div>

						{/* Right Side: Illustration */}
						<div className="relative flex justify-center lg:justify-end group">
							<div className="absolute inset-0 bg-[#EC3535]/5 blur-[120px] rounded-full group-hover:bg-[#EC3535]/10 transition-colors duration-1000" />
							<div className="relative max-w-[650px] animate-float">
								<img 
									src={faqBg} 
									alt="FAQ Illustration" 
									className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(236,53,53,0.3)]"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ List Section - Node 1:8921 Design */}
			<section className="pb-32 relative">
				<div className="container mx-auto px-6">
					<div className="max-w-5xl mx-auto space-y-6">
						{filteredFaqs.length > 0 ? (
							filteredFaqs.map((faq) => (
								<div 
									key={faq.id}
									className="flex items-start gap-8 md:gap-12 p-8 md:p-12 rounded-[24px] bg-[#1A1B1D]/60 border border-white/5 backdrop-blur-xl hover:border-[#EC3535]/30 transition-all duration-300 group"
								>
									<span className="text-[#EC3535] text-5xl md:text-7xl font-black font-['Space_Grotesk'] leading-none opacity-40 group-hover:opacity-100 transition-opacity duration-300">
										{faq.id}
									</span>
									<div className="space-y-4">
										<h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
											{faq.q}
										</h3>
										<p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
											{faq.a}
										</p>
									</div>
								</div>
							))
						) : (
							<div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
								<p className="text-gray-400 text-xl font-medium tracking-wide">
									No matching questions found.
								</p>
							</div>
						)}
					</div>
				</div>
			</section>

			<style dangerouslySetInnerHTML={{ __html: `
				@keyframes faq-float {
					0%, 100% { transform: translateY(0) rotate(0deg); }
					50% { transform: translateY(-15px) rotate(1deg); }
				}
				.animate-float { animation: faq-float 8s ease-in-out infinite; }
			`}} />
		</div>
	);
}
