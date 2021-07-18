// Mongoose Model for animes documents
const AnimeModel = require('../../models/animes')

// Class
const Anime = require('./Anime')

const logger = require('../../loaders/logger')
const config = require('../../config')

const ohysFetch = require('../ohys/fetch')
const ohysCollectAll = require('../ohys/collectAll')
const nyaaCollectAll = require('../nyaa/collectAll')
const registerLogic = require('./registerLogic')

module.exports.start = async function () {
  const anime = new Anime(AnimeModel)

  logger.info('Start collecting all the pages of ohys...')
  logger.info(`The platform to collect from: ${config.usedPlatform}`)

  if (config.usedPlatform === 'nyaa') {
    await nyaaCollectAll()
  }

  if (config.usedPlatform === 'ohys') {
    await ohysCollectAll()
  }

  logger.info('Start fetching ohys in automation...')

  setInterval(async () => {
    logger.info('Fetching ohys...')

    const list = await ohysFetch(0)
    const isItemExist = await anime.isItemExist(list[0])

    if (!isItemExist) {
      for (let columnSum = list.length - 1; columnSum >= 0; columnSum--) {
        await registerLogic(list[columnSum])
      }
    }
  }, 10 * 1000)
}

module.exports.registerLogic = require('./registerLogic')
