const router = require('express').Router();
const libraryController = require('../controllers/library.controller');

router.post('/addbooks',libraryController.addBooks);
router.post('/adddept',libraryController.adddepartment);
router.post('/adddeptbooks',libraryController.booksindepartment);
router.post('/deletebooks',libraryController.deletebooks);
module.exports = router;