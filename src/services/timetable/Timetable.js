const fetchAnilist = require('../anilist/fetch')

const logger = require('../../loaders/logger')

module.exports = class {
    constructor(AnimeModel, TimetableModel, Anime) {
        this.AnimeModel = AnimeModel
        this.TimetableModel = TimetableModel
        this.anime = new Anime(AnimeModel)
    }

    async insertTable(response) {
        for (let day in response) {
            logger.info(`Timetable: Working with ${day} ...`)
    
            const timetableModel = new this.TimetableModel()
    
            timetableModel.day = day

            const item = response[day]
            
            for (let i = 0; i < item.length; i++) {
                const nameToRetrieve = item[i].as || item[i].title

                const isAsFieldExist = item[i].as !== undefined
                const isSeriesExist = await this.anime.isSeriesExist(nameToRetrieve)

                // If It's needed to fetch metadata
                if (!isSeriesExist || isAsFieldExist) {
                    const anilistMetadata = await fetchAnilist(item[i].title)

                    const query = {
                        ...anilistMetadata,
                        name: nameToRetrieve
                    }

                    // If series doesn't exist
                    if (!isSeriesExist) {
                        await this.anime.insertSeries(query)

                    // If `as` field in the timetable exists
                    } else if (isAsFieldExist) {
                        await this.updateTable(nameToRetrieve, query)
                    }
                }

                const fetchedAnime = await this.AnimeModel.findOne({name: nameToRetrieve}).select('_id')

                timetableModel.animes.push(fetchedAnime._id || null)
                
                const [ time, broadcaster ] = item[i].time.split(' ')

                await this.updateTable(nameToRetrieve, {
                    title: {
                        romaji: item[i].title,
                        japanese: item[i].ja_title,
                        english: item[i].eng_title,
                        korean: item[i].kor_title,
                    },
                    released_time: time,
                    release_broadcaster: broadcaster
                })

                logger.debug(`Timetable: Working ${item[i].title}...`)
                
            }
            await this.TimetableModel.deleteMany({ day })
            await timetableModel.save()
        }    
    }
    async updateTable(retrieveWith, form) {
        await this.AnimeModel.findOneAndUpdate({name: retrieveWith}, form)
    }
}