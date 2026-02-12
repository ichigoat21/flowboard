import { Bar } from "react-chartjs-2";
import "../../utils/chartsetup";

export function ProgressStrip({ tasks }) {
  const total = tasks.length;
  const done = tasks.filter(t => t.column === "done").length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const counts = { todo: 0, "in-prog": 0, done: 0 };
  tasks.forEach(t => counts[t.column]++);

  const data = {
    labels: ["Todo", "In-Prog", "Done"],
    datasets: [
      {
        data: [counts.todo, counts["in-prog"], counts.done],
        backgroundColor: [
          "rgb(244 63 94)",
          "rgb(59 130 246)",
          "rgb(16 185 129)",
        ],
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div 
    data-testid="progress-strip"
    className="flex items-center gap-6 bg-white border border-slate-200 rounded-xl px-4 py-3">
      <div className="flex-1">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">{percent}% finished</p>
      </div>

      <div className="w-32 h-12">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
