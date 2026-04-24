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
    required: true,          // make false if optional
    min: 0                   // no negative values
  },

  status: { 
    type: String,
    enum: ['pending', 'done'],
    default: 'pending'
  }

}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);