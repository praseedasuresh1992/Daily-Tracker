const ActivityLog = require("../models/ActivityLog");

exports.getWorkspaceActivityLogs = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const activities = await ActivityLog.find({
            workspace: workspaceId,
        })
            .populate("user", "name email")
            .populate("task", "title")
            .sort({ createdAt: -1 });

        res.status(200).json(activities);

    } catch (error) {
        console.error("GET ACTIVITY LOG ERROR:", error);

        res.status(500).json({
            message: error.message,
        });
    }
};