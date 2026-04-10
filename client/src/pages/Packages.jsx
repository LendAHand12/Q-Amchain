import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MoveRight, CheckCircle2 } from "lucide-react";
import packagesHeroBg from "../assets/background/packages-1.png";
import PackageCard from "../components/PackageCard";
import api from "../utils/api";
import { useAuthStore } from "../store/authStore";

export default function Packages() {
	const [packages, setPackages] = useState([]);
	const [loading, setLoading] = useState(true);
	const { isAuthenticated } = useAuthStore();
	const [searchParams] = useSearchParams();
	const packageIdFromUrl = searchParams.get("package");

	useEffect(() => {
		fetchPackages();
		window.scrollTo(0, 0);
	}, [packageIdFromUrl]);

	const fetchPackages = async () => {
		try {
			const response = await api.get("/packages/active");
			setPackages(response.data.data);
		} catch (error) {
			console.error("Failed to load packages:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#060213] flex items-center justify-center">
				<div className="text-center text-white text-xl">Loading packages...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#0C0B0B] text-white font-['Barlow',sans-serif]">
			{/* Hero Section - QAMCHAIN Validator Program */}
			<section className="relative min-h-[80vh] flex items-center bg-[#0C0B0B] overflow-hidden">
				<div className="container mx-auto px-6 relative z-10 py-20">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left Content */}
						<div className="max-w-xl">
							<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-tight mb-8">
								QAMCHAIN <br />
								VALIDATOR <br />
								PROGRAM
							</h1>
							
							<p className="text-white text-sm md:text-base font-bold mb-12 opacity-90 tracking-wide uppercase">
								Limited Tiers • Long-Term Alignment • Built for Stability
							</p>
							
							<div className="space-y-6">
								<h3 className="text-[#EC3535] text-lg font-bold uppercase tracking-widest">
									WHAT YOU PURCHASE
								</h3>
								<p className="text-white text-base md:text-lg leading-relaxed opacity-80 max-w-md">
									Purchasing a validator grants a platform-issued Validator License. 
									An official VAL CERT is issued as proof of ownership.
								</p>
							</div>
						</div>

						{/* Right side - The actual Hero Asset */}
						<div className="relative flex justify-center lg:justify-end">
							<div className="relative w-full max-w-[700px]">
								<img 
									src={packagesHeroBg} 
									alt="Validator Tiers" 
									className="w-full h-auto object-contain transform lg:scale-110 lg:translate-x-12"
								/>
								{/* Subtle glow behind the image */}
								<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/10 blur-[100px] rounded-full -z-10" />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Packages Grid Section */}
			<section className="py-24 bg-[#0C0B0B] relative overflow-hidden">
				<div 
					className="absolute inset-0 opacity-[0.03] pointer-events-none" 
					style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}
				/>
				
				<div className="container mx-auto px-6 relative z-10">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto mb-20">
						{packages.map((pkg) => (
							<PackageCard 
								key={pkg._id} 
								pkg={pkg} 
								isAuthenticated={isAuthenticated} 
							/>
						))}
						{packages.length === 0 && !loading && (
							<div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
								<p className="text-gray-400 text-xl">No active packages available at the moment.</p>
							</div>
						)}
					</div>

					{/* Bottom Action Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 max-w-7xl mx-auto">
						<Link to="/register" className="w-full sm:w-auto">
							<button className="w-full sm:w-[219px] h-[55px] bg-[#EC3535] rounded-[6.89px] flex items-center justify-center gap-2 text-white font-bold uppercase text-[12px] hover:bg-[#CC202E] transition-all transform active:scale-95 shadow-xl">
								APPLY / PURCHASE
								<MoveRight className="w-4 h-4" />
							</button>
						</Link>
						<button className="w-full sm:w-[289px] h-[55px] border border-white rounded-[6.89px] flex items-center justify-center gap-2 text-white font-bold uppercase text-[12px] hover:bg-white/5 transition-all transform active:scale-95">
							DOWNLOAD VALIDATOR TERMS
							<MoveRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}
