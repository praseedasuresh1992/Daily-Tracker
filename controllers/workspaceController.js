const Workspace = require("../models/Workspace");
const User = require("../models/User");
const crypto = require("crypto");

exports.createWorkspace = async (req, res) => {
  try {

    const { name } = req.body;

    const inviteCode = crypto.randomBytes(3).toString("hex");

    const workspace = await Workspace.create({
      name,

      owner: req.user.id,

      inviteCode,

      members: [
        {
          user: req.user.id,
          role: "owner",
        },
      ],
    });

    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        workspaces: workspace._id,
      },
    });

    res.json(workspace);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Join Workspace
exports.joinWorkspace = async (req, res) => {
  try {

    const { inviteCode } = req.params;

    // Find workspace
    const workspace = await Workspace.findOne({
      inviteCode,
    });

    // Workspace not found
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // Check already member
    const alreadyMember = workspace.members.find(
      (member) =>
        member.user.toString() === req.user.id
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "Already joined",
      });
    }

    // Add member
    workspace.members.push({
      user: req.user.id,
      role: "member",
    });

    await workspace.save();

    // Update user
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        workspaces: workspace._id,
      },
    });

    res.status(200).json({
      message: "Joined successfully",
      workspace,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
// get workspace
exports.getWorkspace = async (req, res) => {

  try {

    const workspace = await Workspace
      .findById(req.params.workspaceId)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    res.json(workspace);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.getMyWorkspaces = async (req, res) => {
  try {

    console.log("User:", req.user);

    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    });

    res.json(workspaces);

  } catch (error) {

    console.error("Workspace Error:", error);

    res.status(500).json({
      message: error.message,
    });

  }
};

