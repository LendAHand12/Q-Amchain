import affiliateHero1 from "@/assets/background/aff-1.png";
import affiliateHero2 from "@/assets/background/aff-2.png";
import affiliateHero3 from "@/assets/background/aff-3.png";
import accountSolution from "@/assets/account-solution.png";
import tickSolution from "@/assets/tick-solution.png";
import linkSolution from "@/assets/link-solution.png";
import moneySolution from "@/assets/money-solution.png";
import { Link } from "react-router-dom";
import AffiliateStep from "@/components/AffiliateStep";

export default function Affiliate() {
	const steps = [
		{
			title: "Create a free account",
			icon: accountSolution,
		},
		{
			title: "Get your unique referral code",
			icon: tickSolution,
		},
		{
			title: "Share your referral link with others",
			icon: linkSolution,
		},
		{
			title: "Start earning commissions!",
			icon: moneySolution,
		},
	];

	return (
		<div className="min-h-screen">
			{/* Section 1: Hero Background */}
			<section
				className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: `url(${affiliateHero1})`,
				}}
			>
				<div className="relative z-10 container px-0 mx-auto">
					<div className="max-w-4xl">
						<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-left leading-tight">
							<div>AFFILIATE</div>
							<div>PROGRAM</div>
						</h1>
						<p className="text-xl md:text-2xl text-gray-200 leading-relaxed text-left mt-6 hidden">Join our affiliate program and start earning commissions with our 2-tier system</p>
					</div>
				</div>
			</section>

			{/* Section 2: Commission Structure */}
			<section className="min-h-screen max-h-[670px] bg-[#0C0B0B] py-20 flex items-center">
				<div className="container mx-auto px-4">
					{/* Header */}
					<div className="text-center mb-16">
						<p
							className="text-[#EC3535] font-bold mb-2"
							style={{
								fontFamily: "Space Grotesk, sans-serif",
								fontSize: "16px",
								lineHeight: "1.5625em",
							}}
						>
							AFFILIATE PROGRAM
						</p>
						<h2
							className="text-white font-bold uppercase mb-4"
							style={{
								fontFamily: "Space Grotesk, sans-serif",
								fontSize: "48px",
								lineHeight: "1.25em",
								letterSpacing: "0.75%",
							}}
						>
							HOW TO GET STARTED
						</h2>
						<p
							className="text-white max-w-[618px] mx-auto"
							style={{
								fontFamily: "Space Grotesk, sans-serif",
								fontSize: "16px",
								lineHeight: "1.5625em",
							}}
						>
							Our affiliate program offers a simple 2-tier commission structure:
						</p>
					</div>

					{/* Commission Cards */}
					<div className="flex flex-col lg:flex-row gap-8 justify-center items-center max-w-6xl mx-auto">
						{/* Level 1 Card */}
						<div
							className="w-[516px] h-[262px] rounded-[19px] relative"
							style={{
								background: "rgba(255, 255, 255, 0.1)",
								backdropFilter: "blur(12px)",
							}}
						>
							{/* Header with Gradient Border */}
							<div className="absolute left-[131px] top-[42px] w-[255px] h-[100px]">
								{/* Gradient Border Container */}
								<div className="w-full h-full rounded-2xl relative gradient-border">
									{/* Inner Content */}
									<div className="w-full h-full rounded-2xl bg-transparent flex items-center justify-center">
										<h3
											className="text-white font-bold uppercase text-center"
											style={{
												fontFamily: "Space Grotesk, sans-serif",
												fontSize: "32px",
												lineHeight: "1.2em",
												letterSpacing: "1.14%",
											}}
										>
											LEVEL 1 (F1)
										</h3>
									</div>
								</div>
							</div>

							{/* Description */}
							<div className="absolute left-[111px] top-[154px] w-[293px] h-[39px]">
								<p
									className="text-white text-center"
									style={{
										fontFamily: "Space Grotesk, sans-serif",
										fontSize: "24px",
										lineHeight: "1.04em",
									}}
								>
									Earn commission from direct referrals
								</p>
							</div>
						</div>
						{/* Link 2 Level Card */}
						{/* Level 2 Card */}
						<div
							className="w-[516px] h-[262px] rounded-[19px] relative"
							style={{
								background: "rgba(255, 255, 255, 0.1)",
								backdropFilter: "blur(12px)",
							}}
						>
							{/* Header with Gradient Border */}
							<div className="absolute left-[131px] top-[42px] w-[255px] h-[100px]">
								{/* Gradient Border Container */}
								<div className="w-full h-full rounded-2xl relative gradient-border">
									{/* Inner Content */}
									<div className="w-full h-full rounded-2xl bg-transparent flex items-center justify-center">
										<h3
											className="text-white font-bold uppercase text-center"
											style={{
												fontFamily: "Space Grotesk, sans-serif",
												fontSize: "32px",
												lineHeight: "1.2em",
												letterSpacing: "1.14%",
											}}
										>
											LEVEL 2 (F2)
										</h3>
									</div>
								</div>
							</div>

							{/* Description */}
							<div className="absolute left-[111px] top-[154px] w-[293px] h-[39px]">
								<p
									className="text-white text-center"
									style={{
										fontFamily: "Space Grotesk, sans-serif",
										fontSize: "24px",
										lineHeight: "1.04em",
									}}
								>
									Earn commission from referrals of your referrals
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section 3: How to Get Started Steps */}
			<section
				className="min-h-screen bg-[#0C0B0B] py-20 flex items-center bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: `url(${affiliateHero2})`,
				}}
			>
				<div className="container mx-auto px-0">
					{/* Header */}
					<div className="text-center mb-16">
						<p
							className="text-[#EC3535] font-bold mb-2"
							style={{
								fontFamily: "Space Grotesk, sans-serif",
								fontSize: "16px",
								lineHeight: "1.5625em",
							}}
						>
							AFFILIATE PROGRAM
						</p>
						<h2
							className="text-white font-bold uppercase"
							style={{
								fontFamily: "Space Grotesk, sans-serif",
								fontSize: "48px",
								lineHeight: "1.25em",
								letterSpacing: "0.75%",
							}}
						>
							HOW TO GET STARTED
						</h2>
					</div>

					{/* Steps Container */}
					<div className="max-w-[1248px] mx-auto relative">
						<div className="relative w-full min-h-[488px] rounded-xl px-0 p-10 flex items-center justify-center border-gradient variant-2">
							{/* Steps Row */}
							<div className="flex gap-[30px] items-start justify-center w-full h-[350px]">
								{steps.map((step, index) => (
									<AffiliateStep key={index} stepNumber={index + 1} title={step.title} icon={step.icon} isLast={index === steps.length - 1} />
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section 4: Call to Action Background */}
			<section
				className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: `url(${affiliateHero3})`,
				}}
			>
				<div className="relative z-10 container px-0 mx-auto">
					<div className="max-w-4xl">
						<h2 className="text-left leading-tight mb-6">
							<div
								style={{
									fontFamily: "Space Grotesk, sans-serif",
									fontSize: "64px",
									fontWeight: 700,
									lineHeight: "72px",
									letterSpacing: "0.36px",
									color: "#FFFFFF",
								}}
							>
								READY TO
							</div>
							<div
								style={{
									fontFamily: "Space Grotesk, sans-serif",
									fontSize: "64px",
									fontWeight: 700,
									lineHeight: "72px",
									letterSpacing: "0.36px",
									color: "#DE2B34",
								}}
							>
								START?
							</div>
						</h2>
						<div className="text-left mb-8">
							<p
								style={{
									fontFamily: "Space Grotesk, sans-serif",
									fontSize: "16px",
									fontWeight: 400,
									lineHeight: "25px",
									color: "#FFFFFF",
								}}
							>
								Join our affiliate program today
							</p>
							<p
								style={{
									fontFamily: "Space Grotesk, sans-serif",
									fontSize: "16px",
									fontWeight: 400,
									lineHeight: "25px",
									color: "#FFFFFF",
								}}
							>
								and start earning commissions.
							</p>
						</div>
						<div className="text-left">
							<Link
								to="/register"
								className="inline-flex items-center gap-3 px-12 py-4 bg-[#EC3535] hover:bg-[#DC2626] text-white font-bold text-lg rounded-lg transition-colors duration-200 uppercase tracking-wide"
								style={{
									fontFamily: "Space Grotesk, sans-serif",
								}}
							>
								SIGN UP NOW
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
									<path d="M5 12h14M12 5l7 7-7 7" />
								</svg>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
