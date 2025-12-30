import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function UserLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/dashboard/packages", label: "My Packages", icon: "📦" },
    { path: "/dashboard/commissions", label: "Commissions", icon: "💰" },
    { path: "/dashboard/referral-tree", label: "Referral Tree", icon: "🌳" },
    { path: "/dashboard/withdraw", label: "Withdraw", icon: "💸" },
    { path: "/dashboard/profile", label: "Profile", icon: "👤" },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-700">
            <Link
              to="/"
              className="text-xl font-bold hover:text-blue-400 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              Q-Amchain
            </Link>
            <p className="text-sm text-gray-400 mt-1">User Dashboard</p>
          </div>

          <nav className="mt-6 flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-6 py-3 hover:bg-gray-700 transition-colors ${
                  isActive(item.path) ? "bg-gray-700 border-r-4 border-primary" : ""
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-700">
            <div className="mb-4">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="font-semibold">{user?.username || "User"}</p>
              {user?.refCode && (
                <p className="text-xs text-gray-500 mt-1">Ref: {user.refCode}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 min-w-0">
        {/* Top Header */}
        <header className="bg-card shadow-sm sticky top-0 z-30 border-b">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                {menuItems.find((item) => isActive(item.path))?.label || "Dashboard"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

