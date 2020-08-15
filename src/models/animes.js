const mongoose = require('mongoose')

const itemsSchema = new mongoose.Schema({
    episode: Number,
    link: String,
    resolution: String,
    audioFormat: String,
    videoFormat: String,
    broadcaster: String,
    original: String,
    hash: String,
    created_at: { type: Date, default: Date.now }
})

const animeSchema = new mongoose.Schema({
    name: String,
    title: {
        romaji: { type: String, default: null },
        japanese: { type: String, default: null },
        english: { type: String, default: null },
        korean: { type: String, default: null }
    },
    imageUrl: String,
    season: String,
    released_year: Number,
    released_time: { type: String, default: null },
    release_broadcaster: { type: String, default: null },
    items: [itemsSchema]
})
module.exports = mongoose.model('Anime', animeSchema)