export function ProgressBar({ tasks }) {
    const total = tasks.length;
    const done = tasks.filter(t => t.column === "done").length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  
    return (
      <div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs mt-1 text-slate-600">{percent}% completed</p>
      </div>
    );
  }
  