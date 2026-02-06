import React, { useEffect } from "react";
import KanbanBoard from "./components/KanbanBoard";
import {io} from "socket.io-client"


const socket = io("http://localhost:3001");

function App() {
  useEffect(()=> {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("reply", (msg) => {
      console.log(msg);
    });

    socket.emit("message");

    return () => {
      socket.disconnect();
    };
  })
  return (
    <div className="App">
      <h1>Real-time Kanban Board</h1>
      <KanbanBoard />
    </div>
  );
}

export default App;
