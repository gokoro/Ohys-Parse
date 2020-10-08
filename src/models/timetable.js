const mongoose = require('mongoose')

const timetableSchema = new mongoose.Schema({
    day: {
        type: String,
        unique: true
    },
    animes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }]
})
module.exports = mongoose.model('Timetable', timetableSchema)