const ActivityLog = require("../models/ActivityLog");

const createActivityLog = async ({
  workspace,
  user,
  task,
  action,
  taskTitle,
}) => {
  try {
    return await ActivityLog.create({
      workspace,
      user,
      task,
      action,
      taskTitle,
    });
  } catch (error) {
    console.error("Activity log error:", error);
  }const ActivityLog = require("../models/ActivityLog");

const createActivityLog = async ({
  workspace,
  user,
  task,
  action,
  taskTitle,
}) => {
  try {
    await ActivityLog.create({
      workspace,
      user,
      task,
      action,
      taskTitle,
    });
  } catch (error) {
    // Activity logging should never break the main task operation
    console.error("Activity Log Error:", error.message);
  }
};

module.exports = {
  createActivityLog,
};
};

module.exports = {
  createActivityLog,
};