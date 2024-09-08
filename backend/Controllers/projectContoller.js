// project controller
const asyncHandler = require('express-async-handler')
//import modules 
const Project = require('../Models/projectModel')
const User = require('../Models/userModel')
const Message = require('../Models/messageModel')
const Task = require('../Models/taskModel')

//create a function to add a project 
const createProject =asyncHandler(async (req,res) => {
    try {
        // create the new project
        const newProject = await Project.create(req.body);
        //update users' "projects" array to contain the new project id
        const userIds = req.body.team;
        await User.updateMany(
          {_id: {$in: userIds}},
          {$push: {projects: newProject._id}}
        );
        res.status(201).json(newProject);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
})

//create a function to get all projects
const getAllProjects = asyncHandler(async (req,res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
})

// Get a specific project by ID
const getProject = asyncHandler(async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})
  
// Update a project by ID
const updateProject =  asyncHandler(async (req, res) => {
    try {
      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      const userIds = updatedProject.team
      await User.updateMany(
        {_id: {$in: userIds}},
        {$addToSet: {projects: updatedProject._id}}
      );
      if (!updatedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json(updatedProject);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
})
  
// Delete a project by ID
/*const deleteProject = asyncHandler(async (req, res) => {
    try {
      const deletedProject = await Project.findByIdAndDelete(req.params.id);
      if (!deletedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})*/
const deleteProject = asyncHandler(async (req, res) => {
  try {
      // find the project to delete
      const projectToDelete = await Project.findById(req.params.id);
      // check if the project exists
      if (!projectToDelete) {
          return res.status(404).json({ message: 'Project not found' });
      }
      // get the team members of the project
      const userIds = projectToDelete.team;
      // update users' "projects" array to remove the deleted project id
      await User.updateMany(
          { _id: { $in: userIds } },
          { $pull: { projects: projectToDelete._id } }
      );
      //delete all messages associated with the project
      await Message.deleteMany({project: req.params.id});
      //delete all tasks associated with the project
      await Task.deleteMany({project: req.params.id});
      // delete the project
      await Project.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

//Get projects associated with a team leader(project manager)
const getUserProjects = asyncHandler(
  async (req,res) => {
    try {
      const userId = req.params.id
      const user = await User.findById(userId)
      let projects
      if(user){
        if(user.role === 'leader'){
          projects= await Project.find({manager : userId})//find projects in which the user is the manager 
        }
        if(user.role === 'member'){
          const pIds = user.projects //project ids that the user is a member in
          projects = await Project.find({"_id" :{"$in" : pIds}})
        }
      }
      if(!user){
        res.status(404).json({message : 'user not found'})
      }
      res.json(projects)
    } catch (error) {
      res.status(400).json(error)
      console.log(error)
    }
  }  
)
// Get users associated with a project
const getProjectUsers = asyncHandler(
  async (req, res) => {
    try {
      const projectId = req.params.id;
      const project = await Project.findById(projectId);
      let users;
      if (project) {
        users = project.team;
        const teamMembers = await User.find({_id: {$in: users}});
        users = teamMembers; // Update 'users' with the actual user objects
      }
      if (!project) {
        res.status(404).json({ message: 'Project not found' });
      }
      res.json(users);
    } catch (error) {
      res.status(400).json(error);
      console.log(error);
    }
  }
);


//export the controller functions.
module.exports = {createProject , getAllProjects , getProject , updateProject , deleteProject,getUserProjects, getProjectUsers}
  
