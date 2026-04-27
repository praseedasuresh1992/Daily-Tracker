// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  category: {
    type: String
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },

  status: {
    type: String,
    enum: ['pending', 'done'],
    default: 'pending'
  },

  taskDate: {
    type: Date,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);