const mongooseLoader = require('../src/loaders/mongoose')

mongooseLoader()
  .then(() => require('../src/services/anime').start())
  .then(() => process.exit(0))
