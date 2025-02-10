const Category = require("../models/Category");

const categoryController = {
  // Get Categories
  getCategories: async (req, res) => {
    try {
      const user_id = req.user._id;
        const categories = await Category.aggregate([
            {
                $match: {
                    $or: [{ user_id: { $eq: null } }, { user_id: { $eq: user_id } }],
                }
            },
            {
                $sort: {
                    category_type: -1, name:1
                }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              category_type: 1,
              user_id:1
              }
            }
      ]);
      if (!categories) return res.status(404).json({ message: "No Data" });
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get Category
  getCategory: async (req, res) => {
    try {
      category_id = req.params.id;
      const category = await Category.findById(category_id).select("-__v");
      if (!category)
        return res.status(404).json({ message: "Category not found" });
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add Category
  addCategory: async (req, res) => {
    const { name, category_type } = req.body;
    try {
      const category = await Category.create({ name, category_type });
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update Category
  updateCategory: async (req, res) => {
    const { name, category_type } = req.body;
    try {
      const category_id = req.params.id;
      const category = await Category.findById(category_id);
      if (!category)
        return res.status(404).json({ message: "Category not found" });

      category.name = name || category.name;
      category.category_type = category_type || category.category_type;
      await category.save();

      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete Category
  deleteCategory: async (req, res) => {
    try {
      const category_id = req.params.id;
      await Category.findByIdAndDelete(category_id);
      res.status(200).json(category_id);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const income = ["Allowance", "Salary", "Bonus", "Others"];
      const expense = [
        "Food & Drinks",
        "Entertainment",
        "Transportation",
        "Household",
        "Beauty",
        "Health",
        "Education",
        "Bill & Utilities",
        "Investments",
        "Others",
      ];
      const Income = income.forEach(async (val) => {
        if (!(await Category.findOne({ category_type: "income", name: val }))) {
          return await Category.create({ category_type: "income", name: val });
        }
      });
      const Expense = expense.forEach(async (val) => {
        if (
          !(await Category.findOne({ category_type: "expense", name: val }))
        ) {
          await Category.create({ category_type: "expense", name: val });
        }
      });
      res.status(200).json({ message: "Default Category added successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = categoryController;
