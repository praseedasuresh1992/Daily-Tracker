const WorkspaceCategory = require(
  "../models/WorkspaceCategory"
);

const Workspace = require(
  "../models/Workspace"
);

// CREATE
exports.createCategory = async (req,res ) => {
  try {
    const { workspaceId } = req.params;

    const { name } = req.body;

    const workspace =
      await Workspace.findById(
        workspaceId
      );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const category =
      await WorkspaceCategory.create({
        name,
        workspace: workspaceId,
        createdBy: req.user._id,
      });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL
exports.getCategories = async (
  req,
  res
) => {
  try {
    const { workspaceId } = req.params;

    const categories =
      await WorkspaceCategory.find({
        workspace: workspaceId,
      }).sort({
        createdAt: -1,
      });

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE
exports.deleteCategory = async (
  req,
  res
) => {
  try {
    const { categoryId } = req.params;

    await WorkspaceCategory.findByIdAndDelete(
      categoryId
    );

    res.json({
      message: "Category deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};