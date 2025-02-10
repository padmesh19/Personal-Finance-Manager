const express = require('express'); 
const userController = require('../controllers/userController');
const userRouter = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

userRouter.get("/profile", authMiddleware, userController.viewProfile);
userRouter.put("/profile", authMiddleware, userController.updateProfile);
userRouter.delete("/profile", authMiddleware, userController.deleteProfile);

module.exports = userRouter;