const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
      default: null,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "created",
        "updated",
        "completed",
        "reopened",
        "deleted",
        "restored",
        "permanently_deleted",
      ],
    },

    taskTitle: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);