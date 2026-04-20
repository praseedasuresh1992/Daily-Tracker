const Task = require('../models/Task');

// ----------Create task-------------------------
exports.createTask = async (req, res) => {
  const task = await Task.create({
    user: req.user.id,
    title: req.body.title,
    description:req.body.description
  });
  res.json(task);
};

//----------- Get tasks---------------------------
exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
};

// -----------Update status-------------------------
exports.updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: 'Task not found' });

  task.status = req.body.status || task.status;
  await task.save();

  res.json(task);
};

//-------------Delete-------------------------------
exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
};