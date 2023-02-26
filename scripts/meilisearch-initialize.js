// Execute this if Sonic is empty

const mongooseLoader = require('../src/loaders/mongoose')
const meilisearch = require('../src/services/meilisearch')
const logger = require('../src/loaders/logger')

const Anime = require('../src/models/animes')

mongooseLoader().then(async () => {
  for (let i = 1; true; i++) {
    logger.info(`Processing ${i} page...`)

    const fullTitleList = await Anime.find({}, ['name', 'title', '_id'])
      .skip((i - 1) * 100)
      .limit(100)

    if (fullTitleList.length === 0) {
      process.exit(0)
    }

    for await (const item of fullTitleList) {
      // Title check for searching
      if (
        !meilisearch.isValid(item.name) ||
        !meilisearch.isValid(item.title.romaji)
      ) {
        continue
      }

      await meilisearch.insertToAnime({ data: item })
    }
  }
})
