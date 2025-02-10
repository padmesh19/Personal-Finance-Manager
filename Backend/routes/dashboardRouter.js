const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const dashboardRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

dashboardRouter.get("/", authMiddleware, dashboardController.fetchData);

module.exports = dashboardRouter;
