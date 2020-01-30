const router = require('express').Router();
const classController = require('../controllers/class.controller')
//const userController = require('../controllers/user.controller')
//class Routing
router.post('/attendance',classController.addAttendance);
module.exports = router;
