import { Outlet, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Layout() {
  const { isAuthenticated, isAdminAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Q-Amchain
            </Link>

            <div className="flex items-center gap-6">
              <Link to="/packages" className="text-gray-700 hover:text-blue-600">
                Packages
              </Link>
              <Link to="/affiliate" className="text-gray-700 hover:text-blue-600">
                Affiliate
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-blue-600">
                Blog
              </Link>
              <Link to="/faq" className="text-gray-700 hover:text-blue-600">
                FAQ
              </Link>
              {!isAuthenticated && !isAdminAuthenticated ? (
                <>
                  <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              ) : isAdminAuthenticated ? (
                <Link to="/admin" className="px-4 py-2 text-gray-700 hover:text-blue-600">
                  Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className="px-4 py-2 text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
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
              <h3 className="text-lg font-bold mb-4">Q-Amchain</h3>
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
