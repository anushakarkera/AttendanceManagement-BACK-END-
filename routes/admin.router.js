const router = require('express').Router();
const adminController = require('../controllers/admin.controller');

router.delete('/deleteuser',adminController.Deleteuser);
router.delete('/deletestudent',adminController.Deletestudent);
router.post('/addsubject',adminController.Addsubject);
router.post('/registerstudent',adminController.RegisterStudent);
//router.delete('/deletesubject',adminController.Deletesubject);
module.exports = router;