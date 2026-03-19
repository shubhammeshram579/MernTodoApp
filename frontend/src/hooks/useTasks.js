import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  setLoading,
  setTasks,
  addTask,
  updateTask,
  removeTask,
  selectTasks,
  selectLoading,
  selectFilter,
} from "../store/slices/taskSlice.js";

import {
  fetchTasks,
  createTask,
  updateTask as updateTaskAPI,
  deleteTask,
} from "../services/task.service.js";

const useTasks = () => {
  const dispatch = useDispatch();

  // Read from Redux store
  const tasks = useSelector(selectTasks);
  const loading = useSelector(selectLoading);
  const filter = useSelector(selectFilter);

  
  const [submitting, setSubmitting] = useState(false);

  // Load tasks from API
  const loadTasks = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const params = filter ? { status: filter } : {};
      const data = await fetchTasks(params);
      dispatch(setTasks(data.data.tasks));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tasks.");
      dispatch(setLoading(false));
    }
  }, [dispatch, filter]);

  // Re-fetch whenever the filter changes
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);



  // Create a task
  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      const data = await createTask(formData);
      dispatch(addTask(data.data.task));
      toast.success("Task created!");
      return true; 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Update a task 
  const handleUpdate = async (id, formData) => {
    setSubmitting(true);
    try {
      const data = await updateTaskAPI(id, formData);
      dispatch(updateTask(data.data.task)); // update in Redux store
      toast.success("Task updated!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a task 
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      dispatch(removeTask(id)); // remove from Redux store
      toast.success("Task deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task.");
    }
  };

  return {
    tasks,
    loading,
    submitting,
    filter,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: loadTasks,
  };
};

export default useTasks;
