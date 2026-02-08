import { Paperclip } from "lucide-react"
import { CrossIcon } from "../../icons/crossIcon"
import { useRef, useState } from "react"
import { InputComponent } from "./Input"
import { Button } from "./Button"

export function ModalComponent({ onclose, open, socket, isUpdate}) {


  const [priority, setPriority] = useState("low")
  const [state, setState] = useState("todo")
  const [fileName, setFileName] = useState("")

  const titleRef = useRef()
  const descRef = useRef()
  const fileInputRef = useRef()

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setFileName(file?.name || "")
  }
  const data = {
    title : titleRef.current?.value,
    description : descRef.current?.value,
    column : state,
    priority : priority,
  }

  function handleSubmit () {
    socket.emit("task:create", data )
    onclose()
  }
  if (open === false ) return null

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Add Task</h2>
          <button
            onClick={onclose}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Close modal"
          > 
            <CrossIcon />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <InputComponent
            reference={titleRef}
            placeholder="Task title"
            type="text"
            className="w-full h-11 px-4 rounded-lg border-2 border-slate-200 bg-white outline-none transition-all duration-200
              placeholder:text-slate-400
              hover:border-blue-400 hover:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
              focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
          />

          <InputComponent
            reference={descRef}
            placeholder="Add a description"
            type="text"
            className="w-full h-11 px-4 rounded-lg border-2 border-slate-200 bg-white outline-none transition-all duration-200
              placeholder:text-slate-400
              hover:border-blue-400 hover:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
              focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Priority
            </label>
            <div className="flex gap-2">
              <Button
                onclick={() => setPriority("low")}
                variant={priority === "low" ? "primary" : "secondary"}
                size="sm"
                text="#low"
              />
              <Button
                onclick={() => setPriority("medium")}
                variant={priority === "medium" ? "primary" : "secondary"}
                size="sm"
                text="#medium"
              />
              <Button
                onclick={() => setPriority("high")}
                variant={priority === "high" ? "primary" : "secondary"}
                size="sm"
                text="#high"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <div className="flex gap-2">
              <Button
                onclick={() => setState("todo")}
                variant={state === "todo" ? "r-clicked" : "red"}
                size="md"
                text="Todo"
              />
              <Button
                onclick={() => setState("in-prog")}
                variant={state === "in-prog" ? "b-clicked" : "blue"}
                size="md"
                text="In Progress"
              />
              <Button
                onclick={() => setState("done")}
                variant={state === "done" ? "g-clicked" : "green"}
                size="md"
                text="Completed"
              />
            </div>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="task-file-upload"
            />
            <label
              htmlFor="task-file-upload"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer"
            >
              <Paperclip size={18} />
              <span className="text-sm font-medium">
                {fileName || "Attach a file"}
              </span>
            </label>
          </div>

          <Button
            onclick={handleSubmit}
            variant="primary"
            size="lg"
            text={`${isUpdate === true ? "Update Task" : "Submit Task"}`}
          />
        </div>
      </div>
    </div>
  </div>
}
