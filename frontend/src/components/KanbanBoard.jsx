import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ModalComponent } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Loader } from "../icons/loading";

function KanbanBoard() {
  const [open, setOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState();
  const [update, setIsUpdate] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null)


  useEffect(() => {
    const ws = io("http://localhost:3001");

    ws.on("connect", () => {
      console.log("Connected:", ws.id);
      setSocket(ws);
    });

    ws.on("sync:tasks", (tasksFromServer) => {
      setTasks(tasksFromServer);
    });

    ws.on("task:created", (task) => {
      setTasks((prev) => [...prev, task]);
    });

    ws.on("task:updated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    });

    ws.on("task:deleted", (taskId) => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    });

    return () => {
      ws.disconnect();
    };
  }, []);

  function handleDrop(column) {
    if (!draggedTask) return
    if (draggedTask.column === column) return
  
    const updatedTask = {
      ...draggedTask,
      column,
    }
  
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    )
  
    socket.emit("task:update", {
      id: updatedTask._id,
      updates: { column },
    })
  
    setDraggedTask(null)
  }
  
  

  function modalHandler() {
    setOpen(false);
    setIsUpdate(false);
    setSelectedTask(undefined);
  }

  function editHandler(task) {
    setSelectedTask(task);
    setIsUpdate(true);
    setOpen(true);
  }
  function deleteHandler(task) {
    console.log("DELETE CLICKED", task);
    setSelectedTask(task);
    socket.emit("task:delete", { id: task._id });
  }

  if (!socket){
    return <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-slate-900">Kanban Board</h1>
      <Loader/>
    </div>
  }
  

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Kanban Board</h1>
          
          <Button
            size="md"
            variant="secondary"
            text="Add Task"
            onclick={() => {
              setOpen(true);
            }}
          />
        </div>

        <ModalComponent
          socket={socket}
          onclose={() => {
            modalHandler();
          }}
          open={open}
          isUpdate={update}
          task={selectedTask}
        />

        <div className="grid md:grid-cols-3 gap-6">
          <Card
            column="todo"
            title="To Do"
            tasks={tasks.filter((task) => task.column === "todo")}
            onEditTask={editHandler}
            onDeleteTask={deleteHandler}
            onDragStart={setDraggedTask}
            onDropTask={handleDrop}
          
          />

          <Card
            column="in-prog"
            title="In Progress"
            tasks={tasks.filter((task) => task.column === "in-prog")}
            onEditTask={editHandler}
            onDeleteTask={deleteHandler}
            onDragStart={setDraggedTask}
            onDropTask={handleDrop}
          
          />

          <Card
            column="done"
            title="Completed"
            tasks={tasks.filter((task) => task.column === "done")}
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