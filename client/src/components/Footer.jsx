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
		<footer className="bg-[#0C0B0B] text-white py-12 sm:py-16">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-20">
					{/* Left Section - Logo and Contact */}
					<div className="flex flex-col gap-5 lg:flex-shrink-0 lg:max-w-md">
						{/* Logo */}
						<div className="flex items-center gap-3">
							<img src={logo} alt="Q-Amchain" className="h-8 w-auto" />
						</div>

						{/* Description */}
						<div className="max-w-full lg:max-w-[471px]">
							<p className="text-[#E9E9E9] text-sm leading-6 font-normal">Validator packages and affiliate platform</p>
						</div>

						{/* Contact Info */}
						<div className="flex items-center gap-1.5">
							<div className="w-5 h-5 flex-shrink-0">
								<img src={emailIcon} alt="Email" className="w-full h-full" />
							</div>
							<div className="px-1">
								<span className="text-[#E9E9E9] text-sm leading-6 font-normal">support@ameritecps.com</span>
							</div>
						</div>

						{/* Social Media Icons */}
						<div className="flex flex-wrap gap-2.5">
							{/* TikTok */}
							<div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#EC3535] transition-colors cursor-pointer">
								<img src={tiktokIcon} alt="TikTok" className="w-[13px] h-[15px]" />
							</div>

							{/* Telegram */}
							<div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#EC3535] transition-colors cursor-pointer">
								<img src={telegramIcon} alt="Telegram" className="w-[15px] h-[10px]" />
							</div>

							{/* Twitter */}
							<div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#EC3535] transition-colors cursor-pointer">
								<img src={twitterIcon} alt="Twitter" className="w-[20px] h-[20px]" />
							</div>

							{/* Medium */}
							<div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#EC3535] transition-colors cursor-pointer">
								<img src={mediumIcon} alt="Medium" className="w-[17px] h-[13px]" />
							</div>

							{/* LinkedIn */}
							<div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#EC3535] transition-colors cursor-pointer">
								<img src={linkedinIcon} alt="LinkedIn" className="w-[16px] h-[13px]" />
							</div>

							{/* Facebook */}
							<div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#EC3535] transition-colors cursor-pointer">
								<img src={facebookIcon} alt="Facebook" className="w-[16px] h-[13px]" />
							</div>

							{/* Discord */}
							<div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#EC3535] transition-colors cursor-pointer">
								<img src={discordIcon} alt="Discord" className="w-[16px] h-[13px]" />
							</div>

							{/* YouTube */}
							<div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#EC3535] transition-colors cursor-pointer">
								<img src={youtubeIcon} alt="YouTube" className="w-[16px] h-[13px]" />
							</div>
						</div>
					</div>

					{/* Right Section - Links */}
					<div className="flex flex-col sm:flex-row gap-8 sm:gap-12 lg:gap-16 flex-1">
						{/* Quick Links */}
						<div className="flex flex-col gap-5 flex-1">
							<h4 className="text-white text-base font-normal uppercase leading-6">Quick Links</h4>
							<div className="flex flex-col gap-0">
								<Link to="/packages" className="text-white text-sm font-normal leading-8 hover:text-[#EC3535] transition-colors">
									Packages
								</Link>
								<Link to="/affiliate" className="text-white text-sm font-normal leading-8 hover:text-[#EC3535] transition-colors">
									Affiliate
								</Link>
								<Link to="/blog" className="text-white text-sm font-normal leading-8 hover:text-[#EC3535] transition-colors">
									Blog
								</Link>
							</div>
						</div>

						{/* Support */}
						<div className="flex flex-col gap-5 flex-1">
							<h4 className="text-white text-base font-normal uppercase leading-6">Support</h4>
							<div className="flex flex-col gap-0">
								<Link to="/faq" className="text-white text-sm font-normal leading-8 hover:text-[#EC3535] transition-colors">
									FAQ
								</Link>
								<Link to="/about" className="text-white text-sm font-normal leading-8 hover:text-[#EC3535] transition-colors">
									About Us
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* Divider Line */}
				<div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
					<div className="text-center">
						<p className="text-[#E9E9E9] text-sm">© 2024 Q-Amchain. All rights reserved.</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
