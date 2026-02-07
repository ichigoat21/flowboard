import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ModalComponent } from "./ui/Modal";
import { InputComponent } from "./ui/Input";
import { Button } from "./ui/Button";


function KanbanBoard() {
  const [open, setOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const ws = io("http://localhost:3001");

    ws.on("connect", () => {
      console.log("Connected:", ws.id);
      setSocket(ws);
    });

    // initial sync
    ws.on("sync:tasks", (tasksFromServer) => {
      setTasks(tasksFromServer);
    });

    // realtime updates
    ws.on("task:created", (task) => {
      setTasks((prev) => [...prev, task]);
    });

    return () => {
      ws.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Kanban Board</h2>
      <Button text=" Add Task" />
      <InputComponent type="text" placeholder="Go to gym"/>
      <ModalComponent/>
    </div>
  );
}

export default KanbanBoard;
