const express = require('express');
const router = express.Router();
const { addSchool, listSchools } = require('../controllers/schoolController');
const { validateAddSchool, validateListSchools } = require('../middleware/validateSchool');

// Route to add a school
router.post('/addSchool', validateAddSchool, addSchool);

// Route to list schools sorted by distance
router.get('/listSchools', validateListSchools, listSchools);

module.exports = router;
