const config = require('../config')

const { MeiliSearch } = require('meilisearch')

const client = new MeiliSearch({
  host: config.meilisearch.host,
  apiKey: config.meilisearch.key,
})

module.exports.client = client
