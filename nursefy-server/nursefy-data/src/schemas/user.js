const { Schema } = require('mongoose')
const Events = require('./event')
module.exports = new Schema({

    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    address: {
        type: String
    },
    transport: {
        type: String
    },
    nursecard: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
    }, 
    image:{
        type: String
    },
    admin:{
        type: Boolean,
        default:false
    },
    disp:{
        type:Boolean,
        default: false,
        required:true
    },
    events: [Events]

})