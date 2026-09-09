const ActivityLog = require("../models/ActivityLog");

exports.getWorkspaceActivityLogs = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const activities = await ActivityLog.find({
            workspace: workspaceId,
        })
            .populate("User", "name email")
            .populate("Task", "title")
            .sort({ createdAt: -1 });
        console.log("ACTIVITIES:", activities);
        res.status(200).json(activities);

    } catch (error) {
        console.error("GET ACTIVITY LOG ERROR:", error);

        res.status(500).json({
            message: error.message,
        });
    }
};