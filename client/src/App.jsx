import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Packages from "./pages/Packages";
import Affiliate from "./pages/Affiliate";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import AdminLogin from "./pages/admin/Login";

// Protected pages
import Dashboard from "./pages/Dashboard";
import MyPackages from "./pages/MyPackages";
import Commissions from "./pages/Commissions";
import ReferralTree from "./pages/ReferralTree";
import Withdraw from "./pages/Withdraw";
import Profile from "./pages/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminUserDetails from "./pages/admin/UserDetails";
import AdminPackages from "./pages/admin/Packages";
import AdminTransactions from "./pages/admin/Transactions";
import AdminWithdrawals from "./pages/admin/Withdrawals";
import AdminLogs from "./pages/admin/Logs";

// Layouts
import Layout from "./components/Layout";
import UserLayout from "./components/UserLayout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="packages" element={<Packages />} />
          <Route path="affiliate" element={<Affiliate />} />
          <Route path="blog" element={<Blog />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-email" element={<VerifyEmail />} />
        </Route>

        {/* Protected user routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="packages" element={<MyPackages />} />
          <Route path="commissions" element={<Commissions />} />
          <Route path="referral-tree" element={<ReferralTree />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetails />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="withdrawals" element={<AdminWithdrawals />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
