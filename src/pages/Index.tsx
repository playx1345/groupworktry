import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, FileText, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">PLASU ICT</h1>
                <p className="text-sm text-muted-foreground">Result Portal</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/auth?mode=login">Student Login</Link>
              </Button>
              <Button asChild>
                <Link to="/admin/login">Admin Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Plateau State Polytechnic
            </h1>
            <h2 className="text-3xl font-semibold mb-2 text-foreground">
              School of Information and Communication Technology
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Department of Computer Science - Online Result Checker
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Link to="/auth?mode=register">Register as Student</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth?mode=login">View My Results</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">System Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-blue-700">View Results</CardTitle>
                <CardDescription>
                  Access your ND1 and ND2 semester results with detailed breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• First & Second Semester Results</li>
                  <li>• Total GP Calculation</li>
                  <li>• Carryover Identification</li>
                  <li>• PDF Export Feature</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
              <CardHeader>
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-green-700">Secure Access</CardTitle>
                <CardDescription>
                  Fee verification and secure authentication system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Fee Payment Verification</li>
                  <li>• Secure Login System</li>
                  <li>• Profile Management</li>
                  <li>• Password Security</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-purple-700">Administration</CardTitle>
                <CardDescription>
                  Comprehensive admin panel for result management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Student Account Management</li>
                  <li>• Result Upload System</li>
                  <li>• Fee Status Management</li>
                  <li>• Announcements</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto text-center text-white">
          <h3 className="text-3xl font-bold mb-6">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="text-xl font-semibold mb-2">Department Office</h4>
              <p className="opacity-90">Computer Science Department</p>
              <p className="opacity-90">School of ICT, Plateau State Polytechnic</p>
              <p className="opacity-90">Barkin Ladi, Plateau State</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">For Support</h4>
              <p className="opacity-90">Contact your lecturer or</p>
              <p className="opacity-90">Visit the department office</p>
              <p className="opacity-90">during official hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-75">
            © 2024 Plateau State Polytechnic - Department of Computer Science. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
