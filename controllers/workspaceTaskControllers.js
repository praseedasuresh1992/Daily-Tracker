const Task = require("../models/Task");
const Workspace = require("../models/Workspace");

exports.createWorkspaceTask = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const {
      title,
      description,
      amount,
      category,
      assignedTo,
      priority,
      dueDate,
    } = req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const task = await Task.create({
      title,
      description,
      amount,
      category,
      assignedTo,
      priority,
      dueDate,

      workspace: workspaceId,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
  console.log(error);
  console.log(error.response?.data);
}
};

exports.getMemberTasks = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;

    const tasks = await Task.find({
      workspace: workspaceId,
      assignedTo: memberId,
    })
      .populate("assignedTo", "name email")
      .populate("category", "name");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getWorkspaceTasks = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const tasks = await Task.find({
      workspace: workspaceId,
    }).populate("user", "name email");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};