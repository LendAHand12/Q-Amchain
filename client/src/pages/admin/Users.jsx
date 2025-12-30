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

  const handleLock = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/lock`);
      toast.success("User locked");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to lock user");
    }
  };

  const handleUnlock = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/unlock`);
      toast.success("User unlocked");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to unlock user");
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
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ref Code</TableHead>
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
                  <TableCell colSpan="8" className="text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="font-mono text-sm">{user.refCode}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {formatAddress(user.walletAddress)}
                    </TableCell>
                    <TableCell>
                      {user.purchasedPackageName ? (
                        <Badge variant="outline">{user.purchasedPackageName}</Badge>
                      ) : (
                        <span className="text-muted-foreground">No package</span>
                      )}
                    </TableCell>
                    <TableCell>{user.walletBalance?.toFixed(2) || "0.00"} USDT</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "destructive"}>
                        {user.isActive ? "Active" : "Locked"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(user._id)}
                        >
                          View Details
                        </Button>
                        {user.isActive ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleLock(user._id)}
                          >
                            Lock
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUnlock(user._id)}
                          >
                            Unlock
                          </Button>
                        )}
                      </div>
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
