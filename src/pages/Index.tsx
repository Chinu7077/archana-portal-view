import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Users, FileSpreadsheet, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect if user is already logged in
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mixed opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-8 shadow-glow">
              <Truck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6">
              Archana Transport
              <span className="block text-primary mt-2">Partner Portal</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Streamlined logistics management for industrial transport partners. 
              Access your dispatch data, fuel consumption, and generate reports with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
              >
                Partner Login
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-white"
              >
                Admin Access
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Complete Transportation Management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to track, manage, and optimize your transportation operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-card border-0 h-full">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>Dispatch Tracking</CardTitle>
                  <CardDescription>
                    Monitor vehicle dispatch times, quantities, and locations in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Real-time vehicle tracking</li>
                    <li>• Load quantity monitoring</li>
                    <li>• Route optimization</li>
                    <li>• Performance analytics</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-card border-0 h-full">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>Fuel Management</CardTitle>
                  <CardDescription>
                    Track diesel consumption and optimize fuel efficiency across your fleet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Fuel consumption tracking</li>
                    <li>• Cost optimization</li>
                    <li>• Efficiency reports</li>
                    <li>• Budget management</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="shadow-card border-0 h-full">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-mixed rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>Partner Dashboard</CardTitle>
                  <CardDescription>
                    Comprehensive partner portal with detailed analytics and reporting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Interactive dashboards</li>
                    <li>• Excel report generation</li>
                    <li>• Date range filtering</li>
                    <li>• Mobile-friendly design</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join Archana Transport's digital ecosystem and streamline your operations today.
            </p>
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-12 py-6 animate-glow-pulse"
            >
              Access Your Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Truck className="w-6 h-6" />
            <span className="text-lg font-semibold">Archana Transport</span>
          </div>
          <p className="text-sm opacity-75">
            © 2024 Archana Transport. All rights reserved. | Powering industrial logistics with excellence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
