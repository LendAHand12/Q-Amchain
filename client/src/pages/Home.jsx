import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Import background images
import home1Bg from "@/assets/background/home-1.png";
import home2Bg from "@/assets/background/home-2.png";
import home3Bg from "@/assets/background/home-3.png";

// Import icons
import trustIcon from "@/assets/icons/trust.svg";
import safeIcon from "@/assets/icons/safe.png";
import speedIcon from "@/assets/icons/speed.png";

// Custom Card Component using pure flexbox - responsive design
const CustomCard = ({ icon, title, description }) => {
	return (
		<div className="h-[252px] w-full max-w-sm mx-auto bg-[#1A1B1D] rounded-2xl backdrop-blur-[10px] overflow-hidden border-2 border-transparent bg-gradient-to-bl from-[#3D3434] from-0% to-[#DE2B34] to-100% p-[2px]">
			{/* Inner content with background */}
			<div className="h-full w-full bg-[#1A1B1D] rounded-xl p-4 sm:p-6 lg:p-7 flex flex-col">
				{/* Icon */}
				<div className="flex justify-end mb-4">
					<img src={icon} alt={title} className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
				</div>

				{/* Spacer to push content to bottom */}
				<div className="flex-1"></div>

				{/* Text content positioned at bottom */}
				<div className="flex flex-col">
					<h3 className="text-white text-xl sm:text-2xl font-bold leading-[1.25] tracking-[1.5%] font-['Space_Grotesk'] mb-3 sm:mb-5">{title}</h3>
					<p className="text-white text-sm sm:text-base font-normal leading-[1.5625] font-['Space_Grotesk']">{description}</p>
				</div>
			</div>
		</div>
	);
};

export default function Home() {
	return (
		<div className="min-h-screen w-full bg-[#0C0B0B]">
			<Header />

			{/* Section 1 - Hero Section with home-1 background */}
			<section className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center" style={{ backgroundImage: `url(${home1Bg})` }}>
				<div className="flex-1 mx-auto px-4 sm:px-6 lg:px-8 lg:container">
					<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 text-[#EC3535] uppercase tracking-tight leading-tight">
						<div className="mb-2">Q-Amchain</div>
						<div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Validator Packages</div>
					</h1>
					<p className="text-base sm:text-lg md:text-xl mb-8 max-w-[570px] text-white leading-relaxed">Join our affiliate program and earn commissions by referring validator packages. Start earning today with our 2-tier commission system.</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<Button asChild size="lg" className="bg-[#EC3535] hover:bg-[#EC3535]/90 text-white px-6 sm:px-8 py-4 rounded-lg font-bold uppercase tracking-wide h-14 sm:h-16 w-full sm:w-[196px]">
							<Link to="/packages" className="flex items-center justify-center gap-2">
								View Packages
								<svg width="18" height="15" viewBox="0 0 18 15" fill="none">
									<path d="M10.5 1.5L16.5 7.5L10.5 13.5M16.5 7.5H1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg" className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#EC3535] px-6 sm:px-8 py-4 rounded-lg font-bold uppercase tracking-wide h-14 sm:h-16 w-full sm:w-[196px] transition-all duration-300">
							<Link to="/register" className="flex items-center justify-center gap-2">
								Get Started
								<svg width="18" height="15" viewBox="0 0 18 15" fill="none">
									<path d="M10.5 1.5L16.5 7.5L10.5 13.5M16.5 7.5H1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Section 2 - Features Section with home-2 background */}
			<section className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center" style={{ backgroundImage: `url(${home2Bg})` }}>
				<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-16 lg:mb-20 text-white uppercase tracking-tight my-5 sm:mt-10">Why Choose Q-Amchain?</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-[28px] max-w-7xl mx-auto">
					<CustomCard icon={trustIcon} title="2-Tier Commission" description="Earn from direct referrals (F1) and indirect referrals (F2)" />

					<CustomCard icon={safeIcon} title="Secure Payments" description="All payments processed via USDT on BNB Chain (BEP20)" />

					<CustomCard icon={speedIcon} title="Real-time Tracking" description="Monitor your earnings and referral network in real-time" />
				</div>
			</section>

			{/* Section 3 - CTA Section with home-3 background */}
			<section className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center py-16 sm:py-20 lg:py-24" style={{ backgroundImage: `url(${home3Bg})` }}>
				<div className="flex-1"></div>
				<div className="flex-1 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
					<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[64px] font-bold leading-[1.125] tracking-[0.56%] text-white mb-4">
						<div className="text-[#ffffff] mb-2">Ready to</div>
						<div className="text-[#DE2B34]">Start Earning?</div>
					</h2>
					<p className="text-sm sm:text-base font-normal leading-[1.5625] text-center text-white mb-8 sm:mb-[35px] max-w-[255px]">Join thousands of users already earning with Q-Amchain</p>
					<Button asChild className="bg-[#EC3535] hover:bg-[#EC3535]/90 text-white font-bold text-base leading-[1.5625] px-6 sm:px-8 py-4 rounded-lg h-12 sm:h-14 flex items-center justify-center gap-2.5 transition-all duration-300 w-full sm:w-auto">
						<Link to="/register" className="flex items-center justify-center gap-2.5">
							Create Free Account
							<svg width="18" height="15" viewBox="0 0 18 15" fill="none">
								<path d="M10.5 1.5L16.5 7.5L10.5 13.5M16.5 7.5H1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</Link>
					</Button>
				</div>
			</section>

			<Footer />
		</div>
	);
}
