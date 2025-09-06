import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, FileText, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-polytechnic-blue/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-polytechnic-green/5 rounded-full blur-3xl animate-float" style={{animationDelay: '-3s'}}></div>
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-polytechnic-gold/5 rounded-full blur-3xl animate-float" style={{animationDelay: '-1.5s'}}></div>
      </div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 animate-slide-up">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 animate-slide-in-left animate-delay-200">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-elegant p-1 hover-lift">
                <img src="/lovable-uploads/868ef83e-4412-4c0c-b6a9-9db317c8b2c1.png" alt="Plateau State Polytechnic Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-display">PLATEAU STATE POLYTECHNIC BARKIN LADI</h1>
                <p className="text-sm text-gradient-primary font-medium">Technology for Progress</p>
              </div>
            </div>
            <div className="flex gap-2 animate-slide-in-right animate-delay-300">
              <Button asChild variant="outline" className="hover-lift">
                <Link to="/auth?mode=login">Student Login</Link>
              </Button>
              <Button asChild className="hover-lift bg-gradient-to-r from-polytechnic-blue to-polytechnic-green hover:shadow-lg transition-all duration-300">
                <Link to="/admin/login">Admin Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elegant p-2 animate-scale-in animate-delay-400 hover-lift animate-glow-pulse">
              <img src="/lovable-uploads/868ef83e-4412-4c0c-b6a9-9db317c8b2c1.png" alt="Plateau State Polytechnic Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-4 text-gradient-primary font-display animate-slide-up animate-delay-500 leading-tight">
              Plateau State Polytechnic Barkin Ladi
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold mb-2 text-foreground font-display animate-slide-up animate-delay-600">
              School of Information and Communication Technology
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up animate-delay-700 max-w-4xl mx-auto leading-relaxed">
              Department of Computer Science - Online Result Checker
            </p>
          </div>
          
          <div className="flex justify-center mb-12 animate-scale-in animate-delay-800">
            <Button asChild size="lg" className="bg-gradient-to-r from-polytechnic-blue to-polytechnic-green hover:shadow-lg transition-all duration-300 hover-lift text-lg px-8 py-6 animate-glow-pulse">
              <Link to="/auth?mode=login">View My Results</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-polytechnic-blue/5 to-polytechnic-green/5 relative z-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="text-center shadow-card border-0 bg-gradient-card hover-lift animate-slide-in-left animate-delay-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-polytechnic-blue to-polytechnic-green rounded-xl flex items-center justify-center mx-auto mb-4 animate-float">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-gradient-primary mb-4 font-display">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To revolutionize academic transparency and efficiency through a secure, accessible, 
                  and intelligent result management system—empowering students and administrators of 
                  the Department of Computer Science with real-time academic insights and digital autonomy.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card border-0 bg-gradient-card hover-lift animate-slide-in-right animate-delay-400">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-polytechnic-green to-polytechnic-gold rounded-xl flex items-center justify-center mx-auto mb-4 animate-float" style={{animationDelay: '-2s'}}>
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-gradient-secondary mb-4 font-display">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-3 text-left text-lg">
                  <li className="animate-slide-up animate-delay-500">• Develop a user-friendly web-based platform that simplifies result access, fee verification, and academic performance tracking for ND1 and ND2 students</li>
                  <li className="animate-slide-up animate-delay-600">• Uphold data integrity, security, and accessibility using modern web technologies and cloud infrastructure</li>
                  <li className="animate-slide-up animate-delay-700">• Foster digital transformation within the Department by automating administrative tasks</li>
                  <li className="animate-slide-up animate-delay-800">• Support academic excellence through timely feedback and personalized performance analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12 text-gradient-primary font-display animate-slide-up animate-delay-200">System Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-card border-0 bg-gradient-card hover-lift animate-scale-in animate-delay-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-polytechnic-blue to-polytechnic-blue/80 rounded-xl flex items-center justify-center mx-auto mb-4 animate-float">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-polytechnic-blue font-display">View Results</CardTitle>
                <CardDescription className="text-lg">
                  Access your ND1 and ND2 semester results with detailed breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-3 text-left">
                  <li className="animate-slide-up animate-delay-400">• First & Second Semester Results</li>
                  <li className="animate-slide-up animate-delay-500">• Total GP Calculation</li>
                  <li className="animate-slide-up animate-delay-600">• Carryover Identification</li>
                  <li className="animate-slide-up animate-delay-700">• PDF Export Feature</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card border-0 bg-gradient-card hover-lift animate-scale-in animate-delay-400">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-polytechnic-green to-polytechnic-green/80 rounded-xl flex items-center justify-center mx-auto mb-4 animate-float" style={{animationDelay: '-2s'}}>
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-polytechnic-green font-display">Secure Access</CardTitle>
                <CardDescription className="text-lg">
                  Fee verification and secure authentication system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-3 text-left">
                  <li className="animate-slide-up animate-delay-500">• Fee Payment Verification</li>
                  <li className="animate-slide-up animate-delay-600">• Secure Login System</li>
                  <li className="animate-slide-up animate-delay-700">• Profile Management</li>
                  <li className="animate-slide-up animate-delay-800">• Password Security</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card border-0 bg-gradient-card hover-lift animate-scale-in animate-delay-500">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-polytechnic-gold to-polytechnic-gold/80 rounded-xl flex items-center justify-center mx-auto mb-4 animate-float" style={{animationDelay: '-4s'}}>
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-polytechnic-gold font-display">Administration</CardTitle>
                <CardDescription className="text-lg">
                  Comprehensive admin panel for result management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-3 text-left">
                  <li className="animate-slide-up animate-delay-600">• Student Account Management</li>
                  <li className="animate-slide-up animate-delay-700">• Result Upload System</li>
                  <li className="animate-slide-up animate-delay-800">• Fee Status Management</li>
                  <li className="animate-slide-up animate-delay-900">• Announcements</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 bg-gradient-to-r from-polytechnic-blue to-polytechnic-green relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center text-white relative z-10">
          <h3 className="text-4xl font-bold mb-6 font-display animate-slide-up animate-delay-200">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="animate-slide-in-left animate-delay-300">
              <h4 className="text-2xl font-semibold mb-4 font-display">Department Office</h4>
              <p className="opacity-90 text-lg leading-relaxed">Computer Science Department</p>
              <p className="opacity-90 text-lg leading-relaxed">School of ICT, Plateau State Polytechnic</p>
              <p className="opacity-90 text-lg leading-relaxed">Barkin Ladi, Plateau State</p>
            </div>
            <div className="animate-slide-in-right animate-delay-400">
              <h4 className="text-2xl font-semibold mb-4 font-display">For Support</h4>
              <p className="opacity-90 text-lg leading-relaxed">Contact your lecturer or</p>
              <p className="opacity-90 text-lg leading-relaxed">Visit the department office</p>
              <p className="opacity-90 text-lg leading-relaxed">during official hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-75 animate-slide-up animate-delay-200">
            © 2024 Plateau State Polytechnic - Department of Computer Science. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
