const { Schema } = require('mongoose')

module.exports = new Schema({

    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }

})