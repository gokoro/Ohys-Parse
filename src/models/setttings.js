const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
  type: String,
  data: {},
})

module.exports = mongoose.model('Setting', settingsSchema)
