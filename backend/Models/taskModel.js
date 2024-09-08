const mongoose = require('mongoose');

// Define the Task model schema
const TaskSchema = new mongoose.Schema({

  id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  description: { type: String },
  //createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User schema
  project : { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User references
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

// Create and export the Task model 
module.exports = mongoose.model('Task', TaskSchema);
