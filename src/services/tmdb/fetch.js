const axios = require('axios').default

const { tmdbApiKey } = require('../../config')

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    params: {
        api_key: tmdbApiKey
    }
})

const getSearch = async (title) => {
    let animeID = null
    let originalTitle = ''

    const splitedTitles = title.split(' ')

    for (let i = 0, l = splitedTitles.length; i < l; i++) {
        const res = await api.get('/search/tv', {
            params: {
                query: splitedTitles.join(' ')
            }
        })
        const { total_results, results } = res.data

        if (total_results < 1) {
            splitedTitles.pop()
            continue
        }

        // Set the id of the anime to search for
        animeID = results[0].id

        // Set the japanese title
        originalTitle = results[0].original_name

        break
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
            iso_language: `${item.iso_639_1}-${item.iso_3166_1}`,
            title: item.data.name || alt[item.english_name]
        }))

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