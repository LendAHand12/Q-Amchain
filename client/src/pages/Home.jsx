import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Q-Amchain Validator Packages</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our affiliate program and earn commissions by referring validator packages. Start
            earning today with our 2-tier commission system.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link to="/packages">View Packages</Link>
            </Button>
            <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Q-Amchain?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="text-4xl mb-4">💰</div>
                <CardTitle>2-Tier Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Earn from direct referrals (F1) and indirect referrals (F2)
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="text-4xl mb-4">🔒</div>
                <CardTitle>Secure Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  All payments processed via USDT on BNB Chain (BEP20)
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="text-4xl mb-4">📊</div>
                <CardTitle>Real-time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Monitor your earnings and referral network in real-time
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of users already earning with Q-Amchain
          </p>
          <Button asChild size="lg">
            <Link to="/register">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
