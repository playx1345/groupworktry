const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { uploadCSV } = require('../controllers/bulkResultController');
const auth = require('../middleware/auth');

router.post('/csv-upload', auth('admin'), upload.single('csvfile'), uploadCSV);

module.exports = router;