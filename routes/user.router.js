const router = require('express').Router();
const auth  = require('../middleware/auth')
const userController = require('../controllers/user.controller')

router.post('/login',userController.login);
router.post('/signup',userController.signup);
router.put('/profileupdate/:id',auth,userController.profileupdate);
router.get('/timeTable',userController.timeTable);
router.get('/profile/:id',userController.profile);
module.exports = router;
