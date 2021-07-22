// Mongoose Model for animes documents
const AnimeModel = require('../../models/animes')

// Class
const Anime = require('./Anime')

const logger = require('../../loaders/logger')
const { usedPlatform } = require('../../config')

const ohysFetch = require('../ohys/fetch')
const nyaaFetch = require('../nyaa/fetch')
const ohysCollectAll = require('../ohys/collectAll')
const nyaaCollectAll = require('../nyaa/collectAll')
const registerLogic = require('./registerLogic')

module.exports.start = async function () {
  const anime = new Anime(AnimeModel)

  logger.info('Start collecting all the pages of ohys...')
  logger.info(`The platform to collect from: ${usedPlatform}`)

  if (usedPlatform === 'nyaa') {
    await nyaaCollectAll()
  }

  if (usedPlatform === 'ohys') {
    await ohysCollectAll()
  }

  logger.info('Start fetching ohys in automation...')

  setInterval(async () => {
    logger.info('Fetching ohys...')

    const list =
      usedPlatform === 'nyaa' ? await nyaaFetch(1) : await ohysFetch(0)
    const isItemExist = await anime.isItemExist(list[0])

    if (!isItemExist) {
      for (let columnSum = list.length - 1; columnSum >= 0; columnSum--) {
        await registerLogic(list[columnSum])
      }
    }
  }, 10 * 1000)
}

module.exports.registerLogic = require('./registerLogic')
