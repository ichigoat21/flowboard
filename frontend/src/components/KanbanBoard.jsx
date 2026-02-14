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
  const [synced, setSynced] = useState(false);

  const todoTasks = tasks.filter(t => t.column === "todo")
  const inProgTasks = tasks.filter(t => t.column === "in-prog")
  const doneTasks = tasks.filter(t => t.column === "done")

  useEffect(() => {
   
    console.log()

    const ws = io(import.meta.env.VITE_SERVER_URL);
    ws.on("connect", () => setSocket(ws));
    ws.on("sync:tasks", (incoming) => {
      setTasks(incoming.map((t) => ({ ...t, _id: String(t._id) })));
      setSynced(true);
    });
    ws.on("task:created", (task) => {
      const normalised = { ...task, _id: String(task._id) };
      setTasks((prev) => {
        const exists = prev.some((t) => t._id === normalised._id);
        if (exists) return prev;
        return [...prev, normalised];
      });
    });
    ws.on("task:updated", (task) => {
      const normalised = { ...task, _id: String(task._id) };
      setTasks((p) =>
        p.map((t) => (String(t._id) === normalised._id ? normalised : t))
      );
    });
    ws.on("task:moved", ({ id, column }) => {
      setTasks((p) =>
        p.map((t) => (String(t._id) === String(id) ? { ...t, column } : t))
      );
    });
    ws.on("task:deleted", (id) => {
      setTasks((p) => p.filter((t) => String(t._id) !== String(id)));
    });
    return () => ws.disconnect();
  }, []);

  function handleDrop(column) {
    if (!draggedTask || draggedTask.column === column) return;
    const updated = { ...draggedTask, column };
    setTasks((p) =>
      p.map((t) => (String(t._id) === String(updated._id) ? updated : t))
    );
    socket.emit("task:update", { id: updated._id, updates: { column } });
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

  return (
    <div className="flex h-screen w-full flex-col gap-8 overflow-auto p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <ProgressStrip tasks={tasks} />
          <Button text="Add Task" onclick={() => setOpen(true)} variant="primary" size="md" />
        </div>
      </div>

      {(!socket || !synced) ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
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

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Card
              title="To Do"
              tasks={todoTasks}
              column='todo'
              onEditTask={editHandler}
              onDeleteTask={deleteHandler}
              onDragStart={setDraggedTask}
              onDropTask={handleDrop}
            />
            <Card
              title="In Progress"
              tasks={inProgTasks}
              column='in-prog'
              onEditTask={editHandler}
              onDeleteTask={deleteHandler}
              onDragStart={setDraggedTask}
              onDropTask={handleDrop}
            />
            <Card
              title="Completed"
              column='done'
              tasks={doneTasks}
              onEditTask={editHandler}
              onDeleteTask={deleteHandler}
              onDragStart={setDraggedTask}
              onDropTask={handleDrop}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default KanbanBoard;