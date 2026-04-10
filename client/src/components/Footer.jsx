import { Link } from "react-router-dom";
import logo from "@/assets/logo_footer.png";
import emailIcon from "@/assets/icons/email.svg";
import tiktokIcon from "@/assets/icons/tiktok.svg";
import telegramIcon from "@/assets/icons/tele.svg";
import twitterIcon from "@/assets/icons/twitter.svg";
import mediumIcon from "@/assets/icons/medium.svg";
import linkedinIcon from "@/assets/icons/Linkedin.svg";
import facebookIcon from "@/assets/icons/Facebook.svg";
import discordIcon from "@/assets/icons/Discord.svg";
import youtubeIcon from "@/assets/icons/youtube.svg";

export default function Footer() {
	return (
		<footer className="bg-[#0C0B0B] text-white pt-24 pb-12 border-t border-white/5">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
					{/* Left Section - Logo and Contact */}
					<div className="lg:col-span-2 space-y-8">
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<img src={logo} alt="Ameritec" className="h-10 w-auto" />
							</div>
							<p className="text-gray-400 text-sm font-medium tracking-tight">Validator packages and affiliate platform</p>
						</div>

						{/* Contact Info */}
						<div className="flex items-center gap-3 group cursor-pointer">
							<div className="w-6 h-6 flex-shrink-0">
								<img src={emailIcon} alt="Email" className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" />
							</div>
							<span className="text-gray-400 text-sm font-medium group-hover:text-white transition-colors tracking-tight">support@ameritecps.com</span>
						</div>

						{/* Social Media Icons */}
						<div className="flex flex-wrap gap-3">
							{[
								{ icon: tiktokIcon, alt: "TikTok" },
								{ icon: telegramIcon, alt: "Telegram" },
								{ icon: twitterIcon, alt: "Twitter" },
								{ icon: mediumIcon, alt: "Medium" },
								{ icon: linkedinIcon, alt: "LinkedIn" },
								{ icon: facebookIcon, alt: "Facebook" },
								{ icon: discordIcon, alt: "Discord" },
								{ icon: youtubeIcon, alt: "YouTube" }
							].map((social, idx) => (
								<div key={idx} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#EC3535]/10 group transition-all duration-300 cursor-pointer border border-white/5 hover:border-[#EC3535]/30">
									<img src={social.icon} alt={social.alt} className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all filter brightness-0 invert" />
								</div>
							))}
						</div>
					</div>

					{/* Middle Section - Quick Links */}
					<div className="space-y-8 lg:pl-10">
						<h4 className="text-white text-sm font-black uppercase tracking-[0.2em]">Quick Links</h4>
						<div className="flex flex-col gap-4">
							<Link to="/packages" className="text-gray-400 text-sm font-medium hover:text-white transition-colors">Packages</Link>
							<Link to="/affiliate" className="text-gray-400 text-sm font-medium hover:text-white transition-colors">Affiliate</Link>
							<Link to="/blog" className="text-gray-400 text-sm font-medium hover:text-white transition-colors">Blog</Link>
						</div>
					</div>

					{/* Right Section - Support */}
					<div className="space-y-8">
						<h4 className="text-white text-sm font-black uppercase tracking-[0.2em]">Support</h4>
						<div className="flex flex-col gap-4">
							<Link to="/faq" className="text-gray-400 text-sm font-medium hover:text-white transition-colors">FAQ</Link>
							<Link to="/about" className="text-gray-400 text-sm font-medium hover:text-white transition-colors">About Us</Link>
						</div>
					</div>
				</div>

				{/* Bottom Section - Disclosures */}
				<div className="mt-20 pt-10 border-t border-white/5 space-y-4">
					<p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
						© QAMCHAIN. Built by Ameritec IPS (Texas, USA).
					</p>
					<p className="text-gray-600 text-[11px] leading-relaxed max-w-3xl">
						Disclosures: QAMCHAIN Validator Licenses are platform-issued participation rights. 
						Nothing on this website is investment, legal, or tax advice. Terms apply.
					</p>
				</div>
			</div>
		</footer>
	);
}
