const router = require('express').Router();
const auth  = require('../middleware/auth')
const userController = require('../controllers/user.controller')

router.post('/login',userController.login);
router.post('/signup',userController.signup);
router.post('/profileUpdate',userController.profileUpdate);
router.post('/timeTable',userController.timeTable);
router.post('/profile',userController.profile);
router.post('/forgotPassword',userController.forgotPassword);
router.post('/newPassword',userController.newPassword);

module.exports = router;
