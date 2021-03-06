const axios = require('axios').default

const logger = require('../../loaders/logger')

module.exports = async (animeTitle) => {
  try {
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

      while (true) {
        titleForHandleException.pop()

        const splitedTitle = [...titleForHandleException].join(' ')

        logger.debug('Retrieving for anilist with title: ' + splitedTitle)

        response = await fetch(splitedTitle)

        if (!response.data.hasOwnProperty('errors')) {
          logger.debug('Retrieving successed!')
          break
        }

        if (titleForHandleException.length === 0) {
          return nullForm(animeTitle)
        }
      }
    }

    // 'x-ratelimit-remaining' is zero, so Can't fetch anymore.
    if (!Number(response.headers['x-ratelimit-remaining'])) {
      // Sleep due to request limits of the APIs

      const toWaitTime = Number(response.headers['x-ratelimit-limit']) + 1

      logger.info(
        `Requesting Anilist is limited now. Please waiting for ${toWaitTime} seconds...`
      )

      await new Promise((r) => setTimeout(r, toWaitTime * 1000))

      // Fetch again
      logger.debug('Fetch anilist again...')
      response = await fetch(animeTitle)
    }
    logger.silly('Anilist response: ' + JSON.stringify(response.data))

    const {
      data: { Media },
    } = response.data

    return {
      id: Media.id,
      name: animeTitle,
      title: {
        romaji: Media.title.romaji,
        japanese: Media.title.native,
        english: Media.title.english,
      },
      description: (Media.description || '').replace(/<[^>]*>/g, ''),
      imageUrl: Media.coverImage.extraLarge,
      smallImageUrl: Media.coverImage.large,
      bannerImage: Media.bannerImage,
      color: Media.coverImage.color,
      season: Media.season,
      released_year: Media.seasonYear,
      episode_info: Media.streamingEpisodes,
    }
  } catch (error) {
    return nullForm()
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
                description
                season
                seasonYear
                coverImage {
                    extraLarge
                    large
                    color
                }
                bannerImage
                streamingEpisodes {
                    title
                    thumbnail
                }
            }
        }
    `
  const variables = {
    animeTitle,
  }
  return await axios.post(
    url,
    {
      query,
      variables,
    },
    {
      validateStatus: () => true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  )
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
    smallImageUrl: null,
    bannerImage: null,
    color: null,
    season: null,
    released_year: null,
    description: null,
    episode_info: {
      title: null,
      thumbnail: null,
    },
  }
}
