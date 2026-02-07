import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ModalComponent } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";


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


    ws.on("sync:tasks", (tasksFromServer) => {
      setTasks(tasksFromServer);
    });


    ws.on("task:created", (task) => {
      setTasks((prev) => [...prev, task]);
    });

    return () => {
      ws.disconnect();
    };
  }, []);

  function modalHandler(){
    setOpen(!open)
  }

  return (
    <div className="h-screen w-screen  bg-[#F3F3F3]">
      <h2>Kanban Board</h2>
      <Button size="md" variant="secondary" text="Add Task" onclick={()=> {setOpen(true)}} />
      <ModalComponent socket={socket} onclose={()=> {modalHandler()}} open={open}/>
        <div className="grid md:grid-cols-3">
        <div className="grid md:grid-cols-3 gap-6 mt-6 px-6">
       <Card
        title="To Do"
        tasks={tasks.filter(task => task.column === "todo")}
       />

      <Card
       title="In Progress"
       tasks={tasks.filter(task => task.column === "in-prog")}
      />

      <Card
      title="Completed"
       tasks={tasks.filter(task => task.column === "done")}
      />
      </div>

        </div>
    </div>
  );
}

export default KanbanBoard;
