const csv = require('csv-parser');
const fs = require('fs');
const Result = require('../models/Result');
const Student = require('../models/Student');

function gradeToPoints(grade) {
  if (!grade || typeof grade !== 'string') return 0;
  const normalizedGrade = grade.trim().toUpperCase();
  const gradeMap = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'F': 0 };
  return gradeMap[normalizedGrade] || 0;
}

function validateRowData(row) {
  const required = ['studentId', 'courseCode', 'grade', 'credit'];
  const missing = required.filter(field => !row[field]);
  if (missing.length > 0) {
    return { valid: false, error: `Missing required fields: ${missing.join(', ')}` };
  }
  
  const credit = Number(row.credit);
  if (isNaN(credit) || credit < 0) {
    return { valid: false, error: 'Credit must be a valid positive number' };
  }
  
  if (!gradeToPoints(row.grade)) {
    return { valid: false, error: `Invalid grade: ${row.grade}` };
  }
  
  return { valid: true };
}

function calculateGPA(courses) {
  if (!courses || courses.length === 0) return 0;
  
  const { totalCredit, totalPoints } = courses.reduce((acc, course) => {
    const credit = Number(course.credit) || 0;
    const points = gradeToPoints(course.grade) * credit;
    return {
      totalCredit: acc.totalCredit + credit,
      totalPoints: acc.totalPoints + points
    };
  }, { totalCredit: 0, totalPoints: 0 });
  
  return totalCredit > 0 ? Number((totalPoints / totalCredit).toFixed(2)) : 0;
}

function calculateCGPA(currentCourses, previousResults) {
  if (!previousResults || previousResults.length === 0) {
    return calculateGPA(currentCourses);
  }
  
  let cumCredit = 0;
  let cumPoints = 0;
  
  // Add current semester courses
  currentCourses.forEach(course => {
    const credit = Number(course.credit) || 0;
    cumCredit += credit;
    cumPoints += gradeToPoints(course.grade) * credit;
  });
  
  // Add previous results
  previousResults.forEach(result => {
    if (result.courses && Array.isArray(result.courses)) {
      result.courses.forEach(course => {
        const credit = Number(course.credit) || 0;
        cumCredit += credit;
        cumPoints += gradeToPoints(course.grade) * credit;
      });
    }
  });
  
  return cumCredit > 0 ? Number((cumPoints / cumCredit).toFixed(2)) : 0;
}

exports.uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'CSV file required' });
  }

  const results = [];
  const errors = [];

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (results.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty or invalid' });
    }

    const grouped = {};
    
    // Validate and group data
    results.forEach((row, index) => {
      const validation = validateRowData(row);
      if (!validation.valid) {
        errors.push({ 
          row: index + 1, 
          error: validation.error,
          data: row 
        });
        return;
      }
      
      const key = `${row.studentId}-${row.session}-${row.level}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(row);
    });

    // Process each student's results
    for (const [key, rows] of Object.entries(grouped)) {
      try {
        const [studentId, session, level] = key.split('-');
        
        if (!studentId || !session || !level) {
          errors.push({ key, error: 'Invalid key format in grouped data' });
          continue;
        }

        const courses = [];
        const carryOvers = [];

        rows.forEach(({ courseCode, grade, score, credit }) => {
          const numericCredit = Number(credit);
          if (grade === 'F') carryOvers.push(courseCode);
          courses.push({ 
            code: courseCode, 
            grade: grade.trim().toUpperCase(), 
            score: Number(score) || 0, 
            credit: numericCredit 
          });
        });

        const gpa = calculateGPA(courses);
        const prevResults = await Result.find({ studentId });
        const cgpa = calculateCGPA(courses, prevResults);

        await Result.create({ 
          studentId, 
          session, 
          level, 
          courses, 
          gpa, 
          cgpa, 
          published: true 
        });
        
        await Student.findByIdAndUpdate(studentId, { 
          gpa, 
          cgpa, 
          carryOvers 
        });

      } catch (err) {
        errors.push({ 
          key, 
          error: err.message,
          type: 'database_error'
        });
      }
    }

    // Clean up uploaded file
    try {
      fs.unlinkSync(req.file.path);
    } catch (cleanupErr) {
      console.warn('Failed to cleanup uploaded file:', cleanupErr.message);
    }

    res.json({ 
      message: 'Bulk upload complete', 
      processed: Object.keys(grouped).length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (err) {
    // Clean up uploaded file on error
    try {
      fs.unlinkSync(req.file.path);
    } catch (cleanupErr) {
      console.warn('Failed to cleanup uploaded file:', cleanupErr.message);
    }
    
    console.error('CSV upload error:', err);
    res.status(500).json({ 
      error: 'Failed to process CSV file', 
      details: err.message 
    });
  }
};
