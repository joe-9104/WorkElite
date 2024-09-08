const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// Define the User model schema
const UserSchema = new mongoose.Schema({
  id : mongoose.Schema.Types.ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['leader', 'member','admin'], default: 'member' },
  isActive: { type: Boolean, default: true },
  pictureURL: { type: String }, // You can add validation rules for URLs if required
  leaveCount: { type: Number, default: 90 },
  projects:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],//for member users 
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Verify password
UserSchema.methods.verifyPassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Create and export the User model
module.exports = mongoose.model('User', UserSchema);
