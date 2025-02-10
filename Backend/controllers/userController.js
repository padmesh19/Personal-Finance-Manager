const User = require("../models/User");

const userController = {
  // View Profile
  viewProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password -__v");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update Profile
  updateProfile: async (req, res) => {
    let { name, email, currency, mfaEnabled, mfaSecret } = req.body;
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.name = name || user.name;
      user.email = email || user.email;
      user.currency = currency || user.currency;
      user.mfaEnabled = mfaEnabled || user.mfaEnabled;
      user.mfaSecret = mfaSecret || user.mfaSecret;

      await user.save();

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete Profile
  deleteProfile: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.user.id);
      res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
