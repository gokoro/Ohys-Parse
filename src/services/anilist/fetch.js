const axios = require('axios').default

const logger = require('../../loaders/logger')
const { exists } = require('../../models/animes')

module.exports = async animeTitle => {
    if (!animeTitle) {
        logger.error("the title for fetching anilist doesn't exists.")

        return nullForm(animeTitle)
    }
    let response = null

    logger.debug('Fetching anilist: ' + animeTitle)

    response = await fetch(animeTitle)
    
    // If infomations don't exist on Anilist... Handle Exceptions
    if (response.data.hasOwnProperty('errors')) {

        logger.debug('Fetching anilist was failed. Try again...')

        // If the title wasn't splited..
        if (animeTitle.indexOf('[Ohys-Raws]') > -1) {
            logger.error('Trying failed. Reason: Received title is wrong.')

            return nullForm(animeTitle)
        }

        const titleForHandleException = animeTitle.split(' ')
        let handledTitleCount = titleForHandleException.length - 1
        
        while (true) {
            let handledTitle = ''

            for (let i = 0, l = handledTitleCount; i < l; i++) {
                handledTitle = handledTitle + ' ' + titleForHandleException[i]
            }
            logger.debug('Retrieving for anilist with title: ' + handledTitle)

            response = await fetch(handledTitle)

            if (!response.data.hasOwnProperty('errors')) {
                logger.debug('Retrieving successed!')
                break
            }
            handledTitleCount--
        }
    }

    // 'x-ratelimit-remaining' is zero, so Can't fetch anymore.
    if (! Number(response.headers['x-ratelimit-remaining'])) {
        // Sleep due to request limits of the APIs

        const toWaitTime = Number(response.headers["retry-after"] + 1) * 1000

        logger.debug(`Requesting Anilist is limited now. Please waiting for ${toWaitTime} seconds...`)

        await new Promise(r => setTimeout(r, toWaitTime))

        // Fetch again
        logger.debug('Fetch anilist again...')
        response = await fetch(animeTitle)
    }
    logger.silly('Anilist response: ' + JSON.stringify(response.data))
    
    const {
        data: {
            Media: {
                id,
                title,
                season,
                seasonYear,
                coverImage: {
                    extraLarge: imageUrl
                }
            }
        }
    } = response.data

    return {
        id,
        name: animeTitle,
        title: {
            romaji: title.romaji,
            japanese: title.native,
            english: title.english,
        },
        imageUrl,
        season,
        released_year: seasonYear,
    }
}

async function fetch(animeTitle) {
    const url = 'https://graphql.anilist.co'

    const query = `
        query ($animeTitle: String) {
            Media(type: ANIME, search: $animeTitle) {
                id
                title {
                    romaji
                    english
                    native
                }
                season
                seasonYear
                coverImage {
                    extraLarge
                }
            }
        }
    `
    const variables = {
        animeTitle
    }
    return await axios.post(url, null, {
        validateStatus: () => true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        data: {
            query,
            variables
        }
    })
}

function nullForm(name) {
    logger.debug('Anilist returned N/A...')

    return {
        id: null,
        name: name,
        title: {
            romaji: null,
            japanese: null,
            english: null,
        },
        imageUrl: null,
        season: null,
        released_year: null
    }
}
