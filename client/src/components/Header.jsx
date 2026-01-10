import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-[#0C0B0B] py-5">
      <div className="container mx-auto flex items-center justify-between px-0">
        {/* Logo */}
        <div className="flex-shrink-0 py-3">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Q-Amchain" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 h-12">
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              to="/packages" 
              className={`px-1 py-1 text-base font-normal uppercase tracking-wide transition-colors ${
                isActive('/packages') 
                  ? 'text-[#EC3535]' 
                  : 'text-white hover:text-[#EC3535]'
              }`}
            >
              Packages
            </Link>
            
            <Link 
              to="/affiliate" 
              className={`px-1 py-1 text-base font-normal uppercase tracking-wide transition-colors ${
                isActive('/affiliate') 
                  ? 'text-[#EC3535]' 
                  : 'text-white hover:text-[#EC3535]'
              }`}
            >
              Affiliate
            </Link>
            
            <Link 
              to="/blog" 
              className={`px-1 py-1 text-base font-normal uppercase tracking-wide transition-colors ${
                isActive('/blog') 
                  ? 'text-[#EC3535]' 
                  : 'text-white hover:text-[#EC3535]'
              }`}
            >
              Blog
            </Link>
            
            <Link 
              to="/faq" 
              className={`px-1 py-1 text-base font-normal uppercase tracking-wide transition-colors ${
                isActive('/faq') 
                  ? 'text-[#EC3535]' 
                  : 'text-white hover:text-[#EC3535]'
              }`}
            >
              FAQ
            </Link>
          </div>

          {/* Globe Icon */}
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="white" strokeWidth="1.5" fill="none"/>
              <circle cx="9" cy="9" r="4" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M1 9h16M9 1v16" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>

          {/* Register Button */}
          <Button 
            asChild
            className="bg-gradient-to-r from-[#BF1727] to-[#E8494F] hover:from-[#BF1727]/90 hover:to-[#E8494F]/90 text-white px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-200"
          >
            <Link to="/register">Register</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}