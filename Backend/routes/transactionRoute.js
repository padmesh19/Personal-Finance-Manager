const express = require("express");
const transactionController = require("../controllers/transactionController");
const transactionRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

transactionRouter.get("/", authMiddleware, transactionController.getTransactions);
transactionRouter.get(
  "/download",
  authMiddleware,
  transactionController.exportTransactions
);
transactionRouter.get("/:id", authMiddleware, transactionController.getTransaction);
transactionRouter.post("/", authMiddleware, transactionController.addTransaction);
transactionRouter.put(
  "/:id",
  authMiddleware,
  transactionController.updateTransaction
);
transactionRouter.delete(
  "/:id",
  authMiddleware,
  transactionController.deleteTransaction
);

module.exports = transactionRouter;
