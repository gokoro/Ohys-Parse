const axios = require('axios').default
const crypto = require('crypto')

const collectSchedule = require('./collectSchedule')
const fetchTMDB = require('../tmdb/fetch')
const logger = require('../../loaders/logger')

const { currentYear, currentSeason, ohysGithubUrl } = require('../../config')

// Model
const AnimeModel = require('../../models/animes')
const TimetableModel = require('../../models/timetable')

// Class
const Timetable = require('./Timetable')
const Anime = require('../anime/Anime')

global.ohysTimetableHash = ''

const checkNewSchedule = async () => {
  const BASE_URL =
    ohysGithubUrl ||
    `https://raw.githubusercontent.com/ohyongslck/annie/master/${currentYear}@${currentSeason}`

  const { data } = await axios.get(BASE_URL)

  const hash = crypto.createHash('md5').update(data).digest('hex')

  if (global.ohysTimetableHash === hash) {
    return false
  }

  global.ohysTimetableHash = hash

  return true
}

const applyTable = async () => {
  const timetable = new Timetable(AnimeModel, TimetableModel, Anime)

  if (!currentYear || !currentSeason) {
    throw new Error(
      'There is no specific year or season in the environment file. Please check.'
    )
  }

  logger.info('Checking if there is a new timetable in Github repository...')
  const isNewSchedule = await checkNewSchedule()

  if (!isNewSchedule) {
    logger.info('The existing schedule has already been crawled.')
    return
  }

  logger.info('New Schedule available! Getting schedule from Github...')
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
      } catch (err) {
        continue
      }
    }
  }

  await timetable.insertTable(parsedSchedules)
}

module.exports = async () => {
  await applyTable()

  setInterval(applyTable, 1000 * 60 * 60) // Every hour
}
