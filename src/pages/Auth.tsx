import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(searchParams.get("mode") || "login");

  // Login form state
  const [loginForm, setLoginForm] = useState({
    matricNumber: "",
    pin: ""
  });

  // Password reset state
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);


  useEffect(() => {
    const newMode = searchParams.get("mode") || "login";
    setMode(newMode);
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, find the student with the matric number
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('email, id, password_changed')
        .eq('matric_number', loginForm.matricNumber)
        .single();

      if (studentError || !studentData) {
        toast({
          title: "Login Failed",
          description: "Invalid matric number. Please check and try again.",
          variant: "destructive",
        });
        return;
      }

      // For default PIN, accept "223344". For changed passwords, use the PIN they entered
      const password = studentData.password_changed ? loginForm.pin : 
                      (loginForm.pin === "223344" ? "223344" : loginForm.pin);

      const { error } = await supabase.auth.signInWithPassword({
        email: studentData.email,
        password: password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message.includes("Invalid login") 
            ? "Invalid PIN. Please check your credentials."
            : error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?mode=login`,
      });

      if (error) {
        toast({
          title: "Reset Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions",
      });

      setShowReset(false);
      setResetEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">PLASU ICT Portal</h1>
          <p className="text-muted-foreground">Student Authentication</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle>
              {showReset ? "Reset Password" : "Sign In"}
            </CardTitle>
            <CardDescription>
              {showReset 
                ? "Enter your email to reset your password" 
                : "Use your matric number and PIN to access your results. Students must contact the admin to create an account."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showReset ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="matricNumber">Matric Number</Label>
                  <Input
                    id="matricNumber"
                    type="text"
                    placeholder="e.g., ND/CS/2024/001"
                    value={loginForm.matricNumber}
                    onChange={(e) => setLoginForm({ ...loginForm, matricNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pin">PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Enter your PIN (default: 223344)"
                    value={loginForm.pin}
                    onChange={(e) => setLoginForm({ ...loginForm, pin: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowReset(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot your PIN? Reset password
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email Address</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="Enter your registered email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending Reset Email..." : "Send Reset Email"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowReset(false)}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Back to login
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;