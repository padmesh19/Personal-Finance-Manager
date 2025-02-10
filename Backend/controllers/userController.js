const Budget = require("../models/Budget");
const Category = require("../models/Category");
const Goal = require("../models/Goal");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const deleteAlldata = async (id) => {
  try {
    await Transaction.deleteMany({ user_id: id });
    await Budget.deleteMany({ user_id: id });
    await Goal.deleteMany({ user_id: id });
    await Category.deleteMany({ user_id: id });
    return true;
  } catch (err) {
    return false;
  }
};

const userController = {
  // View Profile
  viewProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password -__v");
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
      user.mfaEnabled =
        mfaEnabled === user.mfaEnabled ? user.mfaEnabled : mfaEnabled;
      user.mfaSecret = user.mfaEnabled === true ? mfaSecret : null;

      await user.save();

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete Profile
  deleteProfile: async (req, res) => {
    try {
      if (deleteAlldata(req.user._id)) {
        await User.findByIdAndDelete(req.user._id);
        return res.status(200).json({ message: "Profile deleted successfully" });
      } else {
        res.status(409).json({message: "Cannot delete profile.. Try again later"})
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
