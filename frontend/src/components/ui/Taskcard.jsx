export function TaskCard({ title, description, priority, state, fileName }) {
    const priorityColors = {
      low: "bg-green-100 text-green-700 border-green-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      high: "bg-red-100 text-red-700 border-red-200"
    }
  
    const stateColors = {
      todo: "bg-rose-50 text-rose-600",
      "in-prog": "bg-blue-50 text-blue-600",
      done: "bg-emerald-50 text-emerald-600"
    }
  
    const stateLabels = {
      todo: "To Do",
      "in-prog": "In Progress",
      done: "Completed"
    }
  
    const isCompleted = state === "done"
  
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-base font-semibold text-slate-900 flex-1">
            {title}
          </h3>
          
          <div className="flex items-center gap-2">
            {isCompleted && (
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        </div>
  
        {description && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {description}
          </p>
        )}
  
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${priorityColors[priority] || priorityColors.low}`}>
            #{priority}
          </span>
          
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${stateColors[state] || stateColors.todo}`}>
            {stateLabels[state] || state}
          </span>
  
          {fileName && (
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
              📎 {fileName}
            </span>
          )}
        </div>
      </div>
    )
  }