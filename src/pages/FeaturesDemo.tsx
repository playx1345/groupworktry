import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AcademicPerformance from "@/components/AcademicPerformance";
import PerformanceCharts from "@/components/PerformanceCharts";
import AcademicAdvisor from "@/components/AcademicAdvisor";
import { StudentAcademicRecord, SemesterResult } from "@/lib/gpaCalculator";
import { TrendingUp, BarChart3, Lightbulb, GraduationCap } from "lucide-react";

// Sample data for demonstration
const sampleAcademicRecord: StudentAcademicRecord = {
  semesters: [
    {
      semester: 'First',
      level: 'ND1',
      session: '2023/2024',
      courses: [
        { course_code: 'CSC101', course_title: 'Introduction to Computer Science', credit_unit: 3, score: 85, grade: 'A', grade_point: 4.0 },
        { course_code: 'MTH101', course_title: 'Mathematics I', credit_unit: 3, score: 78, grade: 'B', grade_point: 3.0 },
        { course_code: 'PHY101', course_title: 'Physics I', credit_unit: 3, score: 72, grade: 'B', grade_point: 3.0 },
        { course_code: 'ENG101', course_title: 'English Language', credit_unit: 2, score: 82, grade: 'A', grade_point: 4.0 },
        { course_code: 'CSC102', course_title: 'Programming Fundamentals', credit_unit: 4, score: 88, grade: 'A', grade_point: 4.0 },
        { course_code: 'STA101', course_title: 'Statistics', credit_unit: 2, score: 65, grade: 'C', grade_point: 2.0 },
      ],
      gpa: 3.35,
      total_credit_units: 17,
      total_grade_points: 57.0
    },
    {
      semester: 'Second',
      level: 'ND1',
      session: '2023/2024',
      courses: [
        { course_code: 'CSC111', course_title: 'Data Structures', credit_unit: 3, score: 92, grade: 'A', grade_point: 4.0 },
        { course_code: 'MTH111', course_title: 'Mathematics II', credit_unit: 3, score: 81, grade: 'A', grade_point: 4.0 },
        { course_code: 'PHY111', course_title: 'Physics II', credit_unit: 3, score: 76, grade: 'B', grade_point: 3.0 },
        { course_code: 'CSC112', course_title: 'Database Systems', credit_unit: 4, score: 89, grade: 'A', grade_point: 4.0 },
        { course_code: 'CSC113', course_title: 'Web Development', credit_unit: 3, score: 84, grade: 'A', grade_point: 4.0 },
        { course_code: 'ECO111', course_title: 'Economics', credit_unit: 2, score: 68, grade: 'C', grade_point: 2.0 },
      ],
      gpa: 3.61,
      total_credit_units: 18,
      total_grade_points: 65.0
    },
    {
      semester: 'First',
      level: 'ND2',
      session: '2024/2025',
      courses: [
        { course_code: 'CSC201', course_title: 'Software Engineering', credit_unit: 4, score: 87, grade: 'A', grade_point: 4.0 },
        { course_code: 'CSC202', course_title: 'Computer Networks', credit_unit: 3, score: 83, grade: 'A', grade_point: 4.0 },
        { course_code: 'CSC203', course_title: 'Operating Systems', credit_unit: 3, score: 79, grade: 'B', grade_point: 3.0 },
        { course_code: 'CSC204', course_title: 'Algorithm Analysis', credit_unit: 3, score: 91, grade: 'A', grade_point: 4.0 },
        { course_code: 'CSC205', course_title: 'Mobile App Development', credit_unit: 4, score: 85, grade: 'A', grade_point: 4.0 },
        { course_code: 'MGT201', course_title: 'Management Principles', credit_unit: 2, score: 70, grade: 'B', grade_point: 3.0 },
      ],
      gpa: 3.68,
      total_credit_units: 19,
      total_grade_points: 70.0
    }
  ],
  cgpa: 3.55,
  total_credit_units: 54,
  total_grade_points: 192.0
};

const FeaturesDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Enhanced Features Demo</h1>
              <p className="text-sm text-muted-foreground">Academic Performance Analytics & Recommendations</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">New Academic Features</h2>
          <p className="text-muted-foreground">
            Experience the enhanced student dashboard with GPA calculations, performance analytics, and personalized academic recommendations.
          </p>
        </div>

        <Tabs defaultValue="performance" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance Overview</TabsTrigger>
            <TabsTrigger value="analytics">Visual Analytics</TabsTrigger>
            <TabsTrigger value="advisor">Academic Advisor</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-8">
            <AcademicPerformance academicRecord={sampleAcademicRecord} targetGPA={3.0} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <PerformanceCharts semesters={sampleAcademicRecord.semesters} />
          </TabsContent>

          <TabsContent value="advisor" className="space-y-8">
            <AcademicAdvisor 
              academicRecord={sampleAcademicRecord} 
              studentLevel="ND2"
            />
          </TabsContent>
        </Tabs>

        {/* Feature Highlights */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatic GPA calculation, CGPA tracking, and performance trend analysis across semesters.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Visual Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Interactive charts showing GPA trends, grade distribution, and academic insights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Smart Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Personalized academic advice based on performance data and learning patterns.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeaturesDemo;