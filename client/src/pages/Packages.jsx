import { Link } from "react-router-dom";
import packagesHeroBg from "../assets/background/packages-1.png";
import PackageCard from "../components/PackageCard";

export default function Packages() {
	// const [packages, setPackages] = useState([])
	// const [loading, setLoading] = useState(true)
	// const { isAuthenticated } = useAuthStore()

	// useEffect(() => {
	//   fetchPackages()
	// }, [])

	// const fetchPackages = async () => {
	//   try {
	//     const response = await api.get('/packages')
	//     setPackages(response.data.data)
	//   } catch (error) {
	//     console.error('Failed to load packages')
	//   } finally {
	//     setLoading(false)
	//   }
	// }

	// if (loading) {
	//   return (
	//     <div className="container mx-auto px-4 py-12">
	//       <div className="text-center">Loading packages...</div>
	//     </div>
	//   );
	// }

	// Mock data for display
	const packages = [
		{
			_id: "1",
			name: "Advanced Validators",
			price: "900",
			currency: "USDT",
			description:
				"Advanced Validator – License & Certificate Purchase grants a platform-issued Validator License with the right to participate in transaction validation on QAMCHAIN. An official Advanced Validator Certificate is issued as proof. Advanced Validator positions are limited. All sales are final. Validator Licenses are transferable and inheritable after six (6) months. This license grants validation rights only and does not represent equity or ownership.",
		},
		{
			_id: "2",
			name: "Core Validators",
			price: "4000",
			currency: "USDT",
			description:
				"Core Validator – License & Certificate Purchase grants a platform-issued Validator License with the right to participate in transaction validation on QAMCHAIN. An official Core Validator Certificate is issued as proof. Core Validator positions are limited. All sales are final. Validator Licenses are transferable and inheritable after six (6) months. This license grants validation rights only and does not represent equity or ownership.",
		},
		{
			_id: "3",
			name: "Genesis Validators",
			price: "8000",
			currency: "USDT",
			description:
				"Genesis Validator – License & Certificate Purchase grants a platform-issued Validator License with the right to participate in transaction validation on QAMCHAIN. An official Genesis Validator Certificate is issued as proof. Genesis Validator positions are limited. All sales are final. Validator Licenses are transferable and inheritable after six (6) months. This license grants validation rights only and does not represent equity or ownership.",
		},
	];

	const isAuthenticated = false; // Mock authentication state

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section
				className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: `url(${packagesHeroBg})`,
				}}
			>
				{/* Hero Content */}
				<div className="relative z-10 container px-0 mx-auto ">
					<div className="max-w-4xl">
						<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-left leading-tight">
							<div>VALIDATOR</div>
							<div>PACKAGES</div>
						</h1>
						<p className="text-xl md:text-2xl text-gray-200 leading-relaxed text-left mt-6">Choose the perfect package for your needs</p>
					</div>
				</div>
			</section>

			{/* Packages Cards Section */}
			<section className="min-h-screen bg-[#060213] flex items-center">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{packages.map((pkg) => (
							<PackageCard key={pkg._id} pkg={pkg} isAuthenticated={isAuthenticated} />
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
