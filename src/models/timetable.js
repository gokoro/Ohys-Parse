const mongoose = require('mongoose')

const timetableSchema = new mongoose.Schema({
  day: {
    type: String,
    unique: true,
  },
  animes: [String],
})

module.exports = mongoose.model('Timetable', timetableSchema)
