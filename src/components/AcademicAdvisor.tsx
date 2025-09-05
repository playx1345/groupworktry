import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Target,
  BookOpen,
  Clock
} from "lucide-react";
import { StudentAcademicRecord, getAcademicStatus } from "@/lib/gpaCalculator";

interface AcademicAdvisorProps {
  academicRecord: StudentAcademicRecord;
  studentLevel: 'ND1' | 'ND2';
}

const AcademicAdvisor: React.FC<AcademicAdvisorProps> = ({ 
  academicRecord, 
  studentLevel 
}) => {
  const { cgpa, semesters } = academicRecord;
  const latestSemester = semesters[semesters.length - 1];
  const academicStatus = getAcademicStatus(cgpa);

  // Generate personalized recommendations
  const getRecommendations = () => {
    const recommendations = [];
    
    // CGPA-based recommendations
    if (cgpa < 2.0) {
      recommendations.push({
        type: 'urgent',
        icon: AlertTriangle,
        title: 'Academic Improvement Required',
        description: 'Your CGPA is below the minimum requirement. Consider seeking academic support.',
        actions: ['Meet with academic advisor', 'Join study groups', 'Attend remedial classes']
      });
    } else if (cgpa < 2.5) {
      recommendations.push({
        type: 'warning',
        icon: Target,
        title: 'Focus on Grade Improvement',
        description: 'Work towards improving your grades to achieve a better class of degree.',
        actions: ['Prioritize weak subjects', 'Improve study habits', 'Seek tutoring help']
      });
    } else if (cgpa >= 3.5) {
      recommendations.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Excellent Performance',
        description: 'Maintain your outstanding performance and consider leadership opportunities.',
        actions: ['Maintain current study methods', 'Consider peer tutoring', 'Explore advanced topics']
      });
    }

    // Performance trend recommendations
    if (semesters.length > 1) {
      const previousSemester = semesters[semesters.length - 2];
      const trendDifference = latestSemester.gpa - previousSemester.gpa;
      
      if (trendDifference < -0.2) {
        recommendations.push({
          type: 'warning',
          icon: TrendingUp,
          title: 'Declining Performance Trend',
          description: 'Your recent semester GPA has decreased. Take action to reverse this trend.',
          actions: ['Analyze what changed', 'Reassess study schedule', 'Identify problem areas']
        });
      } else if (trendDifference > 0.2) {
        recommendations.push({
          type: 'success',
          icon: TrendingUp,
          title: 'Improving Performance',
          description: 'Great job on improving your performance! Keep up the momentum.',
          actions: ['Continue current strategies', 'Share study methods with peers', 'Set higher goals']
        });
      }
    }

    // Level-specific recommendations
    if (studentLevel === 'ND1') {
      recommendations.push({
        type: 'info',
        icon: BookOpen,
        title: 'Foundation Building',
        description: 'Focus on building strong fundamentals as you progress through ND1.',
        actions: ['Master core concepts', 'Develop good study habits', 'Build professional network']
      });
    } else {
      recommendations.push({
        type: 'info',
        icon: Target,
        title: 'Preparation for Career',
        description: 'As an ND2 student, start preparing for your career transition.',
        actions: ['Build portfolio projects', 'Seek internship opportunities', 'Develop soft skills']
      });
    }

    // Course performance recommendations
    if (latestSemester) {
      const failedCourses = latestSemester.courses.filter(course => course.grade === 'F');
      const poorPerformanceCourses = latestSemester.courses.filter(course => 
        course.grade === 'D' || course.grade === 'E'
      );
      
      if (failedCourses.length > 0) {
        recommendations.push({
          type: 'urgent',
          icon: AlertTriangle,
          title: 'Failed Courses Attention',
          description: `You have ${failedCourses.length} failed course(s). Plan for retakes immediately.`,
          actions: ['Register for retakes', 'Get additional help', 'Create intensive study plan']
        });
      }
      
      if (poorPerformanceCourses.length > 0) {
        recommendations.push({
          type: 'warning',
          icon: BookOpen,
          title: 'Weak Subject Areas',
          description: `Focus on improving in ${poorPerformanceCourses.length} course(s) with low grades.`,
          actions: ['Review course materials', 'Attend office hours', 'Form study groups']
        });
      }
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'urgent': return 'destructive';
      case 'warning': return 'default';
      case 'success': return 'default';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'success': return 'text-green-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Academic Advisor Recommendations
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your academic performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon;
              return (
                <Alert key={index} variant={getAlertVariant(rec.type)}>
                  <IconComponent className={`h-4 w-4 ${getTypeColor(rec.type)}`} />
                  <AlertDescription>
                    <div className="space-y-3">
                      <div>
                        <div className="font-semibold mb-1">{rec.title}</div>
                        <div className="text-sm">{rec.description}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Recommended Actions:</div>
                        <ul className="text-sm space-y-1">
                          {rec.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Academic Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Academic Milestones
          </CardTitle>
          <CardDescription>
            Track your progress towards academic goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CGPA Milestones */}
              <div className="space-y-3">
                <h4 className="font-medium">CGPA Milestones</h4>
                <div className="space-y-2">
                  {[
                    { threshold: 2.0, label: 'Pass', achieved: cgpa >= 2.0 },
                    { threshold: 2.5, label: 'Lower Credit', achieved: cgpa >= 2.5 },
                    { threshold: 3.0, label: 'Upper Credit', achieved: cgpa >= 3.0 },
                    { threshold: 3.5, label: 'Distinction', achieved: cgpa >= 3.5 }
                  ].map((milestone) => (
                    <div key={milestone.threshold} className="flex items-center justify-between">
                      <span className="text-sm">{milestone.label} ({milestone.threshold.toFixed(1)})</span>
                      {milestone.achieved ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="space-y-3">
                <h4 className="font-medium">Academic Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Status</span>
                    <Badge variant="outline" className={academicStatus.color}>
                      {academicStatus.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Semesters Completed</span>
                    <span className="font-medium">{semesters.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Credits</span>
                    <span className="font-medium">{academicRecord.total_credit_units}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademicAdvisor;