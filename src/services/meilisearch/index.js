module.exports.insert = require('./insert')
module.exports.update = require('./update')

module.exports.insertToAnime = async ({ data }) => {
  await this.insert({ data, index: 'animes' })
}

module.exports.updateToAnime = async ({ data }) => {
  await this.update({ data, index: 'animes' })
}

module.exports.isValid = (title) => {
  for (const regex of denyWords) {
    if (regex.test(title)) {
      return false
    }
  }

  return true
}

const denyWords = [
  /OVA/,
  /OAD/,
  /SP/,
  /OP/,
  /ED/,
  /Preview/,
  /Gekijouban/,
  /\[Ohys-Raws\]/,
  /- [0-9]{2,}/,
  /-[0-9]{2,}/,
]
