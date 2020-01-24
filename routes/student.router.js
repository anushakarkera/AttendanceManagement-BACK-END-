const express = require('express')
const router = express.Router()
const ctrlStu = require('../controllers/student.controller');
// const studentController = require('../controllers/student.controller')

//student routing
router.get('/studentlist',ctrlStu.student);
module.exports = router
