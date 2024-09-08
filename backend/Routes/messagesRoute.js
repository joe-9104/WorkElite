const express = require('express');
const router = express.Router();

//import controller functions
const {getAllMessages,createMessage} = require('../Controllers/messagesController');

const { protect } = require('../Middleware/authMiddleware');

//add a message
router.get('/addMessage',protect,createMessage);

//get user messages
router.get('/allMessage/:id',protect,getAllMessages)

module.exports = router;