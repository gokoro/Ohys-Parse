const axios = require('axios').default
const titleFilter = require('./titleFilter')

const fetch = async (page) => {
  const url = 'https://ohys.nl/tt/json.php?dir=disk&q&p=' + page
  const list = []

  const response = await axios.get(url)
  let parsedData = null

  try {
    parsedData = response.data
  } catch (err) {
    return null
  }
  for (let i = 0; i < parsedData.length; i++) {
    const title = parsedData[i]['t']
    const link = 'https://ohys.nl/tt/' + parsedData[i]['a']

    const filteredData = titleFilter(title, link)

    list.push(filteredData)
  }
  if (list.length === 0) {
    return null
  }
  return list
}

module.exports = fetch
