const cheerio = require('cheerio')
const axios = require('axios').default
const titleFilter = require('../ohys/titleFilter')

const fetch = async (page) => {
  const plainData = await fetcher(page)
  const $ = cheerio.load(plainData)

  const torrents = $('table.torrent-list tbody tr')
    .map((i, element) => filterData(element))
    .toArray()

  return torrents.map(({ name, link }) => titleFilter(name, link))
}

const fetcher = async (page) => {
  const fetchUrl = `https://nyaa.si/user/ohys?f=0&c=1_4&q=&p=${page}`
  const { data } = await axios.get(fetchUrl)

  return data
}

const filterData = (column) => {
  const $ = cheerio.load(column)

  const name = $('td[colspan="2"] a:not(.comments)').text()
  // const link = 'https://nyaa.si' + $('td.text-center a').attr('href')
  const link = $('td.text-center a').attr('href')

  return { name, link }
}

module.exports = fetch
