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
                const isSeriesExist = await this.anime.isSeriesExist(item[i].title)

                if (!isSeriesExist) {
                    await this.anime.insertSeries(
                        await fetchAnilist(item[i].title)
                    )
                }

                const fetchedAnime = await this.AnimeModel.findOne({name: item[i].title}).select('_id') || {}

                timetableModel.animes.push(fetchedAnime._id || null)
                
                const [ time, broadcaster ] = item[i].time.split(' ')

                await this.updateTable({
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
            await timetableModel.save()
        }    
    }
    async updateTable(form) {
        await this.AnimeModel.findOneAndUpdate({name: form.title.romaji}, form)
    }
}