import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ModalComponent } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { ProgressStrip } from "../components/ui/progressStrip";

import { Loader } from "../icons/loading";

function KanbanBoard() {
  const [open, setOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState();
  const [update, setIsUpdate] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    const ws = io("http://localhost:3001");

    ws.on("connect", () => setSocket(ws));
    ws.on("sync:tasks", setTasks);
    ws.on("task:created", task => setTasks(p => [...p, task]));
    ws.on("task:updated", task =>
      setTasks(p => p.map(t => (t._id === task._id ? task : t)))
    );
    ws.on("task:deleted", id =>
      setTasks(p => p.filter(t => t._id !== id))
    );

    return () => ws.disconnect();
  }, []);

  function handleDrop(column) {
    if (!draggedTask || draggedTask.column === column) return;

    const updated = { ...draggedTask, column };

    setTasks(p =>
      p.map(t => (t._id === updated._id ? updated : t))
    );

    socket.emit("task:update", {
      id: updated._id,
      updates: { column },
    });

    setDraggedTask(null);
  }

  function editHandler(task) {
    setSelectedTask(task);
    setIsUpdate(true);
    setOpen(true);
  }

  function deleteHandler(task) {
    socket.emit("task:delete", { id: task._id });
  }

  if (!socket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Kanban Board</h1>
          <Button
            size="md"
            variant="secondary"
            text="Add Task"
            onclick={() => setOpen(true)}
          />
          <div className="mb-6">
         <ProgressStrip tasks={tasks} />
           </div>
        </div>


        <ModalComponent
          socket={socket}
          onclose={() => {
            setOpen(false);
            setIsUpdate(false);
            setSelectedTask(undefined);
          }}
          open={open}
          isUpdate={update}
          task={selectedTask}
        />

        <div className="grid md:grid-cols-3 gap-6">
          <Card
            column="todo"
            title="To Do"
            tasks={tasks.filter(t => t.column === "todo")}
            onEditTask={editHandler}
            onDeleteTask={deleteHandler}
            onDragStart={setDraggedTask}
            onDropTask={handleDrop}
          />

          <Card
            column="in-prog"
            title="In Progress"
            tasks={tasks.filter(t => t.column === "in-prog")}
            onEditTask={editHandler}
            onDeleteTask={deleteHandler}
            onDragStart={setDraggedTask}
            onDropTask={handleDrop}
          />

          <Card
            column="done"
            title="Completed"
            tasks={tasks.filter(t => t.column === "done")}
            onEditTask={editHandler}
            onDeleteTask={deleteHandler}
            onDragStart={setDraggedTask}
            onDropTask={handleDrop}
          />
        </div>
      </div>
    </div>
  );
}

export default KanbanBoard;
