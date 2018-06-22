const {Schema} = require('mongoose')
const User = require('./user')

module.exports = new Schema({

    name: {
        type:String,
        required:true
    },
    address: {
        type:String,
        rerquired:true
    },
    phone:{
        type:String,
        required:true
    },

    users:[User],


})