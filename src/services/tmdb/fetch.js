const axios = require('axios').default

const { tmdbApiKey } = require('../../config')

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    params: {
        api_key: tmdbApiKey
    }
})

const getSearch = async (title, splitSize = ' ') => {
    let animeID = null
    let originalTitle = ''

    const splittedTitles = title.split(splitSize)

    for (let i = 0, l = splittedTitles.length; i < l; i++) {
        const res = await api.get('/search/tv', {
            params: {
                query: splittedTitles.join(splitSize)
            }
        })
        const { total_results, results } = res.data

        if (total_results < 1) {
            splittedTitles.pop()
            continue
        }

        // Set the id of the anime to search for
        animeID = results[0].id

        // Set the japanese title
        originalTitle = results[0].original_name

        break
    }

    if (splittedTitles.length < 1 && splitSize === ' ') {
        return await getSearch(title, '')
    }

    if (splittedTitles.length < 1 && splitSize === '') {
        return
    }

    return { animeID, originalTitle }
}

const getDetail = async (id) => {
    const { data } = await api.get(`/tv/${id}`)

    return data
}

const getTranslated = async (id, alt = {}) => {
    const res = await api.get(`/tv/${id}/translations`)
    const { translations } = res.data

    const titles = translations
        .filter(item => ['US', 'JP', 'KR'].includes(item.iso_3166_1))
        .map(item => ({
            language: item.english_name,
            title: item.data.name || alt[item.english_name]
        }))

    Object.keys(alt).forEach(altLanguage => {
        if (!titles.some(item => item.language === altLanguage)) {
            titles.push({
                language: altLanguage,
                title: alt[altLanguage]
            })
        }
    })

    return titles
}

const fetch = async (inputTitle) => {
    const { animeID, originalTitle } = await getSearch(inputTitle)
    const { seasons } = await getDetail(animeID)
    const titles = await getTranslated(animeID, { Japanese: originalTitle, English: inputTitle, Korean: inputTitle })

    const currentSeason = seasons[seasons.length - 1].season_number

    if (currentSeason > 1) {
        titles.forEach(({ language }, idx) => {
            // Set expressions for each language
            const seasonExp =
                language === 'English' ? `Season ${currentSeason}` : 
                language === 'Japanese' ? `シーズン${currentSeason}` : `${currentSeason}기`

            titles[idx].title += ` ${seasonExp}`
        })
    }

    return {
        id: animeID,
        titles
    }
}

module.exports = fetch