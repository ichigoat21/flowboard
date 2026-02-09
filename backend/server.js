import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Task } from "./db.js";
import { upload } from "./multer/upload.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.post("/task/upload", upload.single("file"), async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file" });
    }

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
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});


io.on("connection", async (socket) => {
  const tasks = await Task.find();
  socket.emit("sync:tasks", tasks);

  socket.on("task:create", async (data) => {
    const task = await Task.create(data);
    io.emit("task:created", task);
  });

  socket.on("task:update", async ({ id, updates }) => {
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    io.emit("task:updated", task);
  });

  socket.on("task:move", async ({ id, column }) => {
    const task = await Task.findByIdAndUpdate(
      id,
      { column },
      { new: true }
    );
    if (task) io.emit("task:moved", { id, column });
  });

  socket.on("task:delete", async ({ id }) => {
    await Task.findByIdAndDelete(id);
    io.emit("task:deleted", id);
  });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
