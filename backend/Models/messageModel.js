const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    id : mongoose.Schema.Types.ObjectId,
    content : {
        type : String//for the moment it's a string later it will be mongoose.Schema.Types.ObjectId
    },
    sender : {type : String, ref: 'User'},
    sentTo : [{ type : String, ref: 'User'}],
    who :{type : String} ,
    //for the moment it's an array of  strings later it will be an array of  mongoose.Schema.Types.ObjectId
    project : {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    sentAt : {type : Date , default : Date.now}
})

module.exports = mongoose.model('Message',MessageSchema)