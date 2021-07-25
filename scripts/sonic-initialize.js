// Execute this if Sonic is empty

const mongooseLoader = require('../src/loaders/mongoose')
const sonic = require('../src/services/sonic')
const logger = require('../src/loaders/logger')

const Anime = require('../src/models/animes')

mongooseLoader().then(async () => {
  for (let i = 1; true; i++) {
    logger.info(`Processing ${i} page...`)

    const fullTitleList = await Anime.find({}, ['name', 'title', '_id'])
      .skip((i - 1) * 100)
      .limit(100)

    if (fullTitleList.length === 0) {
      return
    }

    for await (const item of fullTitleList) {
      // Title check for searching
      if (!sonic.isValid(item.name) || !sonic.isValid(item.title.romaji)) {
        continue
      }

      const promiseList = [
        sonic.insertToAnime(item._id, item.title.romaji),
        sonic.insertToAnime(item._id, item.title.english),
        sonic.insertToAnime(item._id, item.title.japanese),
      ]

      await Promise.all(promiseList)
    }
  }
})
