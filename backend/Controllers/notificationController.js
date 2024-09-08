// notificationController.js
const asyncHandler = require('express-async-handler')

const Notification = require('../Models/notificationModel'); // Import your Notification model

// Create a new notification
const createNotification = asyncHandler(async (req, res) => {
  try {
    const newNotification = await Notification.create(req.body);
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all notifications
const getAllNotifications = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific notification by ID
const getNotificationById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
};
