import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthWrapper";
import { 
  Shield, 
  LogOut, 
  Users, 
  FileText, 
  CreditCard, 
  UserPlus,
  Upload,
  Settings,
  Bell,
  FileSpreadsheet
} from "lucide-react";

interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  staff_id: string;
  department: string;
}

interface Student {
  id: string;
  matric_number: string;
  first_name: string;
  last_name: string;
  email: string;
  level: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  
  // New student form
  const [newStudentForm, setNewStudentForm] = useState({
    email: "",
    matricNumber: "",
    firstName: "",
    lastName: "",
    level: "ND1",
    phone: ""
  });

  useEffect(() => {
    console.log('AdminDashboard mounted, authLoading:', authLoading, 'user:', user);
    if (!authLoading) {
      checkAdminAccess();
    }
  }, [authLoading, user]);

  const checkAdminAccess = async () => {
    // Check for default admin session first
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const sessionData = JSON.parse(adminSession);
        // Check for both default admin accounts
        if (sessionData.isDefaultAdmin && (
          sessionData.email === 'admin@plasu.edu.ng' || 
          sessionData.email === 'silasplayx64@gmail.com'
        )) {
          // Use appropriate admin data based on email
          if (sessionData.email === 'silasplayx64@gmail.com') {
            setAdmin({
              id: 'custom-admin',
              first_name: 'Silas',
              last_name: 'Administrator',
              email: 'silasplayx64@gmail.com',
              staff_id: 'ADMIN002',
              department: 'Computer Science'
            });
          } else {
            setAdmin({
              id: 'default-admin',
              first_name: 'System',
              last_name: 'Administrator',
              email: 'admin@plasu.edu.ng',
              staff_id: 'ADMIN001',
              department: 'Computer Science'
            });
          }
          await loadStudents();
          setLoading(false);
          return;
        }
      } catch (error) {
        localStorage.removeItem('adminSession');
      }
    }

    // For regular Supabase authenticated admins
    if (!user || !session) {
      navigate("/admin/login");
      return;
    }

    try {
      // Check if user is admin
      const { data: adminData, error } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error || !adminData) {
        toast({
          title: "Access Denied",
          description: "You are not authorized to access this area",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }

      setAdmin(adminData);
      await loadStudents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify admin access",
        variant: "destructive",
      });
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('id, matric_number, first_name, last_name, email, level, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    } else {
      setStudents(data || []);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      // Create auth user with default password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newStudentForm.email,
        password: "223344", // Default password as specified
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            matric_number: newStudentForm.matricNumber,
            first_name: newStudentForm.firstName,
            last_name: newStudentForm.lastName,
            phone: newStudentForm.phone,
            level: newStudentForm.level,
          }
        }
      });

      if (authError) {
        toast({
          title: "Error Creating Student",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Student Created",
        description: `Student ${newStudentForm.firstName} ${newStudentForm.lastName} has been created successfully`,
      });

      // Reset form
      setNewStudentForm({
        email: "",
        matricNumber: "",
        firstName: "",
        lastName: "",
        level: "ND1",
        phone: ""
      });

      // Reload students
      await loadStudents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create student account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // Clear admin session
    localStorage.removeItem('adminSession');
    
    // Also sign out from Supabase if user is signed in
    await supabase.auth.signOut();
    
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You do not have admin privileges
            </p>
            <Button onClick={() => navigate("/admin/login")} variant="outline">
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome, {admin.first_name}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-200">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="create-student">Quick Create</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="fees">Fee Management</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                  <p className="text-xs text-muted-foreground">Registered students</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ND1 Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {students.filter(s => s.level === 'ND1').length}
                  </div>
                  <p className="text-xs text-muted-foreground">First year students</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ND2 Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {students.filter(s => s.level === 'ND2').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Second year students</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Department</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{admin.department}</div>
                  <p className="text-xs text-muted-foreground">Your department</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">Student Management</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        View, create, edit, and manage all student accounts in one place
                      </p>
                      <Button 
                        onClick={() => navigate("/admin/students")}
                        className="w-full"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Manage Students
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <FileSpreadsheet className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">Bulk Operations</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload results and manage bulk operations
                      </p>
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/admin/bulk-upload")}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Bulk Upload
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Students List */}
              <Card>
                <CardHeader>
                  <CardTitle>Students List</CardTitle>
                  <CardDescription>All registered students in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{student.first_name} {student.last_name}</h4>
                          <p className="text-sm text-muted-foreground">{student.matric_number}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{student.level}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(student.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {students.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No students found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="create-student">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Quick Create Student Account
                </CardTitle>
                <CardDescription>
                  Create a new student account with default PIN (223344)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateStudent} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newStudentForm.firstName}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newStudentForm.lastName}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStudentForm.email}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="matricNumber">Matric Number</Label>
                    <Input
                      id="matricNumber"
                      value={newStudentForm.matricNumber}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, matricNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select
                      value={newStudentForm.level}
                      onValueChange={(value) => setNewStudentForm({ ...newStudentForm, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ND1">ND1</SelectItem>
                        <SelectItem value="ND2">ND2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newStudentForm.phone}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "Creating Student..." : "Create Student Account"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Result Management
                  </CardTitle>
                  <CardDescription>Upload and manage student results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-primary mx-auto mb-3" />
                          <h3 className="font-semibold mb-2">Individual Upload</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload results for individual students one by one
                          </p>
                          <Button onClick={() => navigate("/admin/upload")} className="w-full">
                            Upload Results
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <FileSpreadsheet className="w-8 h-8 text-secondary mx-auto mb-3" />
                          <h3 className="font-semibold mb-2">Bulk Upload</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Import multiple results from CSV/Excel files
                          </p>
                          <Button onClick={() => navigate("/admin/bulk-upload")} className="w-full" variant="secondary">
                            Bulk Upload
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Fee Management
                </CardTitle>
                <CardDescription>Verify and manage student fee payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Fee Verification</h3>
                  <p className="text-muted-foreground mb-4">
                    This section will allow you to verify and manage student fee payments
                  </p>
                  <Button disabled>Coming Soon</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Announcements
                </CardTitle>
                <CardDescription>Send announcements to students by level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Student Announcements</h3>
                  <p className="text-muted-foreground mb-4">
                    This section will allow you to send announcements to students
                  </p>
                  <Button disabled>Coming Soon</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;