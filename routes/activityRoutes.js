const express = require("express");

const router = express.Router();

const { authUser } = require("../middleware/authMiddleware");

const {
    getWorkspaceActivityLogs,
} = require("../controllers/activityLogController");

router.get(
    "/:workspaceId/activity",
    authUser,
    getWorkspaceActivityLogs
);

module.exports = router;