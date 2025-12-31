import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/logo.png";

export default function AdminLayout() {
  const { admin, adminLogout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/users", label: "Users", icon: "👥" },
    { path: "/admin/packages", label: "Packages", icon: "📦" },
    { path: "/admin/transactions", label: "Transactions", icon: "💳" },
    { path: "/admin/withdrawals", label: "Withdrawals", icon: "💰" },
    { path: "/admin/logs", label: "Logs", icon: "📝" },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white fixed h-full">
        <div className="p-6 border-b border-gray-700">
          <img src={logo} alt="Q-Amchain" className="h-8 w-auto mb-2" />
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 hover:bg-gray-700 transition-colors ${
                isActive(item.path) ? "bg-gray-700 border-r-4 border-blue-500" : ""
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-700">
          <div className="mb-4">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold">{admin?.username || "Admin"}</p>
            {admin?.roleId && <p className="text-xs text-gray-500 mt-1">{admin.roleId.name}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find((item) => isActive(item.path))?.label || "Admin"}
            </h2>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">
                View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
