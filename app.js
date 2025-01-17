//Name : Saurabh Rajabhau Deshmukh
//Computer Engineering
//MIT Academy of engineering,Pune

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import Task from "./models/model.js";

// Connect to MongoDB
mongoose
  .connect("mongodb://0.0.0.0:27017/", {
    dbName: "Backend",
  })
  .then(() => console.log("Database Connected"))
  .catch((error) => console.error("Database connection error:", error));

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Start the server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

// Base API route
app.get("/api", (req, res) => {
  res.send("API is working");
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    // Fetch all tasks from the database
    const tasks = await Task.find();
    res.status(200).json({
      success: true,
      tasks: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});

// Add a new task
app.post("/api/task", async (req, res) => {
  console.log("Request Body:", req.body);

  const { id, title, description } = req.body;

  try {
    // Create a new task in the database
    const newTask = await Task.create({
      id,
      title,
      description,
    });

    res.status(201).cookie("tempCookie", "abc").json({
      success: true,
      message: "Task added successfully",
      task: newTask,
    });

    console.log(`Task added with ID: ${id}`);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add the task",
      error: error.message,
    });
  }
});

// Update a task by ID
app.put("/api/task/:id", async (req, res) => {
  const taskId = req.params.id; // Extract the task ID from the route parameter
  const updatedTaskData = req.body; // Data to update the task with

  try {
    // Find the task by ID and update it
    const updatedTask = await Task.findOneAndUpdate(
      { id: taskId },
      updatedTaskData,
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update the task",
      error: error.message,
    });
  }
});

// Delete a task by ID
app.delete("/api/task/:id", async (req, res) => {
  const taskId = req.params.id; // Extract the task ID from the route parameter

  try {
    // Find the task by ID and delete it
    const deletedTask = await Task.findOneAndDelete({ id: taskId });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete the task",
      error: error.message,
    });
  }
});
