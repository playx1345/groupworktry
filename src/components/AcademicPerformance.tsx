import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  Award,
  BookOpen
} from "lucide-react";
import { 
  StudentAcademicRecord, 
  SemesterResult, 
  getClassOfDegree, 
  getAcademicStatus,
  calculateRequiredGPA
} from "@/lib/gpaCalculator";

interface AcademicPerformanceProps {
  academicRecord: StudentAcademicRecord;
  targetGPA?: number;
}

const AcademicPerformance: React.FC<AcademicPerformanceProps> = ({ 
  academicRecord, 
  targetGPA = 3.0 
}) => {
  const { cgpa, semesters } = academicRecord;
  const latestSemester = semesters[semesters.length - 1];
  const previousSemester = semesters[semesters.length - 2];
  
  // Calculate trend
  const getTrend = () => {
    if (!previousSemester) return { icon: Minus, color: 'text-gray-500', text: 'No data' };
    
    const difference = latestSemester.gpa - previousSemester.gpa;
    if (difference > 0.1) {
      return { icon: TrendingUp, color: 'text-green-600', text: 'Improving' };
    } else if (difference < -0.1) {
      return { icon: TrendingDown, color: 'text-red-600', text: 'Declining' };
    } else {
      return { icon: Minus, color: 'text-gray-500', text: 'Stable' };
    }
  };

  const trend = getTrend();
  const TrendIcon = trend.icon;
  const academicStatus = getAcademicStatus(cgpa);
  const classOfDegree = getClassOfDegree(cgpa);

  // Calculate required GPA for next semester (assuming 20 credit units)
  const nextSemesterCredits = 20;
  const requiredGPA = calculateRequiredGPA(
    cgpa, 
    academicRecord.total_credit_units, 
    targetGPA, 
    nextSemesterCredits
  );

  return (
    <div className="space-y-6">
      {/* CGPA Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Academic Performance Overview
          </CardTitle>
          <CardDescription>
            Your cumulative academic performance and current standing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CGPA Display */}
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {cgpa.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mb-1">
                Cumulative GPA
              </div>
              <div className="text-xs text-muted-foreground">
                Out of 4.0 scale
              </div>
            </div>

            {/* Academic Status */}
            <div className="text-center">
              <Badge 
                variant="outline" 
                className={`${academicStatus.color} border-current mb-2`}
              >
                {academicStatus.status}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {academicStatus.description}
              </div>
            </div>

            {/* Class of Degree */}
            <div className="text-center">
              <div className="text-lg font-semibold text-primary mb-1">
                {classOfDegree}
              </div>
              <div className="text-sm text-muted-foreground">
                Projected Class
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Academic Progress</span>
              <span>{((cgpa / 4.0) * 100).toFixed(1)}%</span>
            </div>
            <Progress value={(cgpa / 4.0) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Semester Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Recent Semester Performance
          </CardTitle>
          <CardDescription>
            Your performance in recent semesters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {semesters.slice(-2).map((semester, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">
                      {semester.level} {semester.semester} Semester
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {semester.session}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {semester.gpa.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      GPA
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {semester.total_credit_units} credit units completed
                </div>
              </div>
            ))}
          </div>

          {/* Trend Analysis */}
          {previousSemester && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                <span className="font-medium">Trend:</span>
                <span className={trend.color}>{trend.text}</span>
                {latestSemester.gpa !== previousSemester.gpa && (
                  <span className="text-muted-foreground">
                    ({latestSemester.gpa > previousSemester.gpa ? '+' : ''}
                    {(latestSemester.gpa - previousSemester.gpa).toFixed(2)})
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Target Achievement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Target Achievement
          </CardTitle>
          <CardDescription>
            Analysis for achieving your target GPA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Target CGPA:</span>
              <span className="text-lg font-bold text-primary">{targetGPA.toFixed(1)}</span>
            </div>
            
            {cgpa >= targetGPA ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <Award className="w-4 h-4" />
                  <span className="font-medium">Target Achieved!</span>
                </div>
                <div className="text-sm text-green-700 mt-1">
                  You have successfully achieved your target CGPA. Keep up the excellent work!
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium text-blue-800 mb-1">
                    Required Next Semester GPA:
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {requiredGPA > 4.0 ? 'Not Achievable' : requiredGPA.toFixed(2)}
                  </div>
                  {requiredGPA > 4.0 ? (
                    <div className="text-sm text-blue-700 mt-1">
                      Your target may need to be adjusted or achieved over multiple semesters.
                    </div>
                  ) : (
                    <div className="text-sm text-blue-700 mt-1">
                      Based on {nextSemesterCredits} credit units next semester
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Gap to target: {(targetGPA - cgpa).toFixed(2)} points
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademicPerformance;