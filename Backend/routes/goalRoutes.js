const express = require("express");
const goalController = require("../controllers/goalController");
const goalRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

goalRouter.get("/", authMiddleware, goalController.getGoals);
goalRouter.get("/:id", authMiddleware, goalController.getGoal);
goalRouter.post("/", authMiddleware, goalController.addGoal);
goalRouter.put("/:id", authMiddleware, goalController.updateGoal);
goalRouter.delete("/:id", authMiddleware, goalController.deleteGoal);

module.exports = goalRouter;
