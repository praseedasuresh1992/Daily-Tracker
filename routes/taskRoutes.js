
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskControllers');

router.use(auth);

router.post('/', auth,createTask);
router.get('/', auth,getTasks);
router.put('/:id',auth, updateTask);
router.delete('/:id',auth, deleteTask);

module.exports = router;