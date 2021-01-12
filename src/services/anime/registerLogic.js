// Mongoose Model for animes documents
const AnimeModel = require('../../models/animes')

// Class
const Anime = require('./Anime')

const logger = require('../../loaders/logger')

const fetchAnilist = require('../anilist/fetch')

const registerLogic = async fetched => {
    const anime = new Anime(AnimeModel)
    const isSeriesExist = await anime.isSeriesExist(fetched.name)
    
    if (!isSeriesExist) {
        logger.info('The new series exists: ' + fetched.name)

        await anime.insertSeries(
            await fetchAnilist(fetched.name)
        )

        await anime.insertItem(
            fetched
        )
        return
    }
    
    const isItemExist = await anime.isItemExist(fetched)

    if (!isItemExist) {
        logger.info('The new item exists: ' + fetched.name)

        await anime.insertItem(
            fetched
        )

        const nameToRetrieve = await anime.selectNameToRetrieve(fetched.name)
        console.log("~ nameToRetrieve", nameToRetrieve)
        const anilistResponse = await fetchAnilist(nameToRetrieve) 
        console.log("~ anilistResponse", anilistResponse)
        delete anilistResponse.title

        await anime.updateSeriesInfo({
            ...anilistResponse,
            name: fetched.name
        })
        
        return
    }
}
module.exports = registerLogic