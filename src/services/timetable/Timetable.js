const logger = require('../../loaders/logger')

module.exports = class Timetable {
    constructor(AnimeModel, TimetableModel) {
        this.AnimeModel = AnimeModel
        this.TimetableModel = TimetableModel
    }

    async insertTable(response) {
        for (let day in response) {
            logger.info(`Timetable: Working with ${day} ...`)
    
            const timetableModel = new this.TimetableModel()
    
            timetableModel.day = day
    
            const item = response[day]
    
            for (let i = 0; i < item.length; i++) {
                const fetchedAnime = await this.AnimeModel.findOne({name: item[i].title}).select('_id') || {}

                timetableModel.animes.push(fetchedAnime._id || null)
                
                this.updateAnimeTitleAsTimetable(
                    item[i].title,
                    item[i].ja_title,
                    item[i].eng_title,
                    item[i].kor_title,
                )

                logger.debug(`Timetable: Working ${item[i].title}...`)
                
            }
            await timetableModel.save()
        }    
    }
    async updateAnimeTitleAsTimetable(...titles) {
        const [romaji, japanese, english, korean] = titles

        const animesForm = {
            title: {
                romaji,
                japanese,
                english,
                korean
            }
        }
        
        await this.AnimeModel.findOneAndUpdate({name: romaji}, animesForm)
    }
}