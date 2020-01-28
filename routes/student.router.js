const router = require('express').Router();
// const auth  = require('../middleware/auth');
const studentController = require('../controllers/student.controller')

//student routing
router.get('/list/:classSubject_id',studentController.list);
module.exports = router;
