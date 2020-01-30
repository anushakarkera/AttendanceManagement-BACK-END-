//const express = require('express')
//const router = express.Router()
const router = require('express').Router();
const classController = require('../controllers/class.controller')

//class Routing
router.post('/attendance',classController.addAttendance);
router.post('/sendmessage',classController.sendMessage);
module.exports = router;

