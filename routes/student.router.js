const router = require('express').Router();
// const auth  = require('../middleware/auth');
const studentController = require('../controllers/student.controller')

//student routing
router.post('/list',studentController.list);
router.post('/getAttendanceHistory',studentController.getAttendanceHistory)
module.exports = router;
