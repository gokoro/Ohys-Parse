const mongoose = require('mongoose')
const config = require('../config')

module.exports = async () => {
  const connection = await mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    dbName: config.databaseName,
  })

  return connection.connection.db
}
