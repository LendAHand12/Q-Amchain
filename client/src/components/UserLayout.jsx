import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Package, Network, DollarSign, User, Settings, ChevronRight, ChevronDown, LogOut } from "lucide-react";
import logo from "../assets/logo.png";
import sidebarBg from "../assets/sidebar-background.png";

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
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/dashboard/packages", label: "My Packages", icon: Package },
    { path: "/dashboard/referral-tree", label: "Network", icon: Network },
    { path: "/dashboard/commissions", label: "Income", icon: DollarSign },
    { path: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar-bg text-sidebar-text transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundImage: `url(${sidebarBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flex flex-col h-full relative z-10">
          {/* Logo */}
          <div className="p-6">
            <Link
              to="/"
              className="block"
              onClick={() => setSidebarOpen(false)}
            >
              <img src={logo} alt="QAmChain" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {/* Dashboard Navigation Items */}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
                    active
                      ? "bg-sidebar-active text-brand-red"
                      : "text-sidebar-text hover:bg-sidebar-hover hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${active ? "text-brand-red" : ""}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {active ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              );
            })}

            {/* Logout Button (Mobile & Desktop Sidebar) */}
            <div className="pt-4 mt-4 border-t border-gray-700 lg:hidden">
              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sidebar-text hover:bg-sidebar-hover hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </nav>

          {/* User Profile */}
          {/* <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-hover transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-red to-orange-500 flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user?.username || "User"}</p>
                <p className="text-xs text-gray-400 truncate">Account settings</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div> */}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 min-w-0 bg-[#1E1E1E]">
        {/* Top Header */}
        <header className="bg-[#252525] shadow-sm sticky top-0 z-30 border-b border-gray-700">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-gray-700"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div>
                {location.pathname === "/dashboard" ? (
                  <>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Welcome back, {user?.username || "User"}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      Manage your earnings and invested website traffic.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {menuItems.find((item) => isActive(item.path))?.label || "Dashboard"}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      View and manage your {menuItems.find((item) => isActive(item.path))?.label.toLowerCase()}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 bg-[#1E1E1E]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

