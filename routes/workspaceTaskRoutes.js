const express = require("express");
const router = express.Router();

const { authUser } = require("../middleware/authMiddleware");

const {
  createWorkspaceTask,
  getWorkspaceTasks,
  getMemberTasks,
} = require("../controllers/workspaceTaskControllers");

router.post(
  "/:workspaceId/tasks",
  authUser,
  createWorkspaceTask
);

router.get(
  "/:workspaceId/tasks",
  authUser,
  getWorkspaceTasks
);
router.get(
  "/:workspaceId/member/:memberId/tasks",
  authUser,
  getMemberTasks
);

module.exports = router;