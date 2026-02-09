import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  url: String,
  type: {
    type: String,
    enum: ["image", "pdf"],
  },
  name: String,
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  column: String,
  priority: String,
  category: String,
  attachments: [attachmentSchema],
});

export const Task = mongoose.model("Task", taskSchema);
