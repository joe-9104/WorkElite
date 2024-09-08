// Import necessary modules
const express = require('express');
const router = express.Router();
const leaveController = require('../Controllers/leaveController'); // Import your leave controller
const { protect } = require('../Middleware/authMiddleware');

// Create a new leave request
router.post('/createleave',protect, leaveController.createLeave);

// Get all leave requests
router.get('/leaves',protect, leaveController.getAllLeaves);

// Get a specific leave request by ID
router.get('/leaves/:id',protect, leaveController.getLeaveById);

// Update a leave request by ID
router.put('/leaves/:id',protect, leaveController.updateLeaveById);

// Delete a leave request by ID
router.delete('/leaves/:id',protect, leaveController.deleteLeaveById);

module.exports = router;
