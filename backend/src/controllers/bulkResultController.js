const csv = require('csv-parser');
const fs = require('fs');
const Result = require('../models/Result');
const Student = require('../models/Student');

function gradeToPoints(grade) {
  return { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'F': 0 }[grade] || 0;
}

exports.uploadCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'CSV file required' });
  const results = [];
  const errors = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', async () => {
      const grouped = {};
      results.forEach(row => {
        const key = `${row.studentId}-${row.session}-${row.level}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(row);
      });
      for (const [key, rows] of Object.entries(grouped)) {
        const [studentId, session, level] = key.split('-');
        let courses = [];
        let totalCredit = 0, totalPoints = 0, carryOvers = [];
        rows.forEach(({ courseCode, grade, score, credit }) => {
          credit = Number(credit);
          totalCredit += credit;
          const points = gradeToPoints(grade) * credit;
          totalPoints += points;
          if (grade === 'F') carryOvers.push(courseCode);
          courses.push({ code: courseCode, grade, score, credit });
        });
        const gpa = totalCredit ? totalPoints / totalCredit : 0;
        let cgpa = gpa;
        try {
          const prevResults = await Result.find({ studentId });
          if (prevResults.length) {
            let cumCredit = totalCredit, cumPoints = totalPoints;
            prevResults.forEach(r => {
              cumCredit += r.courses.reduce((sum, c) => sum + c.credit, 0);
              cumPoints += r.courses.reduce((sum, c) => gradeToPoints(c.grade) * c.credit + sum, 0);
            });
            cgpa = cumCredit ? cumPoints / cumCredit : 0;
          }
          await Result.create({ studentId, session, level, courses, gpa, cgpa, published: true });
          await Student.findByIdAndUpdate(studentId, { gpa, cgpa, carryOvers });
        } catch (err) {
          errors.push({ key, error: err.message });
        }
      }
      res.json({ message: 'Bulk upload complete', errors });
    });
};
