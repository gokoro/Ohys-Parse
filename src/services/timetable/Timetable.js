const fetchAnilist = require('../anilist/fetch')
const meilisearch = require('../meilisearch')

const Settings = require('../settings/Settings')
const SettingsModel = require('../../models/setttings')

const logger = require('../../loaders/logger')

module.exports = class {
  constructor(AnimeModel, TimetableModel, Anime) {
    this.AnimeModel = AnimeModel
    this.TimetableModel = TimetableModel
    this.anime = new Anime(AnimeModel)
  }

  async insertTable(response) {
    const settings = new Settings(SettingsModel)
    const replacedTimetable = await settings.getSetting('replaced_timetable')

    for (let day in response) {
      logger.info(`Timetable: Working with ${day} ...`)

      const timetableModel = new this.TimetableModel()

      timetableModel.day = day

      const item = response[day]

      for (let i = 0; i < item.length; i++) {
        let nameToRetrieve = item[i].title

        const fetchedAnime = await this.AnimeModel.findOne({
          name: nameToRetrieve,
        }).select('_id')

        let movedIds

        if (fetchedAnime) {
          movedIds = replacedTimetable.data.find(
            ({ targetId }) => fetchedAnime._id === targetId
          )
        }

        if (movedIds) {
          nameToRetrieve = await this.AnimeModel.findOne({
            _id: movedIds?.replaceId,
          }).select('name')
        }

        const seriesData = await this.AnimeModel.findOne({
          name: nameToRetrieve,
        })
        const seriesAsField =
          seriesData && seriesData.title && seriesData.title.as

        // If It's needed to fetch metadata
        if (!seriesData || seriesAsField) {
          const anilistMetadata = await fetchAnilist(
            seriesAsField || nameToRetrieve
          )

          const query = {
            ...anilistMetadata,
            name: nameToRetrieve,
          }

          // If series doesn't exist
          if (!seriesData) {
            await this.anime.insertSeries(query)
            continue
          } else {
            await this.updateTable(nameToRetrieve, query)
          }
        }

        timetableModel.animes.push(
          movedIds?.replaceId || fetchedAnime._id || null
        )

        const title = {
          romaji: item[i].title,
          japanese: item[i].japanese_title,
          english: item[i].english_title,
          korean: item[i].korean_title,
          as: seriesAsField || '',
        }

        await Promise.all([
          this.updateTable(nameToRetrieve, {
            title,
            released_time: item[i].time,
            release_broadcaster: item[i].broadcaster,
          }),
          meilisearch.insertToAnime({
            data: { _id: seriesData._id, title },
          }),
        ])

        logger.debug(`Timetable: Working ${item[i].title}...`)
      }
      await this.TimetableModel.deleteMany({ day })
      await timetableModel.save()
    }
  }
  async updateTable(retrieveWith, form) {
    await this.AnimeModel.findOneAndUpdate({ name: retrieveWith }, form)
  }
}
