const router = require('express').Router();
const classController = require('../controllers/class.controller')

//class Routing
router.post('/attendance',classController.addAttendance);
router.post('/sendmessage',classController.sendmessage);

module.exports = router;
