import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./Modal";
import { io } from "socket.io-client";

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

      <Button onClick={() => setOpen(true)}>Add Task</Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        socket={socket}
      />

      <div className="mt-4 space-y-2">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="border rounded p-3"
          >
            <h3 className="font-medium">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <span className="text-xs">Priority: {task.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;
