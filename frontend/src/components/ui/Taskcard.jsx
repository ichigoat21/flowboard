export function TaskCard({
    task,
    onedit,
    ondelete,
    onDragStart,
  }) {
    const priorityColors = {
      low: "bg-green-100 text-green-700 border-green-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      high: "bg-red-100 text-red-700 border-red-200",
    }
  
    const stateColors = {
      todo: "bg-rose-50 text-rose-600",
      "in-prog": "bg-blue-50 text-blue-600",
      done: "bg-emerald-50 text-emerald-600",
    }
  
    const stateLabels = {
      todo: "To Do",
      "in-prog": "In Progress",
      done: "Completed",
    }
  
    const isCompleted = task.column === "done"
  
    return (
      <div
        draggable
        onDragStart={() => onDragStart(task)}
        className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-grab active:cursor-grabbing"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-base font-semibold text-slate-900 flex-1">
            {task.title}
          </h3>
  
          <div className="flex items-center gap-1">
            {onedit && (
              <button
                onClick={onedit}
                className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700"
              >
                ✏️
              </button>
            )}
  
            {ondelete && (
              <button
                onClick={ondelete}
                className="p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-600"
              >
                🗑️
              </button>
            )}
  
            {isCompleted && (
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 ml-1">
                ✓
              </div>
            )}
          </div>
        </div>
  
        {task.description && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}
  
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${priorityColors[task.priority]}`}>
            #{task.priority}
          </span>
  
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${stateColors[task.column]}`}>
            {stateLabels[task.column]}
          </span>
        </div>
      </div>
    )
  }
  