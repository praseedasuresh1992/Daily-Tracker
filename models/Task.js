const mongoose=require("mongoose");
const WorkspaceCategory = require("./WorkspaceCategory");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  title: String,
  description: String,
  amount: Number,

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  status: {
    type: String,
    default: "pending",
    enum: ["pending", "completed"],
  },

  // Workspace fields
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    default: null,
  },
  WorkspaceCategory:{
      type: mongoose.Schema.Types.ObjectId,
    ref: "WorkspaceCategory",
    default: null,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },

  dueDate: Date,
});
module.exports = mongoose.model("task", taskSchema);