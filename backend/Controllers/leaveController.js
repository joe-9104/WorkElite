// Import necessary modules
const Leave = require('../Models/leaveModel'); // Import your Leave model
const Notif= require('../Models/notificationModel')
const { format } =require('date-fns');

// Create a new leave request
const createLeave = async (req, res) => {
  try {
    const newLeaveRequest = await Leave.create(req.body);
    res.status(201).json(newLeaveRequest);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  
};

// Get all leave requests
const getAllLeaves = async (req, res) => {
  try {
    const leaveRequests = await Leave.find().populate("concernedUser");
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific leave request by ID
const getLeaveById = async (req, res) => {
  try {
    const leaveRequest = await Leave.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.json(leaveRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a leave request by ID
const updateLeaveById = async (req, res) => {
  try {
    const updatedLeaveRequest = await Leave.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedLeaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    if (updatedLeaveRequest.status === 'confirmed')
    {
        const notification = await Notif.create({content: "The leave request you submitted on "+ format(new Date(updatedLeaveRequest.createdAt), 'dd/MM/yyyy')+ " has been approved. " , sentTo:updatedLeaveRequest.concernedUser});
    }
    if (updatedLeaveRequest.status === 'declined')
    {
        const notification = await Notif.create({content: "The leave request you submitted on "+ format(new Date(updatedLeaveRequest.createdAt), 'dd/MM/yyyy')+ " is declined " , sentTo:updatedLeaveRequest.concernedUser});
    }
    res.json(updatedLeaveRequest);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error)
  }
};

// Delete a leave request by ID
const deleteLeaveById = async (req, res) => {
  try {
    const deletedLeaveRequest = await Leave.findByIdAndDelete(req.params.id);
    if (!deletedLeaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLeave,
  getAllLeaves,
  getLeaveById,
  updateLeaveById,
  deleteLeaveById,
};
