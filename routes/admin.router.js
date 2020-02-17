const router = require('express').Router();
const adminController = require('../controllers/admin.controller');

router.delete('/deleteUser',adminController.deleteUser);
router.delete('/deleteStudent',adminController.deleteStudent);
router.post('/addSubject',adminController.addSubject);
router.post('/registerStudent',adminController.registerStudent);
router.post('/assignTimeTable',adminController.assignTimeTable);
router.post('/getStudentDetails',adminController.getStudentDetails);
module.exports = router;