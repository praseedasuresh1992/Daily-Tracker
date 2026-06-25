const Category = require("../models/Category");

//  Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.create({
      name,
      user: req.user.id, // from auth middleware
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    category.name = name || category.name;

    const updated = await category.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await category.deleteOne();

    res.json({ message: "Category removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};