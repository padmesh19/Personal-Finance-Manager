const express = require('express'); 
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/logout", authController.logout);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.post("/forget-password", authController.forgetPassword);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.post("/mfa-enabled", authController.mfaEnabled);
authRouter.get("/user", authMiddleware, authController.me);


module.exports = authRouter;