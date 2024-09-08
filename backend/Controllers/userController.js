// userController.js
// Import modules
const User = require("../Models/userModel");
const Task = require("../Models/taskModel")
const Project = require("../Models/projectModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const Leave = require("../Models/leaveModel");

const asyncHandler = require('express-async-handler')

// Create a function to generate a token
const generateToken = (user) => {
  // Sign a token with the user id and a secret key
  return jwt.sign({ id: user._id },  process.env.SECRET_KEY, { expiresIn: "24h" });
};

// Create a function to register a new user
const register = async (req, res) => {
  try {
    // Create a new user from the request body
    const user = new User(req.body);

    // Save the user to the database
    await user.save();

    // Generate a token for the user
    const token = generateToken(user);

    // Send the token and the user info as the response
    res.cookie('token',token, { maxAge: 86400000 , httpOnly: false,secure : false })
    res.json( user );
  } catch (error) {
    // Send the error message as the response
    console.log(error.message)
    res.status(400).json({ error: error.message });
    console.log(error)
  }
};

// Create a function to log in an existing user
const login = async (req, res) => {
  try {
    // Get the email and password from the request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    
    // If the user is not found, throw an error
    if (!user) {
      return res.status(404).json({message:"User not found"})
    }

    // Compare the password with the hashed password
    const match = await user.verifyPassword(password);

    // If the password does not match, throw an error
    if (!match) {
      return res.status(401).json({message:"Invalid password"})
    }

    // Generate a token for the user
    const token = generateToken(user);

    // Send the token and the user info as the response
    res.cookie('token',token, { maxAge: 86400000 , httpOnly: false,secure : false })
    res.json({ user });
    
  } catch (error) {
    console.log(error)
    // Send the error message as the response
    res.status(401).json({ error: error.message });
  }
};

// Create a function to get the user profile
const profile =asyncHandler( async (req, res) => {
  try {
    // Get the user id from the request object
    const userId = req.params.id;

    // Find the user by id
    const user = await User.findById(userId);

    // If the user is not found, throw an error
    if (!user) {
      throw new Error("User not found");
    }
    // Send the user info as the response
    res.json({ user });
  } catch (error) {
    // Send the error message as the response
    console.log(error)
    res.status(404).json({ error: error.message });
  }
});

// create a function to get all the users 
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    // get all users
    const users = await User.find();
    // send users info as response 
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
//create a function to update a user 
const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If a new password is provided, hash it before saving
    if (req.body.password) {
    //check if the current password is the actual user password
      const currentPasswordMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!currentPasswordMatch) {
        
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Hash the new password
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      // Update the password in the user object
      user.password = hashedPassword;
    }

    // Update other user fields
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.email) user.email = req.body.email;

    // Save the updated user
    const updatedUser = await User.findByIdAndUpdate(user._id, user);

    // Return the updated user data
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error)
  }
});
const updateUserAdmin = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If a new password is provided, hash it before saving
    if (req.body.password) {
    //check if the current password is the actual user password
      const currentPasswordMatch = req.body.currentPassword === user.password
      if (!currentPasswordMatch) {
        
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Hash the new password
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      // Update the password in the user object
      user.password = hashedPassword;
    }

    // Update other user fields
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.email) user.email = req.body.email;

    // Save the updated user
    const updatedUser = await User.findByIdAndUpdate(user._id, user);

    // Return the updated user data
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error)
  }
});

// create a function to delete a user 
const deleteUser =asyncHandler( async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    if(deletedUser.role === 'leader'){
      const deletedProject = await Project.deleteMany({ manager : deleteUser._id})
      /*// get the team members of the project
      const userIds = deletedProject.team;
      // update users' "projects" array to remove the deleted project id
      await User.updateMany(
          { _id: { $in: userIds } },
          { $pull: { projects:deletedProject._id } }
      );
      //delete all messages associated with the project
      await Message.deleteMany({project: deletedProject._id});
      //delete all tasks associated with the project
      await Task.deleteMany({project: deletedProject._id});*/
    }
    if(deletedUser.role === 'member'){
      const projects = await Project.updateMany({ _id: { $in: deleteUser.projects } },
        { $pull: { team : deletedUser._id } })

      const tasks = await Task.updateMany({assignedTo : deleteUser._id} , { $pull : deleteUser._id})
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
// get users associated to a certain tasks(assigned to)
const getUsersByTask = asyncHandler( async (req,res) => {
  try {
    const task = await Task.findById(req.params.id)
    if(!task){
      throw Error("task not found")
    }
    if(task){
      uIds = task.assignedTo
      const users = await User.find({"_id" : {"$in" : uIds}})
      res.status(200).json(users)
    }
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})




// Export the controller functions
module.exports = { register, login, profile ,getAllUsers ,updateUser, deleteUser,getUsersByTask,updateUserAdmin};
