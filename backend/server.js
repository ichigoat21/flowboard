import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv"
import { Task } from "./db.js";

dotenv.config()


mongoose.connect(process.env.MONGO_URL)


const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  const tasks = await Task.find()
  socket.emit("sync:tasks", tasks)

  socket.on("task:create", async (data)=> {
    const task = Task.create(data);
    io.emit("task:created", task)
  });

  socket.on("task:update", async ({ id, updates }) => {
    const task = await Task.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
  
    if (task) {
      io.emit("task:updated", task);
    }
  });
  
  socket.on("task:move", async ({ id, column }) => {
    const task = await Task.findByIdAndUpdate(
      id,
      { column },
      { new: true }
    );
  
    if (task) {
      io.emit("task:moved", { id, column });
    }
  });
  socket.on("task:delete", async (id) => {
    await Task.findByIdAndDelete(id);
    io.emit("task:deleted", id);
  });
  
});
