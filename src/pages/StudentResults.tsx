import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthWrapper";
import { 
  GraduationCap, 
  ArrowLeft, 
  Download, 
  FileText,
  TrendingUp,
  BookOpen,
  Calculator
} from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Result {
  id: string;
  ca_score: number;
  exam_score: number;
  total_score: number;
  grade: string;
  grade_point: number;
  session: string;
  course: {
    course_code: string;
    course_title: string;
    credit_unit: number;
  };
}

interface Student {
  id: string;
  matric_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  level: 'ND1' | 'ND2';
  email: string;
  faculty: string;
  department: string;
}

interface FeeStatus {
  status: 'paid' | 'unpaid' | 'partial';
  session: string;
  level: 'ND1' | 'ND2';
  semester: 'First' | 'Second';
}

const StudentResults = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [feeStatus, setFeeStatus] = useState<FeeStatus[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'ND1' | 'ND2'>('ND1');
  const [selectedSemester, setSelectedSemester] = useState<'First' | 'Second'>('First');
  const [selectedSession, setSelectedSession] = useState<string>('2024/2025');
  const resultRef = useRef<HTMLDivElement>(null);

  const level = searchParams.get('level') as 'ND1' | 'ND2' || 'ND1';
  const semester = searchParams.get('semester') as 'First' | 'Second' || 'First';

  useEffect(() => {
    if (!authLoading) {
      setSelectedLevel(level);
      setSelectedSemester(semester);
      loadData();
    }
  }, [authLoading, user, level, semester]);

  const loadData = async () => {
    if (!user || !session) {
      navigate("/auth?mode=login");
      return;
    }

    try {
      // Load student data
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (studentError) {
        toast({
          title: "Error",
          description: "Failed to load student profile",
          variant: "destructive",
        });
        return;
      }

      setStudent(studentData);

      // Load fee status
      const { data: feeData, error: feeError } = await supabase
        .from('fee_payments')
        .select('status, session, level, semester')
        .eq('student_id', studentData.id);

      if (!feeError && feeData) {
        setFeeStatus(feeData);
      }

      // Load results for selected level and semester
      await loadResults(studentData.id, selectedLevel, selectedSemester, selectedSession);

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

  const loadResults = async (studentId: string, level: 'ND1' | 'ND2', semester: 'First' | 'Second', session: string) => {
    // First get course IDs for the specified level and semester
    const { data: courseIds, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('level', level)
      .eq('semester', semester);

    if (courseError || !courseIds) return;

    const courseIdArray = courseIds.map(course => course.id);

    const { data: resultsData, error: resultsError } = await supabase
      .from('results')
      .select(`
        id,
        ca_score,
        exam_score,
        total_score,
        grade,
        grade_point,
        session,
        course:courses(
          course_code,
          course_title,
          credit_unit
        )
      `)
      .eq('student_id', studentId)
      .eq('session', session)
      .in('course_id', courseIdArray);

    if (!resultsError && resultsData) {
      setResults(resultsData);
    }
  };

  const canViewResults = () => {
    const currentSession = "2024/2025";
    const fee = feeStatus.find(f => 
      f.level === selectedLevel && 
      f.semester === selectedSemester && 
      f.session === currentSession
    );
    return fee?.status === 'paid';
  };

  const calculateStats = () => {
    const totalCreditUnits = results.reduce((sum, result) => sum + (result.course?.credit_unit || 0), 0);
    const totalGradePoints = results.reduce((sum, result) => sum + (result.grade_point * (result.course?.credit_unit || 0)), 0);
    const cgp = totalCreditUnits > 0 ? (totalGradePoints / totalCreditUnits).toFixed(2) : '0.00';
    const carryovers = results.filter(result => result.grade === 'F').length;
    
    return { totalCreditUnits, cgp, carryovers };
  };

  const exportToPDF = async () => {
    if (!resultRef.current || !student) return;

    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add header
      pdf.setFontSize(16);
      pdf.text('PLATEAU STATE POLYTECHNIC BARKIN LADI', 105, 20, { align: 'center' });
      pdf.setFontSize(14);
      pdf.text('School of Information and Communication Technology', 105, 30, { align: 'center' });
      pdf.text('Department of Computer Science', 105, 40, { align: 'center' });
      
      // Add student info
      pdf.setFontSize(12);
      pdf.text(`Student: ${student.first_name} ${student.last_name}`, 20, 60);
      pdf.text(`Matric Number: ${student.matric_number}`, 20, 70);
      pdf.text(`Level: ${selectedLevel}`, 20, 80);
      pdf.text(`Semester: ${selectedSemester}`, 20, 90);
      pdf.text(`Session: ${selectedSession}`, 20, 100);
      
      // Add results image
      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 20, 110, imgWidth, imgHeight);
      
      pdf.save(`${student.matric_number}_${selectedLevel}_${selectedSemester}_Results.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Your results have been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!canViewResults()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <FileText className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Fee Payment Required</h2>
            <p className="text-muted-foreground mb-4">
              Please complete your fee payment to access results for {selectedLevel} {selectedSemester} Semester.
            </p>
            <Button onClick={() => navigate("/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Academic Results</h1>
                <p className="text-sm text-muted-foreground">
                  {student?.first_name} {student?.last_name} - {student?.matric_number}
                </p>
              </div>
            </div>
            <Button onClick={exportToPDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Select Academic Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Level</label>
                <Select 
                  value={selectedLevel} 
                  onValueChange={(value: 'ND1' | 'ND2') => {
                    setSelectedLevel(value);
                    loadResults(student!.id, value, selectedSemester, selectedSession);
                  }}
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
              <div>
                <label className="text-sm font-medium">Semester</label>
                <Select 
                  value={selectedSemester} 
                  onValueChange={(value: 'First' | 'Second') => {
                    setSelectedSemester(value);
                    loadResults(student!.id, selectedLevel, value, selectedSession);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First">First Semester</SelectItem>
                    <SelectItem value="Second">Second Semester</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Session</label>
                <Select 
                  value={selectedSession} 
                  onValueChange={(value) => {
                    setSelectedSession(value);
                    loadResults(student!.id, selectedLevel, selectedSemester, value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024/2025">2024/2025</SelectItem>
                    <SelectItem value="2023/2024">2023/2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CGP</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cgp}</div>
              <p className="text-xs text-muted-foreground">
                Cumulative Grade Point
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCreditUnits}</div>
              <p className="text-xs text-muted-foreground">
                Credit Units
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carryovers</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.carryovers}</div>
              <p className="text-xs text-muted-foreground">
                Failed Courses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card ref={resultRef}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {selectedLevel} {selectedSemester} Semester Results - {selectedSession}
            </CardTitle>
            <CardDescription>
              Detailed course results for the selected academic period
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead className="text-center">Credit Unit</TableHead>
                    <TableHead className="text-center">CA Score</TableHead>
                    <TableHead className="text-center">Exam Score</TableHead>
                    <TableHead className="text-center">Total Score</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Grade Point</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-mono font-medium">
                        {result.course?.course_code}
                      </TableCell>
                      <TableCell>{result.course?.course_title}</TableCell>
                      <TableCell className="text-center">{result.course?.credit_unit}</TableCell>
                      <TableCell className="text-center">{result.ca_score}</TableCell>
                      <TableCell className="text-center">{result.exam_score}</TableCell>
                      <TableCell className="text-center font-semibold">{result.total_score}</TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={result.grade === 'F' ? 'destructive' : 'secondary'}
                          className="font-bold"
                        >
                          {result.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {result.grade_point.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground">
                  No results available for {selectedLevel} {selectedSemester} Semester ({selectedSession})
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentResults;