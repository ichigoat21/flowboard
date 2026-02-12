import { TaskCard } from "./Taskcard";

export function Card({
  title,
  column,
  tasks,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDropTask,
}) {
    
  return (
    <div
      className="w-full min-h-[200px]"
      onDragOver={(e) => e.preventDefault()} 
      onDrop={() => onDropTask(column)}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {tasks?.length || 0}
        </span>
      </div>

      <div className="space-y-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onedit={() => onEditTask(task)}
              ondelete={() => onDeleteTask(task)}
              onDragStart={onDragStart}
            />
          ))
        ) : (
          <div className="bg-slate-50/50 rounded-lg border border-dashed border-slate-200 py-8 text-center">
            <p className="text-xs text-slate-400 font-medium">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
