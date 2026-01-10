import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Import background images
import home1Bg from "@/assets/background/home-1.png";
import home2Bg from "@/assets/background/home-2.png";
import home3Bg from "@/assets/background/home-3.png";

// Import icons
import trustIcon from "@/assets/icons/trust.svg";
import safeIcon from "@/assets/icons/safe.png";
import speedIcon from "@/assets/icons/speed.png";

// Custom Card Component based on Figma design using TailwindCSS with pure flexbox
const CustomCard = ({ icon, title, description }) => {
  return (
    <div className="relative h-[252px] w-full bg-[#1A1B1D] rounded-2xl backdrop-blur-[10px] overflow-hidden">
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-bl from-[#3D3434] from-0% to-[#DE2B34] to-100%">
        <div className="h-full w-full bg-[#1A1B1D] rounded-2xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-7 h-full flex flex-col">
        {/* Icon */}
        <div className="flex justify-end">
          <img src={icon} alt={title} className="w-04 h-20 object-contain" />
        </div>
        
        {/* Spacer to push content to bottom */}
        <div className="flex-1"></div>
        
        {/* Text content positioned at bottom */}
        <div className="flex flex-col">
          <h3 className="text-white text-2xl font-bold leading-[1.25] tracking-[1.5%] font-['Space_Grotesk'] mb-5">
            {title}
          </h3>
          <p className="text-white text-base font-normal leading-[1.5625] w-[289px] font-['Space_Grotesk']">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0C0B0B]">
      <Header />

      {/* Section 1 - Hero Section with home-1 background */}
      <section 
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat sm:bg-contain lg:bg-cover flex items-center"
        style={{ backgroundImage: `url(${home1Bg})` }}
      >
        <div className="relative z-10 container mx-auto px-4">
          <div className="">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#EC3535] uppercase tracking-tight text-left leading-tight">
              <p className="text-8xl">
                Q-Amchain
              </p>
              <p>
                Validator Packages
              </p>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-[570px] text-white leading-relaxed text-left">
              Join our affiliate program and earn commissions by referring validator packages. Start
              earning today with our 2-tier commission system.
            </p>
            <div className="flex flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-[#EC3535] hover:bg-[#EC3535]/90 text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wide h-16 w-[196px]"
              >
                <Link to="/packages" className="flex items-center justify-center gap-2">
                  View Packages
                  <svg width="18" height="15" viewBox="0 0 18 15" fill="none">
                    <path d="M10.5 1.5L16.5 7.5L10.5 13.5M16.5 7.5H1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#EC3535] px-8 py-4 rounded-lg font-bold uppercase tracking-wide h-16 w-[196px] transition-all duration-300"
              >
                <Link to="/register" className="flex items-center justify-center gap-2">
                  Get Started
                  <svg width="18" height="15" viewBox="0 0 18 15" fill="none">
                    <path d="M10.5 1.5L16.5 7.5L10.5 13.5M16.5 7.5H1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Features Section with home-2 background */}
      <section 
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat sm:bg-contain lg:bg-cover flex items-center flex-col justify-start"
        style={{ backgroundImage: `url(${home2Bg})` }}
      >
         <h2 className="text-4xl md:text-5xl font-bold text-center mb-[95px] mt-[78px] text-white uppercase tracking-tight">
            Why Choose Q-Amchain?
          </h2>
          
        <div className="relative z-10 container flex mx-auto justify-between px-0 gap-[28px]">
          <CustomCard 
              icon={trustIcon}
              title="2-Tier Commission"
              description="Earn from direct referrals (F1) and indirect referrals (F2)"
            />

            <CustomCard 
              icon={safeIcon}
              title="Secure Payments"
              description="All payments processed via USDT on BNB Chain (BEP20)"
            />

            <CustomCard 
              icon={speedIcon}
              title="Real-time Tracking"
              description="Monitor your earnings and referral network in real-time"
            />
        </div>
      </section>

      {/* Section 3 - CTA Section with home-3 background */}
      <section 
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat sm:bg-contain lg:bg-cover flex items-center justify-center"
        style={{ backgroundImage: `url(${home3Bg})` }}
      >
        <div className="flex-1"></div>
        <div className="flex-1 relative z-10 flex flex-col items-center justify-center text-center w-ful mx-auto px-4">
          <h2 className="text-4xl md:text-[64px] font-bold leading-[1.125] tracking-[0.56%] text-white mb-4">
            <p className="text-center md:text-[64px] text-[#ffffff]">Ready to</p>
            <p className="text-center md:text-[64px] text-[#DE2B34]">Start Earning?</p>
          </h2>
          <p className="text-base font-normal leading-[1.5625] text-center text-white mb-[35px] max-w-[255px]">
            Join thousands of users already earning with Q-Amchain
          </p>
          <Button 
            asChild 
            className="bg-[#EC3535] hover:bg-[#EC3535]/90 text-white font-bold text-base leading-[1.5625] px-8 py-4 rounded-lg h-14 flex items-center justify-center gap-2.5 transition-all duration-300"
          >
            <Link to="/register" className="flex items-center justify-center gap-2.5">
              Create Free Account
              <svg width="18" height="15" viewBox="0 0 18 15" fill="none">
                <path d="M10.5 1.5L16.5 7.5L10.5 13.5M16.5 7.5H1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}