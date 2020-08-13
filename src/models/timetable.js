const mongoose = require('mongoose')

const timetableSchema = new mongoose.Schema({
    day: String,
    animes: [{
        title: {
            romaji: { type: String, default: null },
            japanese: { type: String, default: null },
            english: { type: String, default: null },
            korean: { type: String, default: null }
        },
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }
    }]
})
module.exports = mongoose.model('Timetable', timetableSchema)