const mongooseLoader = require('./mongoose')
const services = require('../services')

const logger = require('./logger')

const loaders = async () => {
    await mongooseLoader()
    logger.info('mongoDB has been loaded!! Starting main services...')
    await services.anime.start()
}

module.exports = loaders