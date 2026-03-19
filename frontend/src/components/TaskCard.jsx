import { useState } from "react";
import { Pencil, Trash2, Clock, Loader2, CheckCircle2, Calendar } from "lucide-react";

const STATUS_CONFIG = {
  pending:     { label: "Pending",     badge: "badge-pending",     icon: <Clock size={11} /> },
  "in-progress":{ label: "In Progress", badge: "badge-in-progress", icon: <Loader2 size={11} /> },
  completed:   { label: "Completed",   badge: "badge-completed",   icon: <CheckCircle2 size={11} /> },
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const config = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(task._id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="task-card flex flex-col gap-3 group">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <span className={config.badge}>
          {config.icon}
          {config.label}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition duration-200">
          {/* Edit */}
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400
                       hover:bg-indigo-500/10 transition duration-200"
            title="Edit task"
          >
            <Pencil size={14} />
          </button>
          {/* Delete */}
          <button
            onClick={handleDeleteClick}
            className={`p-1.5 rounded-lg transition duration-200 text-sm font-semibold
              ${confirmDelete
                ? "bg-red-600 text-white px-2.5"
                : "text-gray-500 hover:text-red-400 hover:bg-red-500/10"
              }`}
            title={confirmDelete ? "Click again to confirm delete" : "Delete task"}
          >
            {confirmDelete ? "Sure?" : <Trash2 size={14} />}
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-sm font-semibold leading-snug text-gray-100
        ${task.status === "completed" ? "line-through text-gray-500" : ""}`}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-1.5 mt-auto pt-3 border-t border-gray-800">
        <Calendar size={11} className="text-gray-600" />
        <span className="text-xs text-gray-600">
          {new Date(task.createdAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
