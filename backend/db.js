import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: String,
      priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
      column: { type: String, required: true }, 
      category: String,
      attachments: [String],
    },
    { timestamps: true }
  );

  export const Task = mongoose.model("Task", TaskSchema);