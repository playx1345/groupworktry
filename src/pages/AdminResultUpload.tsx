import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  ArrowLeft, 
  Upload, 
  Search,
  Plus,
  Save,
  Trash2
} from "lucide-react";

interface Student {
  id: string;
  matric_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  level: 'ND1' | 'ND2';
}

interface Course {
  id: string;
  course_code: string;
  course_title: string;
  credit_unit: number;
  level: 'ND1' | 'ND2';
  semester: 'First' | 'Second';
}

interface ResultEntry {
  student_id: string;
  course_id: string;
  ca_score: number;
  exam_score: number;
  session: string;
}

const AdminResultUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'ND1' | 'ND2'>('ND1');
  const [selectedSemester, setSelectedSemester] = useState<'First' | 'Second'>('First');
  const [selectedSession, setSelectedSession] = useState<string>('2024/2025');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [searchMatric, setSearchMatric] = useState<string>('');
  const [resultEntries, setResultEntries] = useState<ResultEntry[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadCourses();
  }, [selectedLevel, selectedSemester]);

  useEffect(() => {
    loadStudents();
  }, [selectedLevel, searchMatric]);

  const loadInitialData = async () => {
    // Initial load will be triggered by other useEffect hooks
  };

  const loadStudents = async () => {
    let query = supabase
      .from('students')
      .select('id, matric_number, first_name, last_name, middle_name, level')
      .eq('level', selectedLevel)
      .order('matric_number');

    if (searchMatric) {
      query = query.ilike('matric_number', `%${searchMatric}%`);
    }

    const { data, error } = await query;

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
      return;
    }

    setStudents(data || []);
  };

  const loadCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('level', selectedLevel)
      .eq('semester', selectedSemester)
      .order('course_code');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
      return;
    }

    setCourses(data || []);
  };

  const addStudentToResults = (student: Student) => {
    if (!selectedCourse) {
      toast({
        title: "Course Required",
        description: "Please select a course first",
        variant: "destructive",
      });
      return;
    }

    const exists = resultEntries.find(entry => 
      entry.student_id === student.id && entry.course_id === selectedCourse
    );

    if (exists) {
      toast({
        title: "Already Added",
        description: "This student is already in the results list",
        variant: "destructive",
      });
      return;
    }

    setResultEntries([...resultEntries, {
      student_id: student.id,
      course_id: selectedCourse,
      ca_score: 0,
      exam_score: 0,
      session: selectedSession
    }]);
  };

  const updateResultEntry = (index: number, field: 'ca_score' | 'exam_score', value: number) => {
    const updated = [...resultEntries];
    updated[index][field] = value;
    setResultEntries(updated);
  };

  const removeResultEntry = (index: number) => {
    const updated = resultEntries.filter((_, i) => i !== index);
    setResultEntries(updated);
  };

  const calculateTotalScore = (caScore: number, examScore: number) => {
    return caScore + examScore;
  };

  const saveResults = async () => {
    if (resultEntries.length === 0) {
      toast({
        title: "No Results",
        description: "Please add some results before saving",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const resultsToInsert = resultEntries.map(entry => ({
        student_id: entry.student_id,
        course_id: entry.course_id,
        ca_score: entry.ca_score,
        exam_score: entry.exam_score,
        total_score: entry.ca_score + entry.exam_score,
        session: entry.session
      }));

      const { error } = await supabase
        .from('results')
        .insert(resultsToInsert);

      if (error) {
        toast({
          title: "Save Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Results Saved",
        description: `Successfully saved ${resultEntries.length} results`,
      });

      setResultEntries([]);
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

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name} (${student.matric_number})` : 'Unknown Student';
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? `${course.course_code} - ${course.course_title}` : 'Unknown Course';
  };

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
                onClick={() => navigate("/admin/dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Dashboard
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Upload Results</h1>
                <p className="text-sm text-muted-foreground">Add individual student results</p>
              </div>
            </div>
            <Button onClick={saveResults} disabled={loading || resultEntries.length === 0}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Results"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Course Selection & Student Search */}
          <div className="space-y-6">
            {/* Course Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Select Course & Academic Period
                </CardTitle>
                <CardDescription>
                  Choose the course and academic period for result entry
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Level</Label>
                    <Select value={selectedLevel} onValueChange={(value: 'ND1' | 'ND2') => setSelectedLevel(value)}>
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
                    <Label>Semester</Label>
                    <Select value={selectedSemester} onValueChange={(value: 'First' | 'Second') => setSelectedSemester(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="First">First Semester</SelectItem>
                        <SelectItem value="Second">Second Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Session</Label>
                  <Select value={selectedSession} onValueChange={setSelectedSession}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024/2025">2024/2025</SelectItem>
                      <SelectItem value="2023/2024">2023/2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Course</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.course_code} - {course.course_title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Student Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Students
                </CardTitle>
                <CardDescription>
                  Search and add students to the results list
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Search by Matric Number</Label>
                  <Input
                    placeholder="Type matric number..."
                    value={searchMatric}
                    onChange={(e) => setSearchMatric(e.target.value)}
                  />
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {students.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                      <div>
                        <p className="font-medium">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.matric_number} - {student.level}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => addStudentToResults(student)}
                        disabled={!selectedCourse}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results Entry */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Result Entries ({resultEntries.length})</CardTitle>
                <CardDescription>
                  Enter CA and Exam scores for each student
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resultEntries.length > 0 ? (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead className="text-center">CA Score</TableHead>
                          <TableHead className="text-center">Exam Score</TableHead>
                          <TableHead className="text-center">Total</TableHead>
                          <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resultEntries.map((entry, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-sm">
                              {getStudentName(entry.student_id)}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="30"
                                value={entry.ca_score}
                                onChange={(e) => updateResultEntry(index, 'ca_score', parseInt(e.target.value) || 0)}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="70"
                                value={entry.exam_score}
                                onChange={(e) => updateResultEntry(index, 'exam_score', parseInt(e.target.value) || 0)}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell className="text-center font-semibold">
                              {calculateTotalScore(entry.ca_score, entry.exam_score)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => removeResultEntry(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Results Added</h3>
                    <p className="text-muted-foreground">
                      Select a course and add students to start entering results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResultUpload;