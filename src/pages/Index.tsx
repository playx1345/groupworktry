import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, FileText, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/use-scroll-animation";

const Index = () => {
  const heroAnimation = useScrollAnimation({ threshold: 0.2, triggerOnce: true });
  const featuresAnimation = useStaggeredAnimation(3, 150, { threshold: 0.2, triggerOnce: true });
  const contactAnimation = useScrollAnimation({ threshold: 0.4, triggerOnce: true });
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-polytechnic-blue/5 rounded-full blur-3xl animate-parallax-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-polytechnic-green/5 rounded-full blur-3xl animate-parallax-float" style={{animationDelay: '-4s'}}></div>
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-polytechnic-gold/5 rounded-full blur-3xl animate-parallax-float" style={{animationDelay: '-2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-polytechnic-blue/3 rounded-full blur-3xl animate-float" style={{animationDelay: '-6s'}}></div>
      </div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 animate-slide-up">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 animate-slide-in-left animate-delay-200">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-elegant p-1 hover-float hover-glow">
                <img src="/lovable-uploads/868ef83e-4412-4c0c-b6a9-9db317c8b2c1.png" alt="Plateau State Polytechnic Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-display">PLATEAU STATE POLYTECHNIC BARKIN LADI</h1>
                <p className="text-sm text-gradient-primary font-medium animate-gradient-shift">Technology for Progress</p>
              </div>
            </div>
            <div className="flex gap-2 animate-slide-in-right animate-delay-300">
              <Button asChild variant="outline" className="hover-float hover-glow">
                <Link to="/auth?mode=login">Student Login</Link>
              </Button>
              <Button asChild className="hover-float bg-gradient-to-r from-polytechnic-blue to-polytechnic-green hover:shadow-lg transition-all duration-300 animate-gradient-shift">
                <Link to="/admin/login">Admin Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroAnimation.ref} className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <div className={`w-32 h-32 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elegant p-2 hover-tilt animate-glow-pulse relative ${heroAnimation.isInView ? 'animate-bounce-in animate-delay-200' : 'opacity-0'}`}>
              <img src="/lovable-uploads/868ef83e-4412-4c0c-b6a9-9db317c8b2c1.png" alt="Plateau State Polytechnic Logo" className="w-full h-full object-contain" />
              <div className="absolute inset-0 rounded-2xl animate-pulse-ring" style={{animationDelay: '1s'}}></div>
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 text-gradient-primary font-display leading-tight ${heroAnimation.isInView ? 'animate-slide-up animate-delay-400' : 'opacity-0 translate-y-10'}`}>
              Plateau State Polytechnic Barkin Ladi
            </h1>
            <h2 className={`text-2xl md:text-3xl font-semibold mb-2 text-foreground font-display ${heroAnimation.isInView ? 'animate-slide-up animate-delay-500' : 'opacity-0 translate-y-10'}`}>
              School of Information and Communication Technology
            </h2>
            <p className={`text-lg md:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed ${heroAnimation.isInView ? 'animate-fade-in-up animate-delay-600' : 'opacity-0 translate-y-10'}`}>
              Department of Computer Science - Online Result Checker
            </p>
          </div>
          
          <div className={`flex justify-center mb-12 ${heroAnimation.isInView ? 'animate-scale-in animate-delay-700' : 'opacity-0 scale-75'}`}>
            <Button asChild size="lg" className="bg-gradient-to-r from-polytechnic-blue to-polytechnic-green hover:shadow-lg transition-all duration-300 hover-lift text-base px-6 py-4 animate-glow-pulse hover-glow">
              <Link to="/auth?mode=login">View My Results</Link>
            </Button>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section ref={featuresAnimation.ref} className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <h3 className={`text-3xl font-bold text-center mb-12 text-gradient-primary font-display ${featuresAnimation.isInView ? 'animate-slide-up animate-delay-100' : 'opacity-0 translate-y-10'}`}>System Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className={`text-center shadow-card border-0 bg-gradient-card interactive-card ${featuresAnimation.visibleItems.includes(0) ? 'animate-scale-in animate-delay-200' : 'opacity-0 scale-75'}`}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-polytechnic-blue to-polytechnic-blue/80 rounded-xl flex items-center justify-center mx-auto mb-4 animate-float hover-tilt">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-polytechnic-blue font-display">View Results</CardTitle>
                <CardDescription className="text-base">
                  Access your ND1 and ND2 semester results with detailed breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-3 text-left">
                  <li className={`${featuresAnimation.visibleItems.includes(0) ? 'animate-fade-in-up animate-delay-400' : 'opacity-0'}`}>• First & Second Semester Results</li>
                  <li className={`${featuresAnimation.visibleItems.includes(0) ? 'animate-fade-in-up animate-delay-450' : 'opacity-0'}`}>• Total GP Calculation</li>
                  <li className={`${featuresAnimation.visibleItems.includes(0) ? 'animate-fade-in-up animate-delay-500' : 'opacity-0'}`}>• Carryover Identification</li>
                  <li className={`${featuresAnimation.visibleItems.includes(0) ? 'animate-fade-in-up animate-delay-550' : 'opacity-0'}`}>• PDF Export Feature</li>
                </ul>
              </CardContent>
            </Card>

            <Card className={`text-center shadow-card border-0 bg-gradient-card interactive-card ${featuresAnimation.visibleItems.includes(1) ? 'animate-scale-in animate-delay-350' : 'opacity-0 scale-75'}`}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-polytechnic-green to-polytechnic-green/80 rounded-xl flex items-center justify-center mx-auto mb-4 animate-float hover-tilt" style={{animationDelay: '-3s'}}>
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-polytechnic-green font-display">Secure Access</CardTitle>
                <CardDescription className="text-base">
                  Fee verification and secure authentication system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-3 text-left">
                  <li className={`${featuresAnimation.visibleItems.includes(1) ? 'animate-fade-in-up animate-delay-550' : 'opacity-0'}`}>• Fee Payment Verification</li>
                  <li className={`${featuresAnimation.visibleItems.includes(1) ? 'animate-fade-in-up animate-delay-600' : 'opacity-0'}`}>• Secure Login System</li>
                  <li className={`${featuresAnimation.visibleItems.includes(1) ? 'animate-fade-in-up animate-delay-650' : 'opacity-0'}`}>• Profile Management</li>
                  <li className={`${featuresAnimation.visibleItems.includes(1) ? 'animate-fade-in-up animate-delay-700' : 'opacity-0'}`}>• Password Security</li>
                </ul>
              </CardContent>
            </Card>

            <Card className={`text-center shadow-card border-0 bg-gradient-card interactive-card ${featuresAnimation.visibleItems.includes(2) ? 'animate-scale-in animate-delay-500' : 'opacity-0 scale-75'}`}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-polytechnic-gold to-polytechnic-gold/80 rounded-xl flex items-center justify-center mx-auto mb-4 animate-float hover-tilt" style={{animationDelay: '-5s'}}>
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-polytechnic-gold font-display">Administration</CardTitle>
                <CardDescription className="text-base">
                  Comprehensive admin panel for result management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-3 text-left">
                  <li className={`${featuresAnimation.visibleItems.includes(2) ? 'animate-fade-in-up animate-delay-700' : 'opacity-0'}`}>• Student Account Management</li>
                  <li className={`${featuresAnimation.visibleItems.includes(2) ? 'animate-fade-in-up animate-delay-750' : 'opacity-0'}`}>• Result Upload System</li>
                  <li className={`${featuresAnimation.visibleItems.includes(2) ? 'animate-fade-in-up animate-delay-800' : 'opacity-0'}`}>• Fee Status Management</li>
                  <li className={`${featuresAnimation.visibleItems.includes(2) ? 'animate-fade-in-up animate-delay-850' : 'opacity-0'}`}>• Announcements</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section ref={contactAnimation.ref} className="py-16 px-4 bg-gradient-to-r from-polytechnic-blue to-polytechnic-green relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" style={{animationDelay: '-2s'}}></div>
        </div>
        <div className="container mx-auto text-center text-white relative z-10">
          <h3 className={`text-3xl font-bold mb-6 font-display ${contactAnimation.isInView ? 'animate-slide-up animate-delay-100' : 'opacity-0 translate-y-10'}`}>Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className={`${contactAnimation.isInView ? 'animate-slide-in-left animate-delay-250' : 'opacity-0 -translate-x-10'}`}>
              <h4 className="text-xl font-semibold mb-4 font-display">Department Office</h4>
              <p className="opacity-90 text-base leading-relaxed">Computer Science Department</p>
              <p className="opacity-90 text-base leading-relaxed">School of ICT, Plateau State Polytechnic</p>
              <p className="opacity-90 text-base leading-relaxed">Barkin Ladi, Plateau State</p>
            </div>
            <div className={`${contactAnimation.isInView ? 'animate-slide-in-right animate-delay-400' : 'opacity-0 translate-x-10'}`}>
              <h4 className="text-xl font-semibold mb-4 font-display">For Support</h4>
              <p className="opacity-90 text-base leading-relaxed">Contact your lecturer or</p>
              <p className="opacity-90 text-base leading-relaxed">Visit the department office</p>
              <p className="opacity-90 text-base leading-relaxed">during official hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-75 animate-fade-in-up animate-delay-200">
            © 2024 Plateau State Polytechnic - Department of Computer Science. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
