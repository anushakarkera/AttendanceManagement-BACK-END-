const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const ctrlStu = require('../controllers/student.controller');
// const studentController = require('../controllers/student.controller')

//student routing
router.get('/list', auth, ctrlStu.student);
module.exports = router;
