const sonic = require('../../loaders/sonic')

const insert = async ({ collection, bucket, key, text }) => {
  await sonic.ingest.push(collection, bucket, key, text)
}

module.exports = insert
