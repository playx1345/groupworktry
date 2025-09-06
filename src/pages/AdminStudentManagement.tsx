import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ValidatedInput } from "@/components/ui/validated-input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  validateUserCreationData, 
  checkEmailUniqueness, 
  checkMatricNumberUniqueness,
  logAuditEvent,
  validateName,
  validateEmail,
  validateMatricNumber,
  validatePhone
} from "@/lib/validation";
import { 
  ArrowLeft, 
  UserPlus, 
  Users, 
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Key,
  AlertCircle,
  Save,
  X
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Student {
  id: string;
  user_id: string;
  matric_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  level: 'ND1' | 'ND2';
  email: string;
  phone?: string;
  department?: string;
  faculty?: string;
  password_changed: boolean;
  created_at: string;
}

const AdminStudentManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    matricNumber: "",
    email: "",
    phone: "",
    level: "",
    department: "Computer Science",
    faculty: "School of Information and Communication Technology",
    dateOfBirth: "",
    gender: "",
    address: "",
    stateOfOrigin: "",
    lga: ""
  });
  
  // Form validation states
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  // Validate form whenever form data changes
  useEffect(() => {
    const checkFormValidity = () => {
      const requiredFields = ['firstName', 'lastName', 'matricNumber', 'email', 'level'];
      const hasRequiredFields = requiredFields.every(field => formData[field as keyof typeof formData]);
      const hasNoErrors = Object.keys(validationErrors).length === 0;
      setIsFormValid(hasRequiredFields && hasNoErrors);
    };
    
    checkFormValidity();
  }, [formData, validationErrors]);

  const handleValidationResult = (field: string, isValid: boolean, error?: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (isValid) {
        delete newErrors[field];
      } else if (error) {
        newErrors[field] = error;
      }
      return newErrors;
    });
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      middleName: "",
      matricNumber: "",
      email: "",
      phone: "",
      level: "",
      department: "Computer Science",
      faculty: "School of Information and Communication Technology",
      dateOfBirth: "",
      gender: "",
      address: "",
      stateOfOrigin: "",
      lga: ""
    });
    setValidationErrors({});
  };

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load students",
          variant: "destructive",
        });
        return;
      }

      setStudents(data || []);
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

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast({
        title: "Form Validation Failed",
        description: "Please fix all errors before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setCreating(true);

    try {
      // Final validation check
      const validationResult = await validateUserCreationData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        matricNumber: formData.matricNumber,
        email: formData.email,
        phone: formData.phone,
        level: formData.level,
        department: formData.department,
        faculty: formData.faculty,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        stateOfOrigin: formData.stateOfOrigin,
        lga: formData.lga,
      });

      if (!validationResult.isValid) {
        toast({
          title: "Validation Failed",
          description: validationResult.error,
          variant: "destructive",
        });
        return;
      }

      // Create auth user with default password "2233"
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: "2233", // Default PIN
        options: {
          data: {
            matric_number: formData.matricNumber,
            first_name: formData.firstName,
            last_name: formData.lastName,
            middle_name: formData.middleName,
            phone: formData.phone,
            level: formData.level,
            department: formData.department,
            faculty: formData.faculty,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender,
            address: formData.address,
            state_of_origin: formData.stateOfOrigin,
            lga: formData.lga,
          }
        }
      });

      if (authError) {
        toast({
          title: "Failed to Create Student",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      // Log audit event for user creation
      if (authData.user) {
        await logAuditEvent({
          action: 'CREATE_STUDENT',
          tableName: 'students',
          recordId: authData.user.id,
          newValues: {
            matric_number: formData.matricNumber,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            level: formData.level,
          }
        });
      }

      // The student profile will be automatically created by the trigger
      toast({
        title: "Student Created Successfully",
        description: `Student account created with default PIN: 2233`,
      });

      // Reset form and close dialog
      resetForm();
      setShowCreateDialog(false);
      
      // Reload students list
      loadStudents();
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleResetPassword = async (studentId: string, email: string) => {
    try {
      // Reset to default PIN
      const { error } = await supabase.auth.admin.updateUserById(studentId, {
        password: "2233"
      });

      if (error) {
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Update password_changed flag
      await supabase
        .from('students')
        .update({ password_changed: false })
        .eq('user_id', studentId);

      toast({
        title: "Password Reset",
        description: "Student password has been reset to default PIN: 2233",
      });

      loadStudents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive",
      });
    }
  };

  const filteredStudents = students.filter(student =>
    student.matric_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Users className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/admin/dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-foreground">Student Management</h1>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search students by name, matric number, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Student
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Students ({filteredStudents.length})
              </CardTitle>
              <CardDescription>
                Manage student accounts and access credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matric Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Password Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-mono">{student.matric_number}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {student.first_name} {student.middle_name && `${student.middle_name} `}{student.last_name}
                            </div>
                            {student.phone && (
                              <div className="text-sm text-muted-foreground">{student.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{student.level}</Badge>
                        </TableCell>
                        <TableCell>
                          {student.password_changed ? (
                            <Badge variant="default">Custom Password</Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              Default PIN (2233)
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(student.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => handleResetPassword(student.user_id, student.email)}
                              >
                                <Key className="w-4 h-4 mr-2" />
                                Reset to Default PIN
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <AlertCircle className="w-8 h-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              {searchTerm ? "No students found matching your search" : "No students found"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Student Dialog */}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Create a new student account with default PIN (2233)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateStudent} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                id="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(value) => setFormData({ ...formData, firstName: value })}
                onValidation={(isValid, error) => handleValidationResult('firstName', isValid, error)}
                validator={(value) => validateName(value, 'First name')}
                required
                placeholder="Enter first name"
                autoComplete="given-name"
              />
              
              <ValidatedInput
                id="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={(value) => setFormData({ ...formData, lastName: value })}
                onValidation={(isValid, error) => handleValidationResult('lastName', isValid, error)}
                validator={(value) => validateName(value, 'Last name')}
                required
                placeholder="Enter last name"
                autoComplete="family-name"
              />
              
              <ValidatedInput
                id="middleName"
                label="Middle Name"
                value={formData.middleName}
                onChange={(value) => setFormData({ ...formData, middleName: value })}
                onValidation={(isValid, error) => handleValidationResult('middleName', isValid, error)}
                validator={(value) => value ? validateName(value, 'Middle name') : { isValid: true }}
                placeholder="Enter middle name (optional)"
                autoComplete="additional-name"
              />
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="transition-all duration-200"
                  aria-label="Date of birth"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger aria-label="Select gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Academic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                id="matricNumber"
                label="Matric Number"
                value={formData.matricNumber}
                onChange={(value) => setFormData({ ...formData, matricNumber: value })}
                onValidation={(isValid, error) => handleValidationResult('matricNumber', isValid, error)}
                validator={async (value) => {
                  const basicValidation = validateMatricNumber(value);
                  if (!basicValidation.isValid) return basicValidation;
                  return await checkMatricNumberUniqueness(value);
                }}
                required
                placeholder="e.g., ND/CS/2024/001"
                debounceMs={500}
              />
              
              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-medium">
                  Level <span className="ml-1 text-destructive" aria-label="required">*</span>
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                >
                  <SelectTrigger aria-label="Select academic level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ND1">ND1</SelectItem>
                    <SelectItem value="ND2">ND2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                onValidation={(isValid, error) => handleValidationResult('email', isValid, error)}
                validator={async (value) => {
                  const basicValidation = validateEmail(value);
                  if (!basicValidation.isValid) return basicValidation;
                  return await checkEmailUniqueness(value);
                }}
                required
                placeholder="student@example.com"
                autoComplete="email"
                debounceMs={500}
              />
              
              <ValidatedInput
                id="phone"
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                onValidation={(isValid, error) => handleValidationResult('phone', isValid, error)}
                validator={(value) => validatePhone(value)}
                placeholder="080XXXXXXXX"
                autoComplete="tel"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Student's home address"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stateOfOrigin">State of Origin</Label>
                <Input
                  id="stateOfOrigin"
                  value={formData.stateOfOrigin}
                  onChange={(e) => setFormData({ ...formData, stateOfOrigin: e.target.value })}
                  placeholder="e.g., Plateau"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lga">Local Government Area</Label>
                <Input
                  id="lga"
                  value={formData.lga}
                  onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                  placeholder="e.g., Barkin Ladi"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={creating || !isFormValid} 
              className={cn(
                "flex-1 transition-all duration-200",
                isFormValid 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-muted text-muted-foreground"
              )}
              aria-label={creating ? "Creating student account" : "Create student account"}
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating Student...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Student Account
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                setShowCreateDialog(false);
              }}
              className="flex-1 transition-all duration-200"
              disabled={creating}
              aria-label="Cancel student creation"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </div>
  );
};

export default AdminStudentManagement;