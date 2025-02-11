const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const {
  EMAIL,
  EMAIL_PASSWORD,
  JWT_SECRET,
  FRONTEND_URL,
} = require("../utils/config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
};

const authController = {
  register: async (req, res) => {
    try {
      // get the details of the user from the request body
      const { name, email, password } = req.body;

      // check if the user already exists
      const user = await User.findOne({ email });

      // if the user exists, return an error
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create a new user object
      const newUser = new User({ name, email, password: hashedPassword, otp });

      // save the user to the database
      await newUser.save();

      const otpVerifyLink = `${FRONTEND_URL}/auth/otp-verification?email=${email}`;
      await transporter.sendMail({
        from: EMAIL,
        to: email,
        subject: "OTP Verification",
        html: `<p>Your OTP is <b>${otp}</b></p>
        <p>Click <a href="${otpVerifyLink}">here</a> to verify your email</p>`,
      });

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      // get the details of the user from the request body
      const { email, password } = req.body;

      // check if the user exists
      const user = await User.findOne({ email });

      // if the user does not exist, return an error
      if (!user) {
        return res.status(404).json({ message: "User does not exist" });
      }

      // check if the password is correct
      const isPasswordCorrect = await user.comparePassword(password);

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isVerified) {
        return res.status(401).json({ message: "Email not verified" });
      }

      if (user.mfaEnabled) {
        return res.status(200).json({ message: "mfa-enabled" });
      }

      // create a token
      const token = createToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      // return a success message
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      res
        .clearCookie("token", {
          httpOnly: true,
          sameSite: "Strict",
          maxAge: 0,
          expiresIn: 0,
        })
        .send({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });

      if (!user || user.otp !== otp)
        return res.status(400).json({ error: "Invalid OTP" });

      user.isVerified = true;
      user.otp = undefined;
      await user.save();

      res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenExpiry = Date.now() + 3600000; // 1 hour

      user.resetToken = resetToken;
      user.resetTokenExpiry = tokenExpiry;
      await user.save();
      const resetLink = `${FRONTEND_URL}/auth/reset-password?resetToken=${resetToken}`;

      await transporter.sendMail({
        from: EMAIL,
        to: user.email,
        subject: "Password Reset Request",
        html: `<h3>Click <a href="${resetLink}">here</a> to reset your password. The link expires in 1 hour.</h3>`,
      });

      res.json({ message: "Password reset email sent!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;
      const user = await User.findOne({
        resetToken,
        resetTokenExpiry: { $gt: Date.now() },
      });
      if (!user)
        return res.status(400).json({ error: "Invalid or expired token" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;

      await user.save();
      res.json({ message: "Password reset successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  me: async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  },
  mfaEnabled: async (req, res) => {
    try {
      const { email, mfaSecret } = req.body;
      const user = await User.findOne({ email });
      if (user.mfaSecret !== parseInt(mfaSecret)) {
        return res.status(401).json({ message: "Invalid Passcode" });
      }

      const token = createToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      // return a success message
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;
