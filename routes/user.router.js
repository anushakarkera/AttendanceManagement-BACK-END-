const router = require('express').Router();
const auth  = require('../middleware/auth')
const userController = require('../controllers/user.controller')

router.post('/login',userController.login);
router.post('/signup',userController.signup);
router.post('/profileUpdate',userController.profileUpdate);
router.post('/timeTable',userController.timeTable);
router.post('/timeTable/list', userController.classTimetableList);
router.post('/profile',userController.profile);
router.post('/forgotpassword',userController.forgotPassword);
router.post('/newpassword',userController.newPassword);

module.exports = router;
