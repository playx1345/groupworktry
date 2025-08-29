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
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elegant p-2">
              <img src="/lovable-uploads/868ef83e-4412-4c0c-b6a9-9db317c8b2c1.png" alt="Plateau State Polytechnic Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-polytechnic-blue to-polytechnic-green bg-clip-text text-transparent">
              Plateau State Polytechnic Barkin Ladi
            </h1>
            <h2 className="text-3xl font-semibold mb-2 text-foreground">
              School of Information and Communication Technology
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Department of Computer Science - Online Result Checker
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-polytechnic-blue to-polytechnic-green hover:shadow-lg transition-all duration-300">
              <Link to="/auth?mode=register">Register as Student</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-polytechnic-blue text-polytechnic-blue hover:bg-polytechnic-blue hover:text-white">
              <Link to="/auth?mode=login">View My Results</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-polytechnic-blue/5 to-polytechnic-green/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="text-center shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-polytechnic-blue to-polytechnic-green rounded-xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-polytechnic-blue mb-4">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To revolutionize academic transparency and efficiency through a secure, accessible, 
                  and intelligent result management system—empowering students and administrators of 
                  the Department of Computer Science with real-time academic insights and digital autonomy.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-polytechnic-green to-polytechnic-gold rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-polytechnic-green mb-4">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-3 text-left">
                  <li>• Develop a user-friendly web-based platform that simplifies result access, fee verification, and academic performance tracking for ND1 and ND2 students</li>
                  <li>• Uphold data integrity, security, and accessibility using modern web technologies and cloud infrastructure</li>
                  <li>• Foster digital transformation within the Department by automating administrative tasks</li>
                  <li>• Support academic excellence through timely feedback and personalized performance analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">System Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <div className="w-16 h-16 bg-polytechnic-blue rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-polytechnic-blue">View Results</CardTitle>
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

            <Card className="text-center shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <div className="w-16 h-16 bg-polytechnic-green rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-polytechnic-green">Secure Access</CardTitle>
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

            <Card className="text-center shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <div className="w-16 h-16 bg-polytechnic-gold rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-polytechnic-gold">Administration</CardTitle>
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
      <section className="py-16 px-4 bg-gradient-to-r from-polytechnic-blue to-polytechnic-green">
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
