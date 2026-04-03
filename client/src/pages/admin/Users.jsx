import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import Loading from '../../components/Loading';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Pagination from "../../components/Pagination";
import { formatAddress } from "../../utils/formatAddress";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL-driven state (source of truth)
  const search = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // Local states for UI and transient input
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(search);
  const [pagination, setPagination] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Debounce search input to avoid history spam
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== search) {
        const params = new URLSearchParams(searchParams);
        if (searchTerm) params.set("search", searchTerm);
        else params.delete("search");
        params.set("page", "1"); // Reset specifically for search changes
        setSearchParams(params);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, search, searchParams, setSearchParams]);

  // Sync searchTerm when URL changes externally (e.g., via back button)
  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  // Fetch data only search or page in URL changes
  useEffect(() => {
    fetchUsers();
  }, [search, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/users?search=${search}&page=${currentPage}&limit=20`);
      setUsers(response.data.data.users || []);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };


  const handleViewDetails = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      let url = "/admin/export/users";
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response = await api.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `Users_Export_${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Đã xuất dữ liệu người dùng thành công");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Lỗi khi xuất dữ liệu người dùng");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Fetching users..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage all registered users</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 h-9"
            />
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 h-9"
                >
                  <Download className="w-4 h-4" />
                  Xuất Excel
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Xuất dữ liệu người dùng</DialogTitle>
                  <DialogDescription>
                    Chọn khoảng thời gian bạn muốn xuất dữ liệu ra file Excel.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="startDate" className="text-sm font-medium">Từ ngày</label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="endDate" className="text-sm font-medium">Đến ngày</label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="default" 
                    onClick={handleExportExcel}
                    disabled={isExporting}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isExporting ? (
                      <>Đang xuất...</>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Tải về file Excel
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username (RefCode)</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Wallet Address</TableHead>
                <TableHead>Purchased Package</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="7" className="text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      {user.username} <span className="text-muted-foreground font-mono text-sm">({user.refCode})</span>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {formatAddress(user.walletAddress)}
                    </TableCell>
                    <TableCell>
                      {user.purchasedPackageName ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{user.purchasedPackageName}</Badge>
                          {user.isPackageAssigned && (
                            <Badge variant="secondary" className="text-xs">
                              Assigned
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No package</span>
                      )}
                    </TableCell>
                    <TableCell>{user.walletBalance?.toFixed(2) || "0.00"} USDT</TableCell>
                    <TableCell>
                      {user.isDeleted ? (
                        <Badge 
                          variant="destructive" 
                          className="w-fit px-3 py-1.5 font-semibold bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm"
                        >
                          Deleted
                        </Badge>
                      ) : user.isEmailVerified ? (
                        <Badge 
                          variant="default" 
                          className="w-fit px-3 py-1.5 font-semibold bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge 
                          variant="outline" 
                          className="w-fit px-3 py-1.5 font-semibold bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                        >
                          Not Verified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!user.isDeleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(user._id)}
                        >
                          View Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) => {
                const params = new URLSearchParams(searchParams);
                params.set("page", page);
                setSearchParams(params);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
