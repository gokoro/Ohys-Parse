const sonic = require('../../loaders/sonic')

const search = async ({ collection, bucket, text }) => {
  return await sonic.search.query(collection, bucket, text)
}

module.exports = search
