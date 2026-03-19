import api from "./api.js";


// Fetch all tasks
export const fetchTasks = async (params = {}) => {
  const response = await api.get("/tasks/getAlltask", { params });
  return response.data;
};



// Create a new task
export const createTask = async (data) => {
  const response = await api.post("/tasks/create", data);
  return response.data;
};


// Update an existing task by ID
export const updateTask = async (id, data) => {
  const response = await api.put(`/tasks/updated-task/${id}`, data);
  return response.data;
};


// Delete a task by ID
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/delete-task/${id}`);
  return response.data;
};
