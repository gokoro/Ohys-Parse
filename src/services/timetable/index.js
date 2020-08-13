const axios = require('axios').default
const config = require('../../config')

const AnimeModel = require('../../models/animes')
const TimetableModel = require('../../models/timetable')

const logger = require('../../loaders/logger')

module.exports = async () => {
    if (!config.timetableURL) {
        logger.info("The environment variable 'TIMETABLE_JSON_URL' is not available.")

        return
    }

    // Reset the timetable collection
    await TimetableModel.deleteMany({})

    const response = await fetch(config.timetableURL)

    if (!response) {
        return
    }
    
    for (let day in response) {
        logger.info(`Timetable: Working with ${day} ...`)

        const timetableModel = new TimetableModel()

        timetableModel.day = day
        timetableModel.animes = []

        const item = response[day]

        for (let i = 0; i < item.length; i++) {
            const fetchedAnime = await getItemsId(item[i].title)
            
            logger.debug(`Timetable: Working ${item[i].title}...`)

            const animesForm = {
                title: {
                    romaji: item[i].title,
                    japanese: item[i].ja_title,
                    english: item[i].eng_title,
                    korean: item[i].kor_title
                },
                item: fetchedAnime._id || null
            }

            logger.silly(`The item of timetables detected: ${JSON.stringify(animesForm)}`)

            timetableModel.animes.push(animesForm)
        }
        await timetableModel.save()
    }
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

async function getItemsId (title) {
    const items = await AnimeModel.findOne({name: title}).select('_id')

    return items || {}
}