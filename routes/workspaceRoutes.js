const express = require("express");

const router = express.Router();

const {
  createWorkspace,
  joinWorkspace,
  getWorkspace,
  getMyWorkspaces,
} = require("../controllers/workspaceController");

const {authUser}=require("../middleware/authMiddleware")

router.post(
  "/create",
  authUser,
  createWorkspace
);

router.post(
  "/join/:inviteCode",
  authUser,
  joinWorkspace
);
router.get(
  "/my-workspaces",
  authUser,
  getMyWorkspaces
);
router.get(
  "/:workspaceId",
  authUser,
  getWorkspace
);



module.exports = router;