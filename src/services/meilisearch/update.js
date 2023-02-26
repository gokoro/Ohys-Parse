const { client } = require('../../loaders/meilisearch')

const update = async ({ data, index }) => {
  await client.index(index).addDocuments(data)
}

module.exports = update
