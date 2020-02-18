const router = require('express').Router();
const libraryController = require('../controllers/library.controller');

router.post('/addBooks',libraryController.addBooks);
router.post('/addDept',libraryController.addDepartment);
router.post('/adddeptBooks',libraryController.booksInDepartment);
router.post('/deleteBooks',libraryController.deleteBooks);
router.post('/getDepartments',libraryController.getDepartments)
router.post('/getBooks',libraryController.getBooks)
router.post('/borrowBooks',libraryController.borrowBook)

module.exports = router;