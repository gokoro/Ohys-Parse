const { client } = require('../../loaders/meilisearch')

const insert = async ({ data, index }) => {
  await client.index(index).addDocuments(data)
}

module.exports = insert
