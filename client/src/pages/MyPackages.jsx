import { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PaymentModal from "../components/PaymentModal";
import { formatDate } from "../utils/dateFormat";
import { formatAddress } from "../utils/formatAddress";
import Loading from "../components/Loading";

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
      
      // Fetch user data to get certificates using existing /users/me endpoint
      const userResponse = await api.get("/users/me");
      const user = userResponse.data.data;
      if (user.certificateFrontUrl || user.certificateBackUrl) {
        setMyPackage(prev => ({
          ...prev,
          certificateFrontUrl: user.certificateFrontUrl,
          certificateBackUrl: user.certificateBackUrl
        }));
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
    return <Loading fullScreen />;
  }

  // If user has purchased a package, only display that package
  if (myPackage) {
    // If certificates exist, show them
    if (myPackage.certificateFrontUrl || myPackage.certificateBackUrl) {
      return (
        <div className="space-y-4 sm:space-y-6">
          <Card className="max-w-4xl mx-auto bg-[#252525] border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-white">Certificates</CardTitle>
              <CardDescription className="text-sm text-gray-400">
                {myPackage.package?.name || "Validator Package"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Front Side */}
                {myPackage.certificateFrontUrl && (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm font-medium text-gray-300">Front Side</p>
                    <img
                      src={`${import.meta.env.VITE_API_URL}${myPackage.certificateFrontUrl}`}
                      alt="Front Certificate"
                      className="w-full rounded-lg border border-gray-600 shadow-lg cursor-pointer hover:opacity-90 transition"
                      onClick={() => window.open(`${import.meta.env.VITE_API_URL}${myPackage.certificateFrontUrl}`, '_blank')}
                    />
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <a
                        href={`${import.meta.env.VITE_API_URL}${myPackage.certificateFrontUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full border-gray-600 text-black hover:bg-gray-700">
                          View
                        </Button>
                      </a>
                      <a
                        href={`${import.meta.env.VITE_API_URL}${myPackage.certificateFrontUrl}`}
                        download
                        className="flex-1"
                      >
                        <Button className="w-full bg-brand-red hover:bg-brand-red-hover">
                          Download
                        </Button>
                      </a>
                    </div>
                  </div>
                )}

                {/* Back Side */}
                {myPackage.certificateBackUrl && (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm font-medium text-gray-300">Back Side</p>
                    <img
                      src={`${import.meta.env.VITE_API_URL}${myPackage.certificateBackUrl}`}
                      alt="Back Certificate"
                      className="w-full rounded-lg border border-gray-600 shadow-lg cursor-pointer hover:opacity-90 transition"
                      onClick={() => window.open(`${import.meta.env.VITE_API_URL}${myPackage.certificateBackUrl}`, '_blank')}
                    />
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <a
                        href={`${import.meta.env.VITE_API_URL}${myPackage.certificateBackUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full border-gray-600 text-black hover:bg-gray-700">
                          View
                        </Button>
                      </a>
                      <a
                        href={`${import.meta.env.VITE_API_URL}${myPackage.certificateBackUrl}`}
                        download
                        className="flex-1"
                      >
                        <Button className="w-full bg-brand-red hover:bg-brand-red-hover">
                          Download
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
                <p>Certificates issued on {formatDate(myPackage.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // If no certificate, show package details
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card className="max-w-2xl mx-auto bg-[#252525] border-gray-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div>
                <CardTitle className="text-lg sm:text-xl text-white">{myPackage.package?.name || "Package"}</CardTitle>
                <CardDescription className="font-mono text-xs sm:text-sm mt-1 break-all text-gray-400">
                  Transaction:{" "}
                  {myPackage.transactionHash ? formatAddress(myPackage.transactionHash) : "N/A"}
                </CardDescription>
              </div>
              <Badge variant="default" className="self-start bg-accent-green text-white">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-400">Amount:</span>
                <span className="font-semibold text-sm sm:text-base text-white">
                  {myPackage.amount} {myPackage.currency}
                </span>
              </div>
              {myPackage.package?.description && (
                <div className="mt-4">
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">Description:</p>
                  <p className="text-sm text-gray-300">{myPackage.package.description}</p>
                </div>
              )}
              {myPackage.transactionHash && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-4">
                  <span className="text-sm sm:text-base text-gray-400">Transaction:</span>
                  <a
                    href={`https://bscscan.com/tx/${myPackage.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs sm:text-sm text-brand-red hover:underline break-all"
                    title={myPackage.transactionHash}
                  >
                    {formatAddress(myPackage.transactionHash)}
                  </a>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-400">Purchase Date:</span>
                <span className="text-xs sm:text-sm text-gray-300">{formatDate(myPackage.createdAt)}</span>
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
