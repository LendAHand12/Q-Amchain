export default function AffiliateStep({ stepNumber, title, icon, isLast = false }) {
	return (
		<>
			{/* Step */}
			<div className="flex flex-col w-[250px] h-full">
				{/* Step Number - Top */}
				<div className="flex justify-start px-2">
					<span
						className="text-transparent bg-clip-text font-bold"
						style={{
							fontFamily: "Space Grotesk, sans-serif",
							fontSize: "16px",
							lineHeight: "1.5625em",
							letterSpacing: "1.62%",
							backgroundImage: "linear-gradient(82deg, rgba(191, 23, 39, 1) 0%, rgba(232, 73, 79, 1) 100%)",
						}}
					>
						{stepNumber.toString().padStart(2, "0")}
					</span>
				</div>

				{/* Title - Middle */}
				<div className="flex-1 flex items-start justify-start px-2">
					<h3
						className="text-white font-bold"
						style={{
							fontFamily: "Space Grotesk, sans-serif",
							fontSize: "36px",
							lineHeight: "1.33em",
							letterSpacing: "1%",
						}}
					>
						{title}
					</h3>
				</div>

				{/* Icon - Bottom */}
				<div className="flex justify-end">
					<img src={icon} alt={`Step ${stepNumber}`} className="w-20 h-20" />
				</div>
			</div>

			{/* Separator - only show if not last step */}
			{!isLast && <div className="w-[1px] h-[417px] bg-gradient-to-b from-transparent via-[#FF824B] to-transparent flex-shrink-0" />}
		</>
	);
}
