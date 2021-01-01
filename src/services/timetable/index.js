const collectSchedule = require('./collectSchedule')
const fetchTMDB = require('../tmdb/fetch')
const logger = require('../../loaders/logger')

const { currentYear, currentSeason } = require('../../config')

// Model
const AnimeModel = require('../../models/animes')
const TimetableModel = require('../../models/timetable')

// Class
const Timetable = require('./Timetable')
const Anime = require('../anime/Anime')

module.exports = async () => {
    const timetable = new Timetable(AnimeModel, TimetableModel, Anime)

    if (!currentYear || !currentSeason) {
        throw new Error('There is no specific year or season in the environment file. Please check.')
    }

    logger.info('Getting schedule from Github...')
    const parsedSchedules = await collectSchedule()
    
    logger.info('Getting titles of anime to create schedule...')
     
    for (const day in parsedSchedules) {
        for (const anime of parsedSchedules[day]) {
            try {
                logger.debug(`Retrieving: ${anime.title}`)
                const { titles } = await fetchTMDB(anime.title)
                
                for (const title of titles) {
                    anime[`${title.language.toLowerCase()}_title`] = title.title
                }
            } catch (err) { continue }
        }
    }
    
    await timetable.insertTable(parsedSchedules)
}