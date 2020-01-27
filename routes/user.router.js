const express = require('express')
const router = express.Router()
const auth  = require('../middleware/auth')
//const user = require('../models/user.model')


const userController = require('../controllers/user.controller')

router.post('/login',userController.login);
router.post('/signup',userController.signup);
router.put('/profileupdate/:id',auth,userController.profileupdate)

module.exports = router
