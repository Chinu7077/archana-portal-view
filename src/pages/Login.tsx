import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Truck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [partnerId, setPartnerId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (partnerId === "admin" && password === "admin123") {
      toast({
        title: "Admin Login Successful",
        description: "Redirecting to admin panel...",
      });
      navigate("/admin");
    } else if (partnerId && password) {
      // Store partner info in localStorage (in real app, use proper auth)
      localStorage.setItem("partnerInfo", JSON.stringify({
        id: partnerId,
        name: `Partner ${partnerId.toUpperCase()}`,
        isLoggedIn: true
      }));
      toast({
        title: "Login Successful",
        description: `Welcome back, Partner ${partnerId.toUpperCase()}!`,
      });
      navigate("/dashboard");
    } else {
      setError("Invalid Partner ID or Password");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4 shadow-glow">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Archana Transport</h1>
          <p className="text-muted-foreground mt-2">Partner Login Portal</p>
        </motion.div>

        {/* Login Card */}
        <Card className="shadow-card border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="partnerId">Partner ID</Label>
                <Input
                  id="partnerId"
                  type="text"
                  placeholder="Enter your Partner ID"
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-primary hover:shadow-hover transition-all duration-300 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Demo Credentials:</p>
              <p className="font-mono">Partner ID: demo | Password: demo123</p>
              <p className="font-mono">Admin: admin | Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;