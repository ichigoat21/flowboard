import { Router } from "express";
import { upload } from "../multer/upload.js";
import { Task } from "../db.js";

export const fileRouter = Router();

export function registerFileRoutes(io) {
  fileRouter.post("/task/upload", upload.single("file"), async (req, res) => {
    const { taskId } = req.body;

    const attachment = {
      url: `/uploads/${req.file.filename}`,
      type: req.file.mimetype.startsWith("image") ? "image" : "pdf",
      name: req.file.originalname,
    };

    const task = await Task.findByIdAndUpdate(
      taskId,
      { $push: { attachments: attachment } },
      { new: true }
    );

    io.emit("task:updated", task);
    res.json(task);
  });

  return fileRouter;
}
