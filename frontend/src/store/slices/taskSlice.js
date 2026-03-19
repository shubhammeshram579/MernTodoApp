import { createSlice } from "@reduxjs/toolkit";

// Initial State
const initialState = {
  tasks: [],
  loading: false,
  filter: "", // "" | "pending" | "in-progress" | "completed"
};

// Slice 
const taskSlice = createSlice({
  name: "tasks",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload; 
    },

    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
    },

    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
    },

    updateTask: (state, action) => {
      const updated = action.payload;
      const index = state.tasks.findIndex((t) => t._id === updated._id);
      if (index !== -1) {
        state.tasks[index] = updated;
      }
    },

    removeTask: (state, action) => {
      const id = action.payload;
      state.tasks = state.tasks.filter((t) => t._id !== id);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const {
  setLoading,
  setTasks,
  addTask,
  updateTask,
  removeTask,
  setFilter,
} = taskSlice.actions;

// Selectors 
export const selectTasks = (state) => state.tasks.tasks;
export const selectLoading = (state) => state.tasks.loading;
export const selectFilter = (state) => state.tasks.filter;

export default taskSlice.reducer;
