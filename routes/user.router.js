const router = require('express').Router();
const auth  = require('../middleware/auth')
const userController = require('../controllers/user.controller')

router.post('/login',userController.login);
router.post('/signup',userController.signup);
router.put('/profileupdate/:id',userController.profileupdate);
router.get('/timeTable/:user_id',userController.timeTable);
router.post('/absentees',userController.absentees)

module.exports = router;
