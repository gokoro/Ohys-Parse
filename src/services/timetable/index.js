const config = require('../../config')

const table = require(`../../assets/${config.season}.json`)

// Model
const AnimeModel = require('../../models/animes')
const TimetableModel = require('../../models/timetable')

// Class
const Timetable = require('./Timetable')
const Anime = require('../anime/Anime')

module.exports = async () => {
    const timetable = new Timetable(AnimeModel, TimetableModel, Anime)

    if (typeof timetable !== 'object') {
        throw new Error('The file that contains information of the timetable is invalid.')
    }

    await timetable.insertTable(table)
}