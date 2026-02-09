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
  const [isUploading, setIsUploading] = useState(false)
  const fileRef = useRef()

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
    if (fileRef.current) {
      fileRef.current.value = ""
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setFileName(file?.name || "")
  }

  const data = {
    title: title,
    description: description,
    column: state,
    priority: priority,
    category: category?.value || null
  }

  async function uploadFile(taskId) {
    if (!fileRef.current?.files[0]) return

    const formData = new FormData()
    formData.append("file", fileRef.current.files[0])
    formData.append("taskId", taskId)

    const response = await fetch("http://localhost:3001/task/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    return await response.json()
  }

  async function handleSubmit() {
    if (!title.trim()) {
      alert("Please enter a task title")
      return
    }

    setIsUploading(true)

    try {
      if (!isUpdate) {
        // CREATE NEW TASK
        socket.emit("task:create", data)

        // Wait for task to be created
        socket.once("task:created", async (createdTask) => {
          let uploadSuccess = true
          
          try {
            // Upload file if one was selected
            if (fileRef.current?.files[0]) {
              await uploadFile(createdTask._id)
            }
          } catch (error) {
            // File upload failed, but task was created
            uploadSuccess = false
            console.error("File upload failed:", error)
            alert("Task created but file upload failed. Please try uploading again by editing the task.")
          }

          // Close modal regardless (task was created)
          setIsUploading(false)
          onclose()
          resetForm()
        })
      } else {
        // UPDATE EXISTING TASK
        socket.emit("task:update", {
          id: task._id,
          updates: data,
        })

        // Upload new file if one was selected
        try {
          if (fileRef.current?.files[0]) {
            await uploadFile(task._id)
          }
          
          // Success! Close modal
          onclose()
          resetForm()
        } catch (error) {
          console.error("File upload failed:", error)
          alert("Task updated but file upload failed. Please try again.")
        } finally {
          setIsUploading(false)
        }
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("Failed to submit task. Please try again.")
      setIsUploading(false)
    }
  }

  if (open === false) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">
              {isUpdate ? "Update Task" : "Add Task"}
            </h2>
            <button
              onClick={onclose}
              disabled={isUploading}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
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
              disabled={isUploading}
              className="w-full h-11 px-4 rounded-lg border-2 border-slate-200 bg-white outline-none transition-all duration-200
                placeholder:text-slate-400
                hover:border-blue-400 hover:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
                focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]
                disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <InputComponent
              onchange={(e) => setDescription(e.target.value)}
              value={description}
              placeholder="Add a description"
              type="text"
              disabled={isUploading}
              className="w-full h-11 px-4 rounded-lg border-2 border-slate-200 bg-white outline-none transition-all duration-200
                placeholder:text-slate-400
                hover:border-blue-400 hover:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
                focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]
                disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={isUploading}
                />
                <Button
                  onclick={() => setPriority("medium")}
                  variant={priority === "medium" ? "primary" : "secondary"}
                  size="sm"
                  text="#medium"
                  disabled={isUploading}
                />
                <Button
                  onclick={() => setPriority("high")}
                  variant={priority === "high" ? "primary" : "secondary"}
                  size="sm"
                  text="#high"
                  disabled={isUploading}
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
                  disabled={isUploading}
                />
                <Button
                  onclick={() => setState("in-prog")}
                  variant={state === "in-prog" ? "b-clicked" : "blue"}
                  size="md"
                  text="In Progress"
                  disabled={isUploading}
                />
                <Button
                  onclick={() => setState("done")}
                  variant={state === "done" ? "g-clicked" : "green"}
                  size="md"
                  text="Completed"
                  disabled={isUploading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <Select
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={setCategory}
                placeholder="Select category"
                isClearable
                isDisabled={isUploading}
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Attachment
              </label>
              <input
                type="file"
                ref={fileRef}
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
                id="task-file-upload"
              />
              <label
                htmlFor="task-file-upload"
                className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border-2 border-dashed border-slate-300 text-slate-600 transition-all cursor-pointer
                  ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50'}`}
              >
                <Paperclip size={18} />
                <span className="text-sm font-medium">
                  {fileName || "Attach a file (image or PDF)"}
                </span>
              </label>
            </div>

            <Button
              onclick={handleSubmit}
              variant="primary"
              size="lg"
              disabled={isUploading}
              text={isUploading ? "Uploading..." : (isUpdate ? "Update Task" : "Submit Task")}
            />

            {isUploading && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-blue-500"></div>
                <span>Processing...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}