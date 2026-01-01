import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when search changes
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [search, currentPage]);

  const fetchUsers = async () => {
    try {
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage all registered users</p>
        </div>
        <Input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
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
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
