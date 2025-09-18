import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First verify admin credentials using our function
      const { data: isValidAdmin, error: verifyError } = await supabase
        .rpc('verify_admin_login', {
          admin_email: form.email,
          admin_password: form.password
        });

      if (verifyError || !isValidAdmin) {
        toast({
          title: "Login Failed",
          description: "Invalid administrator credentials",
          variant: "destructive",
        });
        return;
      }

      // For hardcoded admin accounts, use localStorage session
      if ((form.email === 'admin@plasu.edu.ng' && form.password === '123456') ||
          (form.email === 'silasplayx64@gmail.com' && form.password === '123456')) {
        
        // Store admin info in localStorage for session management
        localStorage.setItem('adminSession', JSON.stringify({
          email: form.email,
          username: form.username || 'admin',
          isDefaultAdmin: true,
          loginTime: Date.now()
        }));

        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard",
        });

        navigate("/admin/dashboard");
        return;
      }

      // For other admin accounts, try Supabase auth
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        // If Supabase auth fails, but admin is verified, use localStorage
        localStorage.setItem('adminSession', JSON.stringify({
          email: form.email,
          username: form.username || 'admin',
          isDefaultAdmin: true,
          loginTime: Date.now()
        }));

        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard",
        });

        navigate("/admin/dashboard");
        return;
      }

      // Check if user is admin by verifying admin record exists
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', form.email)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "You are not authorized to access the admin panel",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      });

      navigate("/admin/dashboard");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
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
          <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground">Administrative Access</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Sign In
            </CardTitle>
            <CardDescription>
              Enter your administrator credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@plasu.edu.ng"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-slate-700 to-blue-600 hover:from-slate-800 hover:to-blue-700" 
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In as Admin"}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This portal is restricted to authorized personnel only. 
                Unauthorized access is prohibited.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;