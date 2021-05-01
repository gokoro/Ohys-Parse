const axios = require('axios').default
const crypto = require('crypto')

// Regex by Seia-soto's ohys-api (https://github.com/Seia-Soto/ohys-api/blob/master/ohys/serializeTitle.js)

const regex = /(?:\[([^\r\n\]]*)\][\W]?)?(?:(?:([^\r\n]+?)(?: - ([\d.]+?)(?: END)?)?)[\W]?[(|[]([^\r\n(]+)? (\d+x\d+|\d+&\d+)? ([^\r\n]+)?[)\]][^.\r\n]*(?:\.([^\r\n.]*)(?:\.[\w]+)?)?)$/

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
    const titleNewer = {}

    const parsedTitle = title.split(regex)

    titleNewer.name = parsedTitle[2] || title

    titleNewer.episode = parsedTitle[3] || '0'
    titleNewer.broadcaster = parsedTitle[4]
    titleNewer.resolution = parsedTitle[5]
    titleNewer.audioFormat = parsedTitle[6]
    titleNewer.videoFormat = parsedTitle[7]

    titleNewer.link = 'https://ohys.nl/tt/' + parsedData[i]['a']
    titleNewer.hash = createHash(JSON.stringify(parsedData[i]))
    titleNewer.original = title

    const organizedTitle = new Anime(titleNewer)
    list.push(organizedTitle)
  }
  if (list.length === 0) {
    return null
  }
  return list
}

function Anime({
  name,
  episode,
  broadcaster,
  resolution,
  audioFormat,
  videoFormat,
  link,
  original,
  hash,
}) {
  this.name = name
  this.info = {
    episode: Number(episode),
    link,
    resolution,
    audioFormat,
    videoFormat,
    broadcaster,
    original,
    hash,
  }
}

function createHash(str) {
  const hash = crypto.createHash('md5')
  hash.update(str)

  return hash.digest('base64')
}

module.exports = fetch
