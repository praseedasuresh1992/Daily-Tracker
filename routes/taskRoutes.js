const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {authUser} = require("../middleware/authMiddleware");

const {
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getMonthlyCategorySummary,
  getPersonalTasks,
  getWorkspaceTasks,
  permanentDeleteTask,
  restoreTask,
  getTrashTasks,
  deleteAttachment,
  addAttachments
} = require("../controllers/taskControllers");

router.use(authUser);

// Create task 
router.post(
  "/",
  upload.array("attachments", 5),
  createTask
);

router.get("/personal", getPersonalTasks);

router.patch(
  "/:id/attachments",
 
  upload.array("attachments"),
  addAttachments
);

router.delete(
  "/:taskId/attachment/:attachmentId",
  
  deleteAttachment
);

// router.get("/trash", getTrashTasks);

router.get(
  "/workspace/:workspaceId",
  getWorkspaceTasks
);

router.put("/:id", updateTaskStatus);
router.put("/update/:id", updateTask);

router.put(
  "/restore/:id",
  restoreTask
);

router.delete("/:id", deleteTask);

router.delete(
  "/permanentDelete/:id",
  permanentDeleteTask
);

router.get(
  "/monthly-category",
  getMonthlyCategorySummary
);

module.exports = router;