import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Task } from "./db.js";
import { upload } from "./multer/uploads.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
mongoose.connect(process.env.MONGO_URL);

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(cors());
app.use(express.json());


app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, "uploads")));

const io = new Server(server, { cors: { origin: "*" } });

function toPlain(doc) {
  const obj = doc.toObject({ versionKey: false });
  obj._id = String(obj._id);
  if (Array.isArray(obj.attachments)) {
    obj.attachments = obj.attachments.map((a) => ({
      _id:  a._id ? String(a._id) : undefined,
      url:  a.url,
      type: a.type,
      name: a.name,
    }));
  }
  return obj;
}

app.post("/task/upload", upload.single("file"), async (req, res) => {
  try {
    const { taskId } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file" });

    const attachment = {
      url:  `/uploads/${req.file.filename}`,
      type: req.file.mimetype.startsWith("image") ? "image" : "pdf",
      name: req.file.originalname,
    };

    const task = await Task.findByIdAndUpdate(
      taskId,
      { $push: { attachments: attachment } },
      { new: true }
    );

    const plain = toPlain(task);
    console.log("[upload] task:updated attachments:", plain.attachments);
    io.emit("task:updated", plain);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

io.on("connection", async (socket) => {
  const tasks = await Task.find();
  socket.emit("sync:tasks", tasks.map(toPlain));

  socket.on("task:create", async (data) => {
    const task = await Task.create(data);
    io.emit("task:created", toPlain(task));
  });

  socket.on("task:update", async ({ id, updates }) => {
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    io.emit("task:updated", toPlain(task));
  });

  socket.on("task:move", async ({ id, column }) => {
    const task = await Task.findByIdAndUpdate(id, { column }, { new: true });
    if (task) io.emit("task:moved", { id: String(task._id), column });
  });

  socket.on("task:delete", async ({ id }) => {
    await Task.findByIdAndDelete(id);
    io.emit("task:deleted", String(id));
  });
});

server.listen(3001, () => {
  console.log("Server running");
});