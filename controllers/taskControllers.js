const Task = require('../models/Task');

// ----------Create task-------------------------
exports.createTask = async (req, res) => {
  const task = await Task.create({
    user: req.user.id,
    title: req.body.title,
    description:req.body.description,
    category:req.body.category,
    amount:req.body.amount,
    taskDate:req.body.taskDate

  });
  res.json(task);
};

//----------- Get tasks---------------------------
exports.getTasks = async (req, res) => {
  try {
    const { status } = req.query;
console.log("USER:", req.user);
    let filter = {
      user: req.user.id
    };

    // apply status filter if exists
    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter);

    res.json(tasks);
  } catch (error) {
    console.error(error); // 🔥 this will show real error
    res.status(500).json({ message: error.message });
  }
};

// -----------Update status-------------------------
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      id: req.params.id,
      user: req.user._id
    });``

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 🔥 Toggle here
    task.status = task.status === "done" ? "pending" : "done";

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//-------------Delete-------------------------------
exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
};