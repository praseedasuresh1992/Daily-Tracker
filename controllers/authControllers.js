const User = require('../models/User');
const Task = require("../models/Task");
const Category = require("../models/Category");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");



const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};



// Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // 🔥 file from multer
    const profileImage = req.file ? req.file.filename : null;

    // ✅ validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profile: profileImage,
    });

    res.status(201).json({
      message: "Registered Successfully",
      token: generateToken(user._id),
      user, // ✅ includes profile
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      token: generateToken(user._id),
    });
    

  } catch (error) {
    console.error(error); // 🔥 THIS will show real issue
    res.status(500).json({ message: "Something went wrong", });
  }
};

// getUser
exports.getUser=async (req, res)=>{
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
}

// Update User Profile

exports.updateUser = async (req, res) => {
  try {
    const { name, email, oldPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 Update basic fields
    user.name = name || user.name;
    user.email = email || user.email;

    // 🔹 Password change logic
    if (oldPassword || newPassword || confirmPassword) {

      // All fields required
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          message: "All password fields are required",
        });
      }

      // Check old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Please add the correct previous password",
        });
      }

      // Check new password match
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          message: "New password and confirm password do not match",
        });
      }

      // Hash new password
      user.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// verify password
exports.verifyPassword = async (req, res) => {
  try {
    const { oldPassword } = req.body;

    // logged in user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Previous password is incorrect",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password verified",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// Delete User Account


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete all user's tasks
    await Task.deleteMany({ user: userId });

    // Delete all user's categories
    await Category.deleteMany({ user: userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message:
        "Account and related data deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// sent otp 


exports.sendResetOTP = async (req, res) => {

  try {

    const { email } = req.body;

    // check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // generate otp
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // save otp
    user.resetOTP = otp;

    user.resetOTPExpire =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    // transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PWD,
      },
    });

    // send mail
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",

      html: `
        <h2>Password Reset Request</h2>

        <p>Your OTP for password reset is:</p>

        <h1>${otp}</h1>

        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("OTP Mail:", info);

    res.json({
      message: "OTP sent to registered email",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Reset password
exports.resetPasswordOTP = async (req, res) => {

  try {

    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // hash new password
    user.password = await bcrypt.hash(
      password,
      10
    );

    // clear otp
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};