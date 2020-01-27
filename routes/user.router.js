const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.controller')

router.post('/login',userController.login);
router.post('/signup',userController.signup);
router.put('/profileupdate/:id',userController.profileupdate)

router.get('/profile/:id',userController.profile);

module.exports = router
