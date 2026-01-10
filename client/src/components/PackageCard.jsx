import { Link } from "react-router-dom";

export default function PackageCard({ pkg, isAuthenticated }) {
	return (
		<div className="flex flex-col items-center p-8 w-full max-w-[403px] glass-card">
			{/* Header Section with Border Frame */}
			<div className="w-[255px] rounded-2xl mb-6">
				{/* Inner content area */}
				<div className="flex flex-col items-center justify-between py-1 inset-[1.73px] rounded-2xl bg-transparent rounded-[16px] gradient-border">
					{/* Package Title */}
					<div className="w-[208px] mt-6 mb-4">
						<h2
							className="text-white text-center font-bold"
							style={{
								fontFamily: "Space Grotesk, sans-serif",
								fontSize: "32px",
								lineHeight: "1.2em",
								letterSpacing: "1.14%",
							}}
						>
							{pkg.name.toUpperCase()}
						</h2>
					</div>

					{/* Price Badge */}
					<div className="w-[168px] py-2 rounded-xl border-[0.5px] border-white bg-gradient-to-r from-[#DE2B34] to-[#78171C]">
						{/* Price Text */}
						<div className="flex items-center justify-center h-full px-[6px]">
							<span
								className="text-white font-bold text-center"
								style={{
									fontFamily: "Space Grotesk, sans-serif",
									fontSize: "22.5px",
									lineHeight: "1.56em",
									letterSpacing: "1.62%",
								}}
							>
								{pkg.price} {pkg.currency}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Description */}
		<div className="w-full px-4 mb-6 flex-1 flex flex-col justify-start">
			<p
				className="text-white text-center"
				style={{
					fontFamily: "Space Grotesk, sans-serif",
					fontSize: "16px",
					lineHeight: "1.5625em",
				}}
			>
				{pkg.description ||
					`${pkg.name} – License & Certificate Purchase grants a platform-issued Validator License with the right to participate in transaction validation on QAMCHAIN. An official ${pkg.name} Certificate is issued as proof. ${pkg.name} positions are limited. All sales are final. Validator Licenses are transferable and inheritable after six (6) months. This license grants validation rights only and does not represent equity or ownership.`}
			</p>
		</div>

			{/* Features List (if available) */}
			{pkg.features && pkg.features.length > 0 && (
				<div className="w-full px-4 mb-6">
					<ul className="space-y-2">
						{pkg.features.map((feature, idx) => (
							<li key={idx} className="text-white text-sm flex items-center gap-2">
								<span className="text-[#EC3535] font-bold">✓</span>
								<span style={{ fontFamily: "Space Grotesk, sans-serif" }}>{feature}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Button */}
			<div className="w-full max-w-[254px] absolute -bottom-[30px]">
				{isAuthenticated ? (
					<Link to="/dashboard" className="block w-full">
						<button
							className="w-full h-[64px] bg-[#EC3535] rounded-lg flex items-center justify-center gap-3 text-white font-bold uppercase tracking-wide hover:bg-[#DC2626] transition-colors duration-200"
							style={{
								fontFamily: "Space Grotesk, sans-serif",
								fontSize: "16px",
								lineHeight: "1.5625em",
								padding: "4px 32px",
							}}
						>
							<span className="whitespace-nowrap">PURCHASE NOW</span>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</button>
					</Link>
				) : (
					<Link to="/register" className="block w-full">
						<button
							className="w-full h-[64px] bg-[#EC3535] rounded-lg flex items-center justify-center gap-3 text-white font-bold uppercase tracking-wide hover:bg-[#DC2626] transition-colors duration-200"
							style={{
								fontFamily: "Space Grotesk, sans-serif",
								fontSize: "16px",
								lineHeight: "1.5625em",
							}}
						>
							<span className="whitespace-nowrap">SIGN UP TO PURCHASE</span>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</button>
					</Link>
				)}
			</div>
		</div>
	);
}
