// Import necessary modules
const express = require('express');
const router = express.Router();
const taskController = require('../Controllers/taskController'); // Import your task controller
const { protect } = require('../Middleware/authMiddleware')


// Create a new task
router.post('/createtask', protect ,taskController.createTask);

// Get all tasks
router.get('/tasks',protect, taskController.getAllTasks);

// Get a specific task by ID
router.get('/tasks/:id', protect ,taskController.getTaskById);

// Update a task by ID
router.put('/tasks/:id',protect, taskController.updateTaskById);

// Delete a task by ID
router.delete('/tasks/:id',protect, taskController.deleteTaskById);

// Get tasks associated with a project
router.get('/projtasks/:id',protect,taskController.getTasksByProject);

//get users associated with a task
router.get('/taskusers/:id',protect,taskController.getTaskUsers);

module.exports = router;
