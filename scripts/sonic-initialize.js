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
      if (!item._id) {
        continue
      }

      if (item.title.romaji) {
        await sonic.insert({
          collection: 'anime',
          bucket: 'default',
          key: item._id,
          text: item.title.romaji,
        })
      }

      if (item.title.english) {
        await sonic.insert({
          collection: 'anime',
          bucket: 'default',
          key: item._id,
          text: item.title.english,
        })
      }

      if (item.title.japanese) {
        await sonic.insert({
          collection: 'anime',
          bucket: 'default',
          key: item._id,
          text: item.title.japanese,
        })
      }
    }
  }
})
