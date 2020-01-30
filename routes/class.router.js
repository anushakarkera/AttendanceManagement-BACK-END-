const express = require('express')
const router = express.Router()
// const userController = require('../controllers/class.controller')

//class Routing
router.post('/attendance',classController.addAttendance);
router.post('/sendmessage',classController.sendmessage);

module.exports = router;

