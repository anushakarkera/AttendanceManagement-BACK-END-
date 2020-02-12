const router = require('express').Router();
const adminController = require('../controllers/admin.controller');

router.delete('/delete',adminController.Deleteuser);
module.exports = router;