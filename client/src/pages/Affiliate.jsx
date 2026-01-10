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
					<div className="flex flex-col lg:flex-row gap-14 justify-center items-center max-w-6xl mx-auto relative">
						{/* Level 1 Card */}
						<div
							className="w-[516px] h-[262px] rounded-[19px] relative"
							style={{
								zIndex: "2",
								background: "rgba(36, 35, 35, 0.64)",
								borderRadius: "16px",
								boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
								backdropFilter: "blur(8.5px)",
								WebkitBackdropFilter: "blur(8.5px)",
								border: "1px solid rgba(175, 175, 175, 0.3)",
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
						<div className="absolute" style={{ zIndex: 1 }}>
							<svg xmlns="http://www.w3.org/2000/svg" width="96" height="97" viewBox="0 0 96 97" fill="none">
								<path
									d="M-9.82285e-05 8.66016L8.66016 17.3204L17.3204 8.66016L8.66016 -9.82285e-05L-9.82285e-05 8.66016ZM8.66016 8.66016V10.1602H9.41016V8.66016V7.16016H8.66016V8.66016ZM10.9102 8.66016V10.1602H11.6602V8.66016V7.16016H10.9102V8.66016ZM11.6602 8.66016V10.1602C13.3658 10.1602 15.0448 10.271 16.6905 10.4856L16.8845 8.99825L17.0785 7.51085C15.3045 7.27944 13.4959 7.16016 11.6602 7.16016V8.66016ZM26.9717 11.6954L26.3971 13.081C29.5262 14.3786 32.4478 16.0774 35.0975 18.1136L36.0115 16.9242L36.9255 15.7348C34.0703 13.5407 30.9209 11.7092 27.5463 10.3098L26.9717 11.6954ZM43.3961 24.3088L42.2068 25.2228C44.243 27.8725 45.9417 30.7941 47.2393 33.9232L48.6249 33.3486L50.0105 32.7741C48.6111 29.3994 46.7796 26.25 44.5855 23.3948L43.3961 24.3088ZM51.3221 43.4358L49.8347 43.6298C50.0493 45.2755 50.1602 46.9545 50.1602 48.6602H51.6602H53.1602C53.1602 46.8244 53.0409 45.0158 52.8095 43.2418L51.3221 43.4358ZM51.6602 48.6602H50.1602V50.1602H51.6602H53.1602V48.6602H51.6602ZM51.6602 53.1602H50.1602V54.6602H51.6602H53.1602V53.1602H51.6602ZM51.6602 54.6602H50.1602C50.1602 56.4959 50.2794 58.3045 50.5108 60.0785L51.9982 59.8845L53.4856 59.6905C53.271 58.0448 53.1602 56.3658 53.1602 54.6602H51.6602ZM54.6954 69.9717L53.3098 70.5463C54.7092 73.9209 56.5407 77.0703 58.7348 79.9255L59.9242 79.0115L61.1136 78.0975C59.0774 75.4478 57.3786 72.5262 56.081 69.3971L54.6954 69.9717ZM67.3088 86.3961L66.3948 87.5855C69.25 89.7796 72.3994 91.6111 75.7741 93.0105L76.3486 91.6249L76.9232 90.2393C73.7941 88.9417 70.8725 87.243 68.2228 85.2068L67.3088 86.3961ZM86.4358 94.3221L86.2418 95.8095C88.0158 96.0409 89.8244 96.1602 91.6602 96.1602V94.6602V93.1602C89.9545 93.1602 88.2755 93.0493 86.6298 92.8347L86.4358 94.3221ZM91.6602 94.6602V96.1602H92.5352V94.6602V93.1602H91.6602V94.6602ZM94.2852 94.6602V96.1602H95.1602V94.6602V93.1602H94.2852V94.6602Z"
									fill="url(#paint0_linear_204_20270)"
								/>
								<defs>
									<linearGradient id="paint0_linear_204_20270" x1="-10.3276" y1="51.6602" x2="107.579" y2="49.1698" gradientUnits="userSpaceOnUse">
										<stop stop-color="#BF1727" />
										<stop offset="1" stop-color="#E8494F" />
									</linearGradient>
								</defs>
							</svg>
						</div>
						{/* Level 2 Card */}
						<div
							className="w-[516px] h-[262px] rounded-[19px] relative"
							style={{
								zIndex: "2",
								background: "rgba(36, 35, 35, 0.64)",
								borderRadius: "16px",
								boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
								backdropFilter: "blur(8.5px)",
								WebkitBackdropFilter: "blur(8.5px)",
								border: "1px solid rgba(175, 175, 175, 0.3)",
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
						<div className="relative w-full min-h-[488px] rounded-xl px-0 p-10 flex items-center justify-center gradient-border variant-2">
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
				<div className="relative z-10 container mx-auto">
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
