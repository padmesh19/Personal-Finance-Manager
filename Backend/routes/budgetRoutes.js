const express = require("express");
const budgetController = require("../controllers/budgetController");
const budgetRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

budgetRouter.get("/", authMiddleware, budgetController.getBudgets);
budgetRouter.post("/", authMiddleware, budgetController.addBudget);
budgetRouter.put("/:id", authMiddleware, budgetController.updateBudget);
budgetRouter.delete(
  "/:id",
  authMiddleware,
  budgetController.deleteBudget
);
budgetRouter.get(
  "/download",
  authMiddleware,
  budgetController.exportBudgets
);

module.exports = budgetRouter;
