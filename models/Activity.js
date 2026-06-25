const mongoose=require("mongoose")

const activitySchema = new mongoose.Schema(
{
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  action: String,
},
{ timestamps: true }
);