import { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "../utils/dateFormat";
import Pagination from "../components/Pagination";

export default function Commissions() {
  const [commissions, setCommissions] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    fetchCommissions()
    fetchStats()
  }, [currentPage])

  const fetchCommissions = async () => {
    try {
      const response = await api.get(`/users/commissions?page=${currentPage}&limit=20`)
      setCommissions(response.data.data.commissions || [])
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error('Failed to load commissions')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/commissions/stats')
      setStats(response.data.data)
    } catch (error) {
      console.error('Failed to load stats')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Commission History</h1>
        <p className="text-sm sm:text-base text-muted-foreground">View all your commission earnings</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Level 1 (F1) Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.level1.total.toFixed(2)} USDT
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {stats.level1.count} commissions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Level 2 (F2) Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.level2.total.toFixed(2)} USDT
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {stats.level2.count} commissions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats.total.toFixed(2)} USDT
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Commission Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center text-muted-foreground">
                    No commissions yet
                  </TableCell>
                </TableRow>
              ) : (
                commissions.map((commission) => (
                  <TableRow key={commission._id || commission.id}>
                    <TableCell>
                      {formatDate(commission.createdAt)}
                    </TableCell>
                    <TableCell>{commission.buyerId?.username || "N/A"}</TableCell>
                    <TableCell>{commission.packageId?.name || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={commission.level === 1 ? "default" : "secondary"}
                      >
                        F{commission.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {commission.amount.toFixed(2)} USDT
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                        {commission.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
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

