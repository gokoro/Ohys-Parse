const axios = require('axios').default
const config = require('../../config')

// Model
const AnimeModel = require('../../models/animes')
const TimetableModel = require('../../models/timetable')

// Class
const Timetable = require('./Timetable')

const logger = require('../../loaders/logger')

module.exports = async () => {
    const timetable = new Timetable(AnimeModel, TimetableModel)

    // Reset the timetable collection
    await TimetableModel.deleteMany({})

    await timetable.insertTable(
        await fetch(config.timetableURL)
    )
}

async function fetch (url) {
    try {
        const response = await axios(url)
        
        return response.data
    } catch (error) {
        logger.error('Fetching timetables failed : ' + error)
        
        return null
    }

}
