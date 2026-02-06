import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()


async function db_connection() {
  await mongoose.connect(`mongodb+srv://shivresides:${process.env.MONGO_DB_PASS}@second-brain.4jq3gmh.mongodb.net/kanban`)
}

db_connection()


const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("message", ()=> {
    socket.emit("reply", "hi there")
  });
});
