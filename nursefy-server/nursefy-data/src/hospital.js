const mongoose = require('mongoose')
const { Hospital } = require('./schemas')

module.exports = mongoose.model('Hospital', Hospital)