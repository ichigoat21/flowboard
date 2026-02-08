import { Paperclip } from "lucide-react"
import { CrossIcon } from "../../icons/crossIcon"
import { useEffect, useRef, useState } from "react"
import { InputComponent } from "./Input"
import { Button } from "./Button"
import Select from "react-select"

export function ModalComponent({ onclose, open, socket, isUpdate, task}) {


  const [priority, setPriority] = useState("low")
  const [state, setState] = useState("todo")
  const [fileName, setFileName] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState()

  const CATEGORY_OPTIONS = [
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
    { value: "bug", label: "Bug" },
    { value: "feature", label: "Feature" },
    { value: "research", label: "Research" },
  ]
  
  useEffect(() => {
    if (!open) return
  
    if (isUpdate && task) {
      setTitle(task.title ?? "")
      setDescription(task.description ?? "")
      setPriority(task.priority ?? "low")
      setState(task.column ?? "todo")
  
      if (task.category) {
        const matched = CATEGORY_OPTIONS.find(
          (c) => c.value === task.category
        )
        setCategory(matched || null)
      }
    } else {
      resetForm()
    }
  }, [open, isUpdate, task])

  function resetForm() {
    setTitle("")
    setDescription("")
    setPriority("low")
    setState("todo")
    setFileName("")
    setCategory(null)
  }
  
  

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setFileName(file?.name || "")
  }
  const data = {
    title : title,
    description : description,
    column : state,
    priority : priority,
    category: category?.value || null
  }


  function handleSubmit () {
    if(!isUpdate){
        socket.emit("task:create", data )
        onclose()
    } else {
        socket.emit("task:update", {
            id: task._id,
            updates: data,
          })
    }
    onclose()
    resetForm()

  }
  if (open === false ) return null

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">{isUpdate === true ? "Update" : "Add Task"}</h2>
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
            onchange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Task title"
            type="text"
            className="w-full h-11 px-4 rounded-lg border-2 border-slate-200 bg-white outline-none transition-all duration-200
              placeholder:text-slate-400
              hover:border-blue-400 hover:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
              focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
          />

          <InputComponent
            onchange={(e) => setDescription(e.target.value)}
            value={description}
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
          <div className="relative z-50">
            <label className="block text-sm font-medium text-slate-700 mb-2">
             Category
            </label>

            <Select
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={setCategory}
              placeholder="Select category"
              isClearable
              classNamePrefix="react-select"
              styles={{
               control: (base) => ({
              ...base,
              minHeight: "44px",
              borderRadius: "0.5rem",
              borderColor: "#e2e8f0",
              boxShadow: "none",
             "&:hover": { borderColor: "#60a5fa" },
             }),
            }}
            />
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
