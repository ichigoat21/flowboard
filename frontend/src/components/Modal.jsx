import { useRef, useState } from "react";
import { CrossIcon } from "../icons/crossIcon";
import { Button } from "./Button";
import { Input } from "./Input";

export function Modal({ open, onClose, socket }) {
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const categoryRef = useRef(null);

  const [priority, setPriority] = useState("medium");
  const [column, setColumn] = useState("todo");


  function submitTask() {
    console.log(titleRef.current.value)
    const task = {
      title: titleRef.current?.value,
      description: descRef.current?.value,
      category: categoryRef.current?.value,
      priority,
      column,
    };

    socket.emit("task:create", task)

    console.log(task);
    onClose?.();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <p className="text-lg font-medium text-gray-900">Add Task</p>
          <div onClick={onClose} className="cursor-pointer">
            <CrossIcon />
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-3">
          <Input reference={titleRef} placeholder="Title" />
          <Input reference={descRef} placeholder="Description" />
          <Input reference={categoryRef} placeholder="Category" />

          {/* Priority */}
          <div className="flex gap-2">
            {["low", "medium", "high"].map((p) => (
              <Button
                key={p}
                size="sm"
                variant={priority === p ? "primary" : "plain"}
                onClick={() => setPriority(p)}
              >
                {p}
              </Button>
            ))}
          </div>

          {/* Column */}
          <div className="flex gap-2">
            {["todo", "doing", "done"].map((c) => (
              <Button
                key={c}
                size="sm"
                variant={column === c ? "primary" : "plain"}
                onClick={() => setColumn(c)}
              >
                {c}
              </Button>
            ))}
          </div>

          {/* Attachment placeholder */}
          <div className="flex items-center gap-2 mt-2 text-blue-500 cursor-pointer hover:text-blue-600 transition">
            <span className="text-lg">📎</span>
            <span className="text-sm">Add attachment</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t">
          <Button size="md" variant="primary" onClick={submitTask} className="w-full">
            Add Task
          </Button>
        </div>

      </div>
    </div>
  );
}
