const router = require('express').Router();
const libraryController = require('../controllers/library.controller');

router.post('/addbooks',libraryController.addBooks);
router.post('/adddept',libraryController.adddepartment);
router.post('/adddeptbooks',libraryController.booksindepartment);
router.post('/deletebooks',libraryController.deletebooks);
router.post('/getDepartments',libraryController.getDepartments)
router.post('/getBooks',libraryController.getBooks)

module.exports = router;