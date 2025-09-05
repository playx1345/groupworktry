import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { SemesterResult } from "@/lib/gpaCalculator";
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface PerformanceChartsProps {
  semesters: SemesterResult[];
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ semesters }) => {
  // Prepare data for GPA trend chart
  const gpaData = semesters.map((semester, index) => ({
    semester: `${semester.level} ${semester.semester}`,
    gpa: semester.gpa,
    credits: semester.total_credit_units,
    index: index + 1
  }));

  // Prepare data for grade distribution
  const gradeDistribution = semesters.reduce((acc, semester) => {
    semester.courses.forEach(course => {
      acc[course.grade] = (acc[course.grade] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
    percentage: ((count / semesters.reduce((total, sem) => total + sem.courses.length, 0)) * 100).toFixed(1)
  }));

  // Colors for pie chart
  const gradeColors = {
    'A': '#22c55e', // green
    'B': '#3b82f6', // blue
    'C': '#f59e0b', // yellow
    'D': '#f97316', // orange
    'E': '#ef4444', // red
    'F': '#dc2626'  // dark red
  };

  // Custom tooltip for GPA chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            GPA: <span className="font-bold">{payload[0].value.toFixed(2)}</span>
          </p>
          <p className="text-gray-600">
            Credits: <span className="font-bold">{payload[0].payload.credits}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for grade distribution
  const GradeTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">Grade {payload[0].payload.grade}</p>
          <p className="text-blue-600">
            Count: <span className="font-bold">{payload[0].payload.count}</span>
          </p>
          <p className="text-gray-600">
            Percentage: <span className="font-bold">{payload[0].payload.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* GPA Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            GPA Trend Analysis
          </CardTitle>
          <CardDescription>
            Track your academic performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gpaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="semester" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis 
                  domain={[0, 4]}
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="gpa" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            This chart shows your GPA progression across semesters. Look for trends and patterns in your academic performance.
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Grade Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of your grades across all courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip content={<GradeTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Grade Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Grade Composition
            </CardTitle>
            <CardDescription>
              Percentage breakdown of your grades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {gradeData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={gradeColors[entry.grade as keyof typeof gradeColors] || '#94a3b8'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<GradeTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              {gradeData.map((grade) => (
                <div key={grade.grade} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ 
                      backgroundColor: gradeColors[grade.grade as keyof typeof gradeColors] || '#94a3b8' 
                    }}
                  />
                  <span>{grade.grade}: {grade.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Insights</CardTitle>
          <CardDescription>
            Key observations from your academic performance data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {semesters.length > 1 && (
              <>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium text-blue-800">
                    Best Performance: {Math.max(...semesters.map(s => s.gpa)).toFixed(2)} GPA
                  </div>
                  <div className="text-sm text-blue-700">
                    Achieved in {semesters.find(s => s.gpa === Math.max(...semesters.map(sem => sem.gpa)))?.level} {semesters.find(s => s.gpa === Math.max(...semesters.map(sem => sem.gpa)))?.semester} Semester
                  </div>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="font-medium text-green-800">
                    Total Credits Completed: {semesters.reduce((total, sem) => total + sem.total_credit_units, 0)}
                  </div>
                  <div className="text-sm text-green-700">
                    Across {semesters.length} semesters
                  </div>
                </div>

                {gradeData.find(g => g.grade === 'A') && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium text-yellow-800">
                      Excellence Rate: {gradeData.find(g => g.grade === 'A')?.percentage}%
                    </div>
                    <div className="text-sm text-yellow-700">
                      Percentage of courses with Grade A
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceCharts;