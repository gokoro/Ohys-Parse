const crypto = require('crypto')

// Regex by Seia-soto's ohys-api (https://github.com/Seia-Soto/ohys-api/)
const regex =
  /(?:\[([^\r\n\]]*)\][\W]?)?(?:(?:([^\r\n]+?)(?: - ([\d.]+?)(?: END)?)?)[\W]?[(|[]([^\r\n(]+)? (\d+x\d+|\d+&\d+)? ([^\r\n]+)?[)\]][^.\r\n]*(?:\.([^\r\n.]*)(?:\.[\w]+)?)?)$/

const filter = (title, link) => {
  const parsedTitle = title.split(regex)

  return {
    name: parsedTitle[2] || title,
    info: {
      link,
      episode: Number(parsedTitle[3] || 0),
      broadcaster: parsedTitle[4],
      resolution: parsedTitle[5],
      audioFormat: parsedTitle[6],
      videoFormat: parsedTitle[7],
      original: title,
      hash: createHash(JSON.stringify(title)),
    },
  }
}

const createHash = (str) => {
  const hash = crypto.createHash('md5')
  hash.update(str)

  return hash.digest('base64')
}

module.exports = filter
