const fetch = require('./fetch')
const registerLogic = require('../anime/registerLogic')

const logger = require('../../loaders/logger')

const collectAll = async () => {
    const list = []
    let page = 50

    while (true) {
        const fetched = await fetch(page)

        if (!fetched) {
            break
        }
        for (let i = 0; i < fetched.length; i++) {
            list.push(fetched[i])

            logger.silly(`Pushed Item to a list ${JSON.stringify(fetched[i])}`)
        }

        logger.info(`Initializing: Fetched ${page} page of ohys!`)
        
        page++
    }

    for (let columnSum = list.length - 1; columnSum >= 0; columnSum--) {
        await registerLogic(list[columnSum])
        logger.info(`Initializing: Checked ${columnSum} item in database!`)
    }
}
module.exports = collectAll
