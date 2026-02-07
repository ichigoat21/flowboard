function TaskCard({ title, description, priority, state, fileName }) {
    const priorityColors = {
      low: "bg-emerald-50 text-emerald-600",
      medium: "bg-amber-50 text-amber-600",
      high: "bg-rose-50 text-rose-600"
    }
  
    const stateColors = {
      todo: "text-slate-500",
      "in-prog": "text-blue-500",
      done: "text-emerald-500"
    }
  
    const isCompleted = state === "done"
  
    return (
      <div className="group bg-white rounded-lg border border-slate-200/60 p-3 hover:border-slate-300 hover:shadow-sm transition-all duration-150 cursor-pointer">
        <div className="flex items-start gap-2.5">
          <div className="flex-shrink-0 mt-0.5">
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
              isCompleted 
                ? 'bg-emerald-500 border-emerald-500' 
                : 'border-slate-300 group-hover:border-slate-400'
            }`}>
              {isCompleted && (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
  
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium mb-1 ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
              {title}
            </h4>
            
            {description && (
              <p className="text-xs text-slate-500 mb-2 line-clamp-1">
                {description}
              </p>
            )}
  
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${priorityColors[priority] || priorityColors.low}`}>
                {priority}
              </span>
              
              {fileName && (
                <span className="px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 text-[10px] font-medium flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export function Card({ title, tasks }) {
    return (
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            {title}
          </h3>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {tasks?.length || 0}
          </span>
        </div>
        
        <div className="space-y-1.5">
          {tasks && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <TaskCard
                key={index}
                title={task.title}
                description={task.description}
                priority={task.priority}
                state={task.state}
                fileName={task.fileName}
              />
            ))
          ) : (
            <div className="bg-slate-50/50 rounded-lg border border-dashed border-slate-200 py-8 text-center">
              <svg className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-xs text-slate-400 font-medium">No tasks</p>
            </div>
          )}
        </div>
      </div>
    )
  }