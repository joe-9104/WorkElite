// notificationRoutes.js

const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController'); // Import your notification controller
const { protect } = require('../Middleware/authMiddleware');

// Create a new notification
router.post('/notifications',protect, notificationController.createNotification);

// Get all notifications
router.get('/notifications',protect, notificationController.getAllNotifications);

// Get a specific notification by ID
router.get('/notifications/:id',protect, notificationController.getNotificationById);

module.exports = router;
