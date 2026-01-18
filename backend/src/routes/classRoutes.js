const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.post('/create', classController.createClass);
router.get('/:id', classController.getClass);
router.get('/:id/attendance', classController.getAttendance);

module.exports = router;
