const { Search, Ingest } = require('sonic-channel')
const config = require('../config')

let sonicSearchClient = null
let sonicIngestClient = null

const getSearchConnection = () => {
  if (!sonicSearchClient) {
    sonicSearchClient = new Search(config.sonic).connect()
  }
  return sonicSearchClient
}

const getIngestConnection = () => {
  if (!sonicIngestClient) {
    sonicIngestClient = new Ingest(config.sonic).connect()
  }
  return sonicIngestClient
}

module.exports.search = getSearchConnection()
module.exports.ingest = getIngestConnection()
