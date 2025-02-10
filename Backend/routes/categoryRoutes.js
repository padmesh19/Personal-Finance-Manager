const express = require("express");
const categoryController = require("../controllers/categoryController");
const categoryRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

categoryRouter.get("/", authMiddleware, categoryController.getCategories);
categoryRouter.get("/:id", authMiddleware, categoryController.getCategory);
categoryRouter.post("/", authMiddleware, categoryController.addCategory);
categoryRouter.put("/:id", authMiddleware, categoryController.updateCategory);
categoryRouter.delete(
  "/:id",
  authMiddleware,
  categoryController.deleteCategory
);
categoryRouter.post("/create", categoryController.createCategory);

module.exports = categoryRouter;
