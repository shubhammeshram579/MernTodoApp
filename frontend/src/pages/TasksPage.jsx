import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Clock,
  Loader2,
  CheckCircle2,
  LayoutGrid,
  SlidersHorizontal,
  ClipboardList,
} from "lucide-react";

import Navbar from "../components/Navbar.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import useTasks from "../hooks/useTasks.js";
import { setFilter, selectFilter } from "../store/slices/taskSlice.js";

// Filter options shown as tabs above the task grid
const FILTERS = [
  { value: "", label: "All", icon: <LayoutGrid size={13} /> },
  { value: "pending", label: "Pending", icon: <Clock size={13} /> },
  { value: "in-progress", label: "In Progress", icon: <Loader2 size={13} /> },
  { value: "completed", label: "Completed", icon: <CheckCircle2 size={13} /> },
];

const TasksPage = () => {
  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);

  // All task data and CRUD operations from our custom hook
  const {
    tasks,
    loading,
    submitting,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Open modal in CREATE mode
  const openCreate = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  // Open modal in EDIT mode with the selected task
  const openEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  // Called by TaskModal on form submit
  const handleSubmit = (formData) =>
    editingTask
      ? handleUpdate(editingTask._id, formData)
      : handleCreate(formData);

  // Summary counts for the stat cards
  const counts = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page heading */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 tracking-tight flex items-center gap-2.5">
              <SlidersHorizontal size={22} className="text-indigo-400" />
              My Tasks
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {counts.total} task{counts.total !== 1 ? "s" : ""} total
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary px-5 py-2.5">
            <Plus size={16} />
            New Task
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <p className="text-2xl font-bold text-gray-100">{counts.total}</p>
            <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">
              Total
            </p>
          </div>
          <div className="stat-card border-l-2 border-amber-500">
            <p className="text-2xl font-bold text-amber-400">
              {counts.pending}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">
              Pending
            </p>
          </div>
          <div className="stat-card border-l-2 border-indigo-500">
            <p className="text-2xl font-bold text-indigo-400">
              {counts.inProgress}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">
              In Progress
            </p>
          </div>
          <div className="stat-card border-l-2 border-emerald-500">
            <p className="text-2xl font-bold text-emerald-400">
              {counts.completed}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">
              Completed
            </p>
          </div>
        </div>

        {/* Filter tabs — dispatches setFilter to Redux */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => dispatch(setFilter(f.value))}
              className={`filter-tab flex items-center gap-1.5 ${filter === f.value ? "active" : ""}`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>

        {/* Task content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="spinner" />
            <p className="text-sm text-gray-500">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800">
              <ClipboardList size={28} className="text-gray-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-400">
                {filter ? `No ${filter} tasks` : "No tasks yet"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {filter
                  ? "Try a different filter or create a new task."
                  : "Click the button below to get started."}
              </p>
            </div>
            <button onClick={openCreate} className="btn-primary mt-2">
              <Plus size={15} /> Create Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task create/edit modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={closeModal}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default TasksPage;
