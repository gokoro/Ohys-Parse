const fetch = require('./fetch')
const Anime = require('../anime/Anime')
const AnimeModel = require('../../models/animes')
const register = require('../anime/registerLogic')
const logger = require('../../loaders/logger')

const collectAll = async () => {
  const search = new Search(0, 100)
  const anime = new Anime(AnimeModel)

  logger.info(
    "Finding the page that can be parsed from Nyaa by differing DB's one."
  )
  const startPage = await findUnparsedPage(search, anime)
  logger.info(`Done. Start parsing from ${startPage} Page.`)

  for (let i = startPage; i > 0; i--) {
    logger.info(`Parsing ${i} Page...`)
    const parsedDataList = await fetch(i)
    for await (const parsedData of parsedDataList.reverse()) {
      await register(parsedData)
    }
  }
}

class Search {
  constructor(lowInit, highInit) {
    this.lowerStandard = lowInit
    this.higherStandard = highInit
    this.setCenterNumber()
  }
  higher() {
    this.lowerStandard = this.currentNumber
    this.setCenterNumber()
  }
  lower() {
    this.higherStandard = this.currentNumber
    this.setCenterNumber()
  }
  setCenterNumber() {
    this.currentNumber = getCenterNumber(
      this.lowerStandard,
      this.higherStandard
    )

    this[`_${this.currentNumber}`] = this[`_${this.currentNumber}`] + 1 || 0
  }
}

const getCenterNumber = (low, high) => Math.round((low + high) / 2)

const findUnparsedPage = async (search, anime) => {
  const { currentNumber } = search

  if (search[`_${currentNumber}`] >= 2) {
    return currentNumber
  }

  const nyaaData = await fetch(currentNumber)
  const isAnimeRegistered = await anime.isItemExist(nyaaData[0])

  if (isAnimeRegistered) {
    search.lower()
    return findUnparsedPage(search, anime)
  } else {
    search.higher()
    return findUnparsedPage(search, anime)
  }
}

module.exports = collectAll
