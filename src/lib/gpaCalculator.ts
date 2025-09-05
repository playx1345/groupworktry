// GPA Calculator utility for the Plateau Result Hub

export interface CourseResult {
  course_code: string;
  course_title: string;
  credit_unit: number;
  score: number;
  grade: string;
  grade_point: number;
}

export interface SemesterResult {
  semester: 'First' | 'Second';
  level: 'ND1' | 'ND2';
  session: string;
  courses: CourseResult[];
  gpa: number;
  total_credit_units: number;
  total_grade_points: number;
}

export interface StudentAcademicRecord {
  semesters: SemesterResult[];
  cgpa: number;
  total_credit_units: number;
  total_grade_points: number;
}

// Grade to Grade Point mapping (Nigerian polytechnic system)
export const gradeToGradePoint = (score: number): { grade: string; gradePoint: number } => {
  if (score >= 80) return { grade: 'A', gradePoint: 4.0 };
  if (score >= 70) return { grade: 'B', gradePoint: 3.0 };
  if (score >= 60) return { grade: 'C', gradePoint: 2.0 };
  if (score >= 50) return { grade: 'D', gradePoint: 1.0 };
  if (score >= 40) return { grade: 'E', gradePoint: 0.5 };
  return { grade: 'F', gradePoint: 0.0 };
};

// Calculate GPA for a single semester
export const calculateSemesterGPA = (courses: CourseResult[]): SemesterResult => {
  let totalGradePoints = 0;
  let totalCreditUnits = 0;

  const processedCourses = courses.map(course => {
    const { grade, gradePoint } = gradeToGradePoint(course.score);
    const weightedGradePoints = gradePoint * course.credit_unit;
    
    totalGradePoints += weightedGradePoints;
    totalCreditUnits += course.credit_unit;

    return {
      ...course,
      grade,
      grade_point: gradePoint
    };
  });

  const gpa = totalCreditUnits > 0 ? totalGradePoints / totalCreditUnits : 0;

  return {
    semester: 'First', // This should be set by the caller
    level: 'ND1', // This should be set by the caller
    session: '', // This should be set by the caller
    courses: processedCourses,
    gpa: Math.round(gpa * 100) / 100, // Round to 2 decimal places
    total_credit_units: totalCreditUnits,
    total_grade_points: totalGradePoints
  };
};

// Calculate CGPA (Cumulative GPA) across multiple semesters
export const calculateCGPA = (semesters: SemesterResult[]): StudentAcademicRecord => {
  let totalGradePoints = 0;
  let totalCreditUnits = 0;

  semesters.forEach(semester => {
    totalGradePoints += semester.total_grade_points;
    totalCreditUnits += semester.total_credit_units;
  });

  const cgpa = totalCreditUnits > 0 ? totalGradePoints / totalCreditUnits : 0;

  return {
    semesters,
    cgpa: Math.round(cgpa * 100) / 100,
    total_credit_units: totalCreditUnits,
    total_grade_points: totalGradePoints
  };
};

// Determine class of degree based on CGPA
export const getClassOfDegree = (cgpa: number): string => {
  if (cgpa >= 3.5) return 'Distinction';
  if (cgpa >= 3.0) return 'Upper Credit';
  if (cgpa >= 2.5) return 'Lower Credit';
  if (cgpa >= 2.0) return 'Pass';
  return 'Fail';
};

// Calculate required GPA for next semester to achieve target CGPA
export const calculateRequiredGPA = (
  currentCGPA: number,
  currentTotalCredits: number,
  targetCGPA: number,
  nextSemesterCredits: number
): number => {
  const currentTotalGradePoints = currentCGPA * currentTotalCredits;
  const requiredTotalGradePoints = targetCGPA * (currentTotalCredits + nextSemesterCredits);
  const requiredNextSemesterGradePoints = requiredTotalGradePoints - currentTotalGradePoints;
  
  return nextSemesterCredits > 0 ? requiredNextSemesterGradePoints / nextSemesterCredits : 0;
};

// Get academic status based on CGPA
export const getAcademicStatus = (cgpa: number): {
  status: string;
  color: string;
  description: string;
} => {
  if (cgpa >= 3.5) {
    return {
      status: 'Excellent',
      color: 'text-green-600',
      description: 'Outstanding academic performance'
    };
  }
  if (cgpa >= 3.0) {
    return {
      status: 'Very Good',
      color: 'text-blue-600',
      description: 'Very good academic performance'
    };
  }
  if (cgpa >= 2.5) {
    return {
      status: 'Good',
      color: 'text-yellow-600',
      description: 'Good academic performance'
    };
  }
  if (cgpa >= 2.0) {
    return {
      status: 'Satisfactory',
      color: 'text-orange-600',
      description: 'Satisfactory academic performance'
    };
  }
  return {
    status: 'Needs Improvement',
    color: 'text-red-600',
    description: 'Academic performance needs improvement'
  };
};