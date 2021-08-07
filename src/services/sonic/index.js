module.exports.search = require('./search')
module.exports.insert = require('./insert')

module.exports.insertToAnime = async (id, title) => {
  if (!id || !title) {
    return
  }

  await this.insert({
    collection: 'anime',
    bucket: 'default',
    key: id,
    text: title,
  })
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
