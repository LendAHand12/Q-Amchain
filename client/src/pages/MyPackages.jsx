import { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PaymentModal from "../components/PaymentModal";
import { formatDate } from "../utils/dateFormat";
import { formatAddress } from "../utils/formatAddress";

export default function MyPackages() {
  const [myPackage, setMyPackage] = useState(null); // User chỉ có 1 package
  const [availablePackages, setAvailablePackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState("");

  useEffect(() => {
    fetchMyPackage();
    fetchAvailablePackages();
    fetchPaymentAddress();
  }, []);

  const fetchMyPackage = async () => {
    try {
      const response = await api.get("/users/packages");
      const packages = response.data.data;
      // User chỉ có thể mua 1 package, lấy package đầu tiên
      if (packages && packages.length > 0) {
        setMyPackage(packages[0]);
      }
    } catch (error) {
      toast.error("Failed to load package");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePackages = async () => {
    try {
      const response = await api.get("/packages");
      setAvailablePackages(response.data.data);
    } catch (error) {
      console.error("Failed to load available packages");
    }
  };

  const fetchPaymentAddress = async () => {
    try {
      const response = await api.get("/payments/address");
      setPaymentAddress(response.data.data.address);
    } catch (error) {
      console.error("Failed to load payment address");
    }
  };

  const handlePurchase = (pkg) => {
    // Check if user has already purchased a package
    if (myPackage) {
      toast.error("You have already purchased a package. Each user can only purchase one package.");
      return;
    }
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    fetchMyPackage(); // Refresh để lấy package mới
    setSelectedPackage(null);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If user has purchased a package, only display that package
  if (myPackage) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Package</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Your purchased package</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{myPackage.package?.name || "Package"}</CardTitle>
                <CardDescription className="font-mono text-sm mt-1">
                  Transaction:{" "}
                  {myPackage.transactionHash ? formatAddress(myPackage.transactionHash) : "N/A"}
                </CardDescription>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">
                  {myPackage.amount} {myPackage.currency}
                </span>
              </div>
              {myPackage.package?.description && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Description:</p>
                  <p className="text-sm">{myPackage.package.description}</p>
                </div>
              )}
              {myPackage.transactionHash && (
                <div className="flex justify-between mt-4">
                  <span className="text-muted-foreground">Transaction:</span>
                  <a
                    href={`https://bscscan.com/tx/${myPackage.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-primary hover:underline"
                    title={myPackage.transactionHash}
                  >
                    {formatAddress(myPackage.transactionHash)}
                  </a>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purchase Date:</span>
                <span className="text-sm">{formatDate(myPackage.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user hasn't purchased a package, display list of packages to choose from
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Packages</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Choose a package to purchase (one package per user)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availablePackages.map((pkg) => (
          <Card key={pkg._id}>
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary mb-4">{pkg.price} USDT</div>
              {pkg.description && (
                <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
              )}
              {pkg.features && pkg.features.length > 0 && (
                <ul className="text-sm space-y-1 mb-4">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              <Button onClick={() => handlePurchase(pkg)} className="w-full">
                Purchase Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <PaymentModal
        package={selectedPackage}
        paymentAddress={paymentAddress}
        open={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedPackage(null);
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
