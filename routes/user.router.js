const router = require('express').Router();
const auth  = require('../middleware/auth')
const userController = require('../controllers/user.controller')

router.post('/login',userController.login);
router.post('/signup',userController.signup);
router.put('/profileUpdate/:id',userController.profileUpdate);
router.get('/timeTable/:user_id',userController.timeTable);

router.get('/profile/:id',userController.profile);
router.get('/forgotpassword/:email',userController.forgotPassword);
router.put('/newpassword/:id',userController.newPassword);

module.exports = router;
