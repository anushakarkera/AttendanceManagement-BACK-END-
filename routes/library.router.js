const router = require('express').Router();
const libraryController = require('../controllers/library.controller');

router.post('/addbooks',libraryController.addBooks);
router.post('/adddept',libraryController.adddepartment);
module.exports = router;