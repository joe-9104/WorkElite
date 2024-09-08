// Import necessary modules
const Task = require('../Models/taskModel'); // Import your Task model
const asyncHandler = require('express-async-handler')
const Project = require('../Models/projectModel')
const User = require('../Models/userModel')

// Create a new task
const createTask = asyncHandler(async (req, res) => {
  try {
    const newTask = await Task.create(req.body.task);
    const pId = req.body.id
    await Project.updateOne({_id : pId },{ $push : {tasks : newTask._id}})
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error)
  }
});

// Get all tasks
const getAllTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific task by ID
const getTaskById = asyncHandler(async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task by ID
const updateTaskById = asyncHandler(async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task by ID
const deleteTaskById = asyncHandler(async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await Project.updateOne(
      {_id : deletedTask.project},
      { $pull : { tasks : deletedTask._id}},
      { new: true } 
    )
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all tasks by project
const getTasksByProject = asyncHandler(async (req,res) => {
    try {
      const project = await Project.findById(req.params.id)
      if(!project){
        throw Error("project not found")
      }
      if(project){
        tIds = project.tasks
        const tasks = await Task.find({"_id" : {"$in" : tIds}}) 
        res.status(200).json(tasks)
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})
//get users assigned to a certain task
const getTaskUsers = asyncHandler(async(req,res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId)
    let users;
    if (task) {
      users = task.assignedTo;
      const teamMembers = await User.find({_id: {$in: users}});
      users = teamMembers; // Update 'users' with the actual user objects
    }
    if (!task) {
      res.status(404).json({ message: 'task not found' });
    }
    res.json(users);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
})

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  getTasksByProject,
  getTaskUsers
};
