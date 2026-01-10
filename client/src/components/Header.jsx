import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logo from "@/assets/logo.png";
import regionIcon from "@/assets/icons/region.svg";

export default function Header() {
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	const isActive = (path) => {
		return location.pathname === path;
	};

	const toggleMobileMenu = () => {
		if (!isMobileMenuOpen) {
			setIsMobileMenuOpen(true);
			setTimeout(() => setIsAnimating(true), 10);
		} else {
			setIsAnimating(false);
			setTimeout(() => setIsMobileMenuOpen(false), 300);
		}
	};

	const closeMobileMenu = () => {
		setIsAnimating(false);
		setTimeout(() => setIsMobileMenuOpen(false), 300);
	};

	return (
		<header className="bg-[#0C0B0B] py-5 relative">
			<div className="flex items-center justify-between px-4 sm:px-6 lg:container">
				{/* Logo */}
				<div className="flex-shrink-0 py-3">
					<Link to="/" className="flex items-center" onClick={closeMobileMenu}>
						<img src={logo} alt="Q-Amchain" className="h-10 w-auto" />
					</Link>
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden lg:flex items-center gap-6 h-12">
					{/* Navigation Links */}
					<div className="flex items-center gap-6">
						<Link to="/packages" className={`px-1 py-1 text-base font-normal uppercase tracking-wide transition-colors ${isActive("/packages") ? "text-[#EC3535]" : "text-white hover:text-[#EC3535]"}`}>
							Packages
						</Link>

						<Link to="/affiliate" className={`px-1 py-1 text-base font-normal uppercase tracking-wide transition-colors ${isActive("/affiliate") ? "text-[#EC3535]" : "text-white hover:text-[#EC3535]"}`}>
							Affiliate
						</Link>

						<Link to="/blog" className={`px-1 py-1 text-base font-normal uppercase tracking-wide transition-colors ${isActive("/blog") ? "text-[#EC3535]" : "text-white hover:text-[#EC3535]"}`}>
							Blog
						</Link>

						<Link to="/faq" className={`px-1 py-1 text-base font-normal uppercase tracking-wide transition-colors ${isActive("/faq") ? "text-[#EC3535]" : "text-white hover:text-[#EC3535]"}`}>
							FAQ
						</Link>
						<Link to="/login" className={`px-1 py-1 text-base font-normal uppercase tracking-wide transition-colors ${isActive("/login") ? "text-[#EC3535]" : "text-white hover:text-[#EC3535]"}`}>
							Login
						</Link>
					</div>

					{/* Region Icon */}
					<div className="w-6 h-6 flex items-center justify-center">
						<img src={regionIcon} alt="Region" className="w-[18px] h-[18px] object-contain" />
					</div>

					{/* Register Button */}
					<Button asChild className="bg-gradient-to-r from-[#BF1727] to-[#E8494F] hover:from-[#BF1727]/90 hover:to-[#E8494F]/90 text-white px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-200">
						<Link to="/register">Register</Link>
					</Button>
				</nav>

				{/* Mobile Menu Button */}
				<button onClick={toggleMobileMenu} className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5 focus:outline-none" aria-label="Toggle mobile menu">
					<span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
					<span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
					<span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
				</button>
			</div>

			{/* Mobile Menu Overlay */}
			{isMobileMenuOpen && (
				<div className={`lg:hidden fixed inset-0 z-50 bg-black transition-opacity duration-200 ease-in-out ${isAnimating ? "bg-opacity-50" : "bg-opacity-0"}`} onClick={closeMobileMenu}>
					{/* Mobile Sidebar */}
					<div className={`fixed top-0 left-0 h-full w-80 bg-[#0C0B0B] shadow-2xl transform transition-all duration-300 ease-out ${isAnimating ? "translate-x-0 opacity-100" : "-translate-x-full opacity-90"}`} onClick={(e) => e.stopPropagation()}>
						{/* Mobile Menu Header */}
						<div className="flex items-center justify-between p-4 border-b border-gray-700/50 backdrop-blur-sm">
							<img src={logo} alt="Q-Amchain" className="h-8 w-auto" />
							<button onClick={closeMobileMenu} className="w-10 h-10 flex items-center justify-center text-white hover:text-[#EC3535] transition-all duration-200 hover:bg-[#EC3535]/10 rounded-full" aria-label="Close menu">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</button>
						</div>

						{/* Mobile Menu Content */}
						<div className="flex flex-col p-6 space-y-2 overflow-y-auto h-full pb-20">
							{/* Navigation Links */}
							<Link
								to="/packages"
								className={`px-4 py-4 text-lg font-normal uppercase tracking-wide transition-all duration-300 ease-out rounded-xl transform hover:scale-[1.02] hover:shadow-lg ${
									isActive("/packages") ? "text-[#EC3535] bg-gradient-to-r from-[#EC3535]/20 to-[#EC3535]/10 shadow-md" : "text-white hover:text-[#EC3535] hover:bg-gradient-to-r hover:from-[#EC3535]/10 hover:to-[#EC3535]/5"
								}`}
								onClick={closeMobileMenu}
							>
								Packages
							</Link>

							<Link
								to="/affiliate"
								className={`px-4 py-4 text-lg font-normal uppercase tracking-wide transition-all duration-300 ease-out rounded-xl transform hover:scale-[1.02] hover:shadow-lg ${
									isActive("/affiliate") ? "text-[#EC3535] bg-gradient-to-r from-[#EC3535]/20 to-[#EC3535]/10 shadow-md" : "text-white hover:text-[#EC3535] hover:bg-gradient-to-r hover:from-[#EC3535]/10 hover:to-[#EC3535]/5"
								}`}
								onClick={closeMobileMenu}
							>
								Affiliate
							</Link>

							<Link
								to="/blog"
								className={`px-4 py-4 text-lg font-normal uppercase tracking-wide transition-all duration-300 ease-out rounded-xl transform hover:scale-[1.02] hover:shadow-lg ${isActive("/blog") ? "text-[#EC3535] bg-gradient-to-r from-[#EC3535]/20 to-[#EC3535]/10 shadow-md" : "text-white hover:text-[#EC3535] hover:bg-gradient-to-r hover:from-[#EC3535]/10 hover:to-[#EC3535]/5"}`}
								onClick={closeMobileMenu}
							>
								Blog
							</Link>

							<Link
								to="/faq"
								className={`px-4 py-4 text-lg font-normal uppercase tracking-wide transition-all duration-300 ease-out rounded-xl transform hover:scale-[1.02] hover:shadow-lg ${isActive("/faq") ? "text-[#EC3535] bg-gradient-to-r from-[#EC3535]/20 to-[#EC3535]/10 shadow-md" : "text-white hover:text-[#EC3535] hover:bg-gradient-to-r hover:from-[#EC3535]/10 hover:to-[#EC3535]/5"}`}
								onClick={closeMobileMenu}
							>
								FAQ
							</Link>
							<Link
								to="/login"
								className={`px-4 py-4 text-lg font-normal uppercase tracking-wide transition-all duration-300 ease-out rounded-xl transform hover:scale-[1.02] hover:shadow-lg ${isActive("/login") ? "text-[#EC3535] bg-gradient-to-r from-[#EC3535]/20 to-[#EC3535]/10 shadow-md" : "text-white hover:text-[#EC3535] hover:bg-gradient-to-r hover:from-[#EC3535]/10 hover:to-[#EC3535]/5"}`}
								onClick={closeMobileMenu}
							>
								Login
							</Link>

							{/* Divider */}
							<div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-4"></div>

							{/* Region Icon */}
							<div className="flex items-center px-4 py-4 transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-[#EC3535]/10 hover:to-[#EC3535]/5 rounded-xl transform hover:scale-[1.02]">
								<img src={regionIcon} alt="Region" className="w-6 h-6 object-contain mr-4" />
								<span className="text-white text-lg font-medium">Region</span>
							</div>

							{/* Register Button */}
							<div className="pt-6">
								<Button asChild className="w-full bg-gradient-to-r from-[#BF1727] to-[#E8494F] hover:from-[#BF1727]/90 hover:to-[#E8494F]/90 text-white px-6 py-4 rounded-xl font-bold text-lg uppercase tracking-wide transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-xl active:scale-95">
									<Link to="/register" onClick={closeMobileMenu}>
										Register
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
