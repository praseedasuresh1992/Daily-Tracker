const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profile: String,
  name: { type: String, required: true },
  workspace: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",}],
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetOTP: String,
  resetOTPExpire: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);