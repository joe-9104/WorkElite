const mongoose = require('mongoose')

const UserSchema = require('./userModel')

const LeaveSchema = new mongoose.Schema({
    id : mongoose.Schema.Types.ObjectId,
    startDate : {type : Date , required : true},
    endDate : {type : Date , required : true},
    reason : {type : String},
    type : { type : String , enum : ['sick leave','annual','normal'],default : 'normal'},
    concernedUser : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status : {type : String , enum : ['pending' , 'confirmed' ,'declined'] ,default : 'pending'},
    createdAt: {type:Date, default: Date.now()}
})

module.exports = mongoose.model('Leave',LeaveSchema)