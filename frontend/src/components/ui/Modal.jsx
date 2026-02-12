import { Paperclip, X, FileText, ImageIcon } from "lucide-react"
import { CrossIcon } from "../../icons/crossIcon"
import { useEffect, useRef, useState } from "react"
import { InputComponent } from "./Input"
import { Button } from "./Button"
import Select from "react-select"

export function ModalComponent({ onclose, open, socket, isUpdate, task }) {
  const [priority, setPriority] = useState("low")
  const [state, setState] = useState("todo")
  const [fileName, setFileName] = useState("")
  const [filePreview, setFilePreview] = useState(null)  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState()
  const [isUploading, setIsUploading] = useState(false)
  const fileRef = useRef()

  const CATEGORY_OPTIONS = [
    { value: "work",     label: "Work" },
    { value: "personal", label: "Personal" },
    { value: "bug",      label: "Bug" },
    { value: "feature",  label: "Feature" },
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
        const matched = CATEGORY_OPTIONS.find((c) => c.value === task.category)
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
    setFilePreview(null)
    setCategory(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  function clearFile(e) {
    e.preventDefault()
    e.stopPropagation()
    setFileName("")
    setFilePreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setFilePreview({ url, type: "image" })
    } else {
      setFilePreview({ type: "pdf", name: file.name })
    }
  }

  const data = {
    title,
    description,
    column: state,
    priority,
    category: category?.value || null,
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
    if (!response.ok) throw new Error("Upload failed")
    return await response.json()
  }

  function waitForTaskCreated() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        socket.off("task:created", handler)
        reject(new Error("Timed out waiting for task creation"))
      }, 8000)
      function handler(createdTask) {
        clearTimeout(timeout)
        resolve(createdTask)
      }
      socket.once("task:created", handler)
    })
  }

  async function handleSubmit() {
    if (!title.trim()) {
      alert("Please enter a task title")
      return
    }
    setIsUploading(true)
    try {
      if (!isUpdate) {
        const createdTaskPromise = waitForTaskCreated()
        socket.emit("task:create", data)
        const createdTask = await createdTaskPromise
        if (fileRef.current?.files[0]) {
          try {
            await uploadFile(createdTask._id)
          } catch (error) {
            console.error("File upload failed:", error)
            alert("Task created but file upload failed. Please try uploading again by editing the task.")
          }
        }
        setIsUploading(false)
        onclose()
        resetForm()
      } else {
        socket.emit("task:update", { id: task._id, updates: data })
        try {
          if (fileRef.current?.files[0]) await uploadFile(task._id)
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

  const existingAttachments = isUpdate && task?.attachments?.length > 0 ? task.attachments : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl flex flex-col max-h-[92vh]">


          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
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

        
          <div className="overflow-y-auto flex-1">
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                <div className="flex gap-2">
                  <Button onclick={() => setPriority("low")}    variant={priority === "low"    ? "primary" : "secondary"} size="sm" text="#low"    disabled={isUploading} />
                  <Button onclick={() => setPriority("medium")} variant={priority === "medium" ? "primary" : "secondary"} size="sm" text="#medium" disabled={isUploading} />
                  <Button onclick={() => setPriority("high")}   variant={priority === "high"   ? "primary" : "secondary"} size="sm" text="#high"   disabled={isUploading} />
                </div>
              </div>

            
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <div className="flex gap-2">
                  <Button onclick={() => setState("todo")}    variant={state === "todo"    ? "r-clicked" : "red"}  size="md" text="Todo"        disabled={isUploading} />
                  <Button onclick={() => setState("in-prog")} variant={state === "in-prog" ? "b-clicked" : "blue"} size="md" text="In Progress" disabled={isUploading} />
                  <Button onclick={() => setState("done")}    variant={state === "done"    ? "g-clicked" : "green"} size="md" text="Completed"  disabled={isUploading} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Attachment</label>

                <input
                  type="file"
                  ref={fileRef}
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                  id="task-file-upload"
                />

              
                {filePreview ? (
                  <div className="rounded-xl border-2 border-slate-200 overflow-hidden">
                    {filePreview.type === "image" ? (
                      <div className="relative group">
                        <img
                          src={filePreview.url}
                          alt={fileName}
                          className="w-full max-h-48 object-cover"
                        />
                      
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <label
                            htmlFor="task-file-upload"
                            className="px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow transition-colors"
                          >
                            Change
                          </label>
                          <button
                            onClick={clearFile}
                            className="px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 shadow transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                     
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50">
                        <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                          <FileText size={16} className="text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{fileName}</p>
                          <p className="text-xs text-slate-400 mt-0.5">PDF Document</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <label
                            htmlFor="task-file-upload"
                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer transition-colors"
                            title="Change file"
                          >
                            <ImageIcon size={14} />
                          </label>
                          <button
                            onClick={clearFile}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                            title="Remove file"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  
                    {filePreview.type === "image" && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border-t border-slate-100">
                        <ImageIcon size={12} className="text-slate-400 shrink-0" />
                        <span className="text-xs text-slate-500 truncate flex-1">{fileName}</span>
                        <button
                          onClick={clearFile}
                          className="p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  
                  <label
                    htmlFor="task-file-upload"
                    className={`flex flex-col items-center justify-center gap-1.5 w-full py-5 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition-all cursor-pointer
                      ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/40"}`}
                  >
                    <Paperclip size={20} className="mb-0.5" />
                    <span className="text-sm font-medium">Attach a file</span>
                    <span className="text-xs text-slate-400">Image or PDF</span>
                  </label>
                )}

                
                {existingAttachments.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <p className="text-xs font-medium text-slate-500">
                      Current attachments ({existingAttachments.length})
                    </p>
                    {existingAttachments.map((att, i) => {
                      const url = `http://localhost:3001${att.url}`;
                      return (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                          {att.type === "image" ? (
                            <img
                              src={url}
                              alt={att.name}
                              className="w-9 h-9 rounded-md object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-md bg-red-50 flex items-center justify-center shrink-0">
                              <FileText size={15} className="text-red-400" />
                            </div>
                          )}
                          <span className="text-xs text-slate-600 truncate flex-1">{att.name}</span>
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-500 hover:text-blue-700 shrink-0 font-medium"
                          >
                            Open
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

  
              <Button
                onclick={handleSubmit}
                variant="primary"
                size="lg"
                disabled={isUploading}
                text={isUploading ? "Uploading…" : isUpdate ? "Update Task" : "Submit Task"}
              />

              {isUploading && (
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-blue-500" />
                  <span>Processing…</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}