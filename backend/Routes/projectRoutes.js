//
const express = require('express');
const router = express.Router();

// import controller functions 
const {createProject , getAllProjects , getProject , updateProject , deleteProject,getUserProjects, getProjectUsers} = require('../Controllers/projectContoller');
const { protect } = require('../Middleware/authMiddleware');


// Create a new project
router.post('/',protect, createProject);

// Get all projects
router.get('/', getAllProjects);

// Get a specific project by ID
router.get('/:id',protect, getProject);

// Update a project by ID
router.put('/:id',protect, updateProject);

// Delete a project by ID
router.delete('/:id',protect, deleteProject);

// Get all projects assigned to a user
router.get('/myprojects/:id',protect,getUserProjects)
// Get all users assigned to a project

// Get all users assigned to a project
router.get('/projusers/:id',protect,getProjectUsers)
module.exports = router;