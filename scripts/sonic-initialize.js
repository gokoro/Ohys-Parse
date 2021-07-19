// Execute this if Sonic is empty

const mongooseLoader = require('../src/loaders/mongoose')
const sonic = require('../src/services/sonic')

const Anime = require('../src/models/animes')

mongooseLoader().then(async () => {
  for (let i = 1; true; i++) {
    const fullTitleList = await Anime.find({}, ['title', '_id'])
      .skip((i - 1) * 100)
      .limit(100)

    if (fullTitleList.length < 100) {
      return
    }

    for await (const item of fullTitleList) {
      const promiseList = [
        sonic.insertToAnime(item._id, item.title.romaji),
        sonic.insertToAnime(item._id, item.title.english),
        sonic.insertToAnime(item._id, item.title.japanese),
      ]

      await Promise.all(promiseList)
    }
  }
})
