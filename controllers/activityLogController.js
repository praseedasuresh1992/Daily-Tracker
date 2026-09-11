const ActivityLog = require("../models/ActivityLog");

exports.getWorkspaceActivityLogs = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    console.log("WORKSPACE ID FROM URL:", workspaceId);

    const allActivities = await ActivityLog.find({});

    console.log("ALL ACTIVITY LOGS:", allActivities);

    const activities = await ActivityLog.find({
      workspace: workspaceId,
    });

    console.log("WORKSPACE ACTIVITIES:", activities);

    res.status(200).json(activities);
  } catch (error) {
    console.error("GET ACTIVITY LOG ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};