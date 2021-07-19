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
