import { useState } from "react";

function AttachmentLightbox({ attachments, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex);
  const file = attachments[current];
  const fullUrl = `http://localhost:3001${file.url}`;
  const total = attachments.length;

  function prev(e) { e.stopPropagation(); setCurrent((c) => (c - 1 + total) % total); }
  function next(e) { e.stopPropagation(); setCurrent((c) => (c + 1) % total); }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>

      {total > 1 && (
        <button onClick={prev} className="absolute left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}

      <div className="relative max-w-4xl max-h-[85vh] mx-16 flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
        {file.type === "image" ? (
          <img key={current} src={fullUrl} alt={file.name} className="max-w-full max-h-[75vh] rounded-xl object-contain shadow-2xl" style={{ animation: "fadeIn 0.18s ease" }} />
        ) : (
          <div className="bg-white rounded-xl shadow-2xl w-[600px] max-w-full" style={{ animation: "fadeIn 0.18s ease" }}>
            <iframe src={fullUrl} title={file.name} className="w-full h-[70vh] rounded-xl" />
          </div>
        )}
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-sm font-medium truncate max-w-xs">{file.name}</span>
          {total > 1 && <span className="text-white/40 text-xs">{current + 1} / {total}</span>}
        </div>
        {total > 1 && (
          <div className="flex gap-2">
            {attachments.map((a, i) => {
              const u = `http://localhost:3001${a.url}`;
              return (
                <button key={i} onClick={() => setCurrent(i)} className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === current ? "border-white scale-110" : "border-white/20 opacity-60 hover:opacity-90"}`}>
                  {a.type === "image" ? (
                    <img src={u} alt={a.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="white" strokeWidth="2" strokeLinecap="round"/><path d="M14 2v6h6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {total > 1 && (
        <button onClick={next} className="absolute right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}

export function TaskCard({ task, onedit, ondelete, onDragStart }) {
  const [lightbox, setLightbox] = useState(null);

  const priorityColors = {
    low:    "bg-green-100 text-green-700 border-green-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    high:   "bg-red-100 text-red-700 border-red-200",
  };
  const stateColors = {
    todo:     "bg-rose-50 text-rose-600",
    "in-prog":"bg-blue-50 text-blue-600",
    done:     "bg-emerald-50 text-emerald-600",
  };
  const stateLabels = {
    todo:     "To Do",
    "in-prog":"In Progress",
    done:     "Completed",
  };

  const isCompleted = task.column === "done";


  const attachments = (task.attachments || []).filter(
    (a) => a && typeof a.url === "string" && a.url.length > 0
  );
  console.log(attachments)
  const images = attachments.filter((a) => a.type === "image");
  const pdfs   = attachments.filter((a) => a.type === "pdf");

  return (
    <>
      {lightbox !== null && (
        <AttachmentLightbox
          attachments={attachments}
          initialIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}

      <div
        draggable
        onDragStart={() => onDragStart(task)}
        className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing overflow-hidden"
      >
 
        {images.length > 0 && (
          <div className={`relative w-full overflow-hidden ${images.length === 1 ? "h-40" : "h-28"}`}>
            {images.length === 1 ? (
              <button
                className="w-full h-full block group relative"
                onClick={() => setLightbox(attachments.indexOf(images[0]))}
                draggable={false}
              >
                <img
                  src={`http://localhost:3001${images[0].url}`}
                  alt={images[0].name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div style={{ display: "none" }} className="w-full h-full bg-slate-100 items-center justify-center text-xs text-slate-400">
                  Image unavailable
                </div>
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-1.5 shadow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="#1e293b" strokeWidth="2"/>
                      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </button>
            ) : (
              <div className={`grid h-full gap-0.5 ${images.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                {images.slice(0, 3).map((img, i) => {
                  const isExtra = i === 2 && images.length > 3;
                  return (
                    <button
                      key={i}
                      className="relative overflow-hidden group"
                      onClick={() => setLightbox(attachments.indexOf(img))}
                      draggable={false}
                    >
                      <img
                        src={`http://localhost:3001${img.url}`}
                        alt={img.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isExtra && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">+{images.length - 2}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Card body ── */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-sm font-semibold text-slate-900 flex-1 leading-snug">{task.title}</h3>
            <div className="flex items-center gap-0.5 shrink-0">
              {onedit && (
                <button onClick={onedit} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Edit task">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
              {ondelete && (
                <button onClick={ondelete} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete task">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              {isCompleted && (
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 ml-1">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
          )}

          {pdfs.length > 0 && (
            <div className="mb-3 space-y-1.5">
              {pdfs.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightbox(attachments.indexOf(file))}
                  draggable={false}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group text-left"
                >
                  <div className="w-7 h-7 rounded-md bg-red-100 flex items-center justify-center shrink-0">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M14 2v6h6" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-slate-600 group-hover:text-blue-700 truncate flex-1">{file.name}</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-slate-400 group-hover:text-blue-500 shrink-0">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              ))}
            </div>
          )}


          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${priorityColors[task.priority]}`}>#{task.priority}</span>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${stateColors[task.column]}`}>{stateLabels[task.column]}</span>
            {task.category && (
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">{task.category}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}