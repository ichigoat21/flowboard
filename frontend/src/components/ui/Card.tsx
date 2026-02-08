import { TaskCard } from "./Taskcard";


export function Card({ title, tasks }) {

    function onEditHandler(){
        console.log("edited")
    }
    function ondelHandler(){
        console.log("delted")
    }
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
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              ondelete={ondelHandler}
              onedit={onEditHandler}
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