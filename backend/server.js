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

  const tasks = await Task.find();
  socket.emit("sync:tasks", tasks);


  socket.on("task:create", async (data) => {
    try {
      console.log("Received task:", data);

      const task = await Task.create(data);

      io.emit("task:created", task); 

      console.log("Task saved:", task._id);
    } catch (err) {
      console.error("Failed to create task:", err);
      socket.emit("error", "Task creation failed");
    }
  });



  socket.on("task:update", async ({ id, updates }) => {
    const task = await Task.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
      io.emit("task:updated", task);
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
  socket.on("task:delete", async ({id}) => {
    await Task.findByIdAndDelete(id);
    io.emit("task:deleted", id);
  });
  
});
