const mongooseLoader = require('./mongoose')
const server = require('./server')
const services = require('../services')
const config = require('../config')

const logger = require('./logger')

const loaders = async () => {
    await mongooseLoader()
    logger.info('mongoDB has been loaded!! Starting main services...')
    
    // For Heroku. Not to sleep 
    if (config.fakeServer === 'true') {
        logger.info('Fake server for Heroku is running...')
        server()
    }
    await services.anime.start()

    logger.info('Starting crawling ohys timetables...')
    await services.timetable()
}

module.exports = loaders