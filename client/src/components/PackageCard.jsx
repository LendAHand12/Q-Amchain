import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

export default function PackageCard({ pkg, isAuthenticated }) {
	return (
		<div className="flex flex-col items-center p-8 w-full max-w-[403px] min-h-[585px] relative overflow-hidden rounded-[16px] backdrop-blur-[33px] bg-[#060213]/10 border border-white/5 shadow-[inset_0px_4px_12px_rgba(255,255,255,0.1),inset_0px_20px_50px_rgba(236,53,53,0.1)] transition-all duration-300 hover:shadow-[inset_0px_8px_16px_rgba(255,255,255,0.2),inset_0px_21px_67px_rgba(236,53,53,0.32),inset_0px_50px_67px_rgba(230,137,138,0.43)] group/card">
			
			{/* Title Section with Inner Border */}
			<div className="w-full mb-8 relative">
				<div className="flex items-center justify-center p-8 rounded-[16px] border-[1.7px] border-[#E5E9EE]/20 shadow-lg min-h-[173px] bg-black/20">
					<h3 className="text-white text-3xl font-bold text-center leading-tight uppercase tracking-wider px-4">
						{pkg.name}
					</h3>
				</div>
			</div>

			{/* Price Badge */}
			<div className="relative -mt-12 mb-8 z-10">
				<div className="bg-gradient-to-r from-[#DE2B34] to-[#78171C] border-[0.7px] border-white/50 px-8 py-3 rounded-[16px] shadow-2xl">
					<div className="text-white font-bold text-[22.5px] tracking-wide whitespace-nowrap">
						{pkg.price} <span className="text-sm ml-1">USDT</span>
					</div>
				</div>
			</div>

			{/* Description Area */}
			<div className="flex-1 w-full mb-8 px-2">
				<p className="text-white text-sm leading-[25px] text-center opacity-80">
					{pkg.description || `${pkg.name} – License & Certificate Purchase grants a platform-issued Validator License with the right to participate in transaction validation on QAMCHAIN. An official ${pkg.name} Certificate is issued as proof of ownership.`}
				</p>
			</div>

			{/* Action Button */}
			<div className="w-full mt-auto">
				<Link to={isAuthenticated ? "/dashboard" : "/register"} className="block w-full">
					<button className="w-full h-[64px] bg-[#EC3535] rounded-[8px] text-white font-bold uppercase tracking-widest text-[16px] flex items-center justify-center gap-3 group-hover/card:brightness-110 transition-all shadow-lg active:scale-95">
						Sign Up to Purchase
						<MoveRight className="w-5 h-5" />
					</button>
				</Link>
			</div>
		</div>
	);
}
