import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuthStore } from "../store/authStore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Packages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await api.get('/packages')
      setPackages(response.data.data)
    } catch (error) {
      console.error('Failed to load packages')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading packages...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Validator Packages</h1>
        <p className="text-muted-foreground text-lg">
          Choose the perfect package for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <Card key={pkg._id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{pkg.name}</CardTitle>
              <div className="text-4xl font-bold text-primary mt-4">
                {pkg.price} {pkg.currency}
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              {pkg.description && (
                <CardDescription className="text-base">{pkg.description}</CardDescription>
              )}

              {/* <div className="space-y-2">
                <p className="text-sm font-medium">Commission Rates:</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">F1: {pkg.commissionLv1}%</Badge>
                  <Badge variant="secondary">F2: {pkg.commissionLv2}%</Badge>
                </div>
              </div> */}

              {pkg.features && pkg.features.length > 0 && (
                <ul className="space-y-2">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter>
              {isAuthenticated ? (
                <Button asChild className="w-full">
                  <Link to="/dashboard">Purchase Now</Link>
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link to="/register">Sign Up to Purchase</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

