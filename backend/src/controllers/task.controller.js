import Task from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// create task
const createTask = asyncHandler(async (req, res) => {
 try {
   const { title, description, status } = req.body;
 
   if (!title) {
     throw new ApiError(400, "Task title is required.");
   }
 
   const task = await Task.create({
     title,
     description,
     status,
     userId: req.user._id,
   });
 
   return res
     .status(201)
     .json(new ApiResponse(201, { task }, "Task created successfully."));
 } catch (error) {
   throw new ApiError(500, "Task create failed" || error.message);
  
 }
});



// get task
const getTasks = asyncHandler(async (req, res) => {
try {
    const { status, sort = "-createdAt" } = req.query;
  
    const filter = { userId: req.user._id };
    if (status) {
      filter.status = status;
    }
  
    const tasks = await Task.find(filter).sort(sort);
  
    return res.status(200).json(
      new ApiResponse(
        200,
        { tasks, count: tasks.length },
        "Tasks fetched successfully."
      )
    );
} catch (error) {
  throw new ApiError(500, "get Task failed" || error.message);
  
}
});



//update task
const updateTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
  
    const task = await Task.findOne({ _id: id, userId: req.user._id });
  
    if (!task) {
      throw new ApiError(404, "Task not found or you are not authorized.");
    }
  
  
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
  
    const updatedTask = await task.save();
  
    return res
      .status(200)
      .json(new ApiResponse(200, { task: updatedTask }, "Task updated successfully."));
  } catch (error) {
    throw new ApiError(500, "Task update failed" || error.message);
    
  }
});



// delete task 
const deleteTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
  
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!task) {
      throw new ApiError(404, "Task not found or you are not authorized.");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Task deleted successfully."));
  } catch (error) {
    throw new ApiError(500, "Task delete failed" || error.message);
    
  }
});

export { createTask, getTasks, updateTask, deleteTask };
