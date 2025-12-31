import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

export default function Layout() {
  const { isAuthenticated, isAdminAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Q-Amchain" className="h-8 sm:h-10 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/packages" className="text-gray-700 hover:text-blue-600 transition-colors">
                Packages
              </Link>
              <Link to="/affiliate" className="text-gray-700 hover:text-blue-600 transition-colors">
                Affiliate
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">
                Blog
              </Link>
              <Link to="/faq" className="text-gray-700 hover:text-blue-600 transition-colors">
                FAQ
              </Link>
              {!isAuthenticated && !isAdminAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </Link>
                </>
              ) : isAdminAuthenticated ? (
                <Link
                  to="/admin"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col gap-4 pt-4">
                <Link
                  to="/packages"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Packages
                </Link>
                <Link
                  to="/affiliate"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Affiliate
                </Link>
                <Link
                  to="/blog"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  to="/faq"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
                <div className="pt-2 border-t border-gray-200">
                  {!isAuthenticated && !isAdminAuthenticated ? (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors mb-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  ) : isAdminAuthenticated ? (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src={logo} alt="Q-Amchain" className="h-8 w-auto mb-4" />
              <p className="text-gray-400">Validator packages and affiliate platform</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/packages" className="hover:text-white">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link to="/affiliate" className="hover:text-white">
                    Affiliate
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">support@q-amchain.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2024 Q-Amchain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
