const express = require('express');
const { createTask, getTasks ,updateTask,deleteTask} = require('../controllers/taskController');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.put('/', auth, updateTask); 
router.delete('/', auth, deleteTask);

module.exports = router;
