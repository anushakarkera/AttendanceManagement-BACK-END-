const router = require('express').Router();
const libraryController = require('../controllers/library.controller');

router.post('/addBooks',libraryController.addBooks);
router.post('/addDept',libraryController.addDepartment);
router.post('/adddeptBooks',libraryController.booksInDepartment);
router.post('/deleteBooks',libraryController.deleteBooks);
router.post('/getDepartments',libraryController.getDepartments)
router.post('/getBooks',libraryController.getBooks)

module.exports = router;