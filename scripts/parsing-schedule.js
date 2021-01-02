const mongooseLoader = require('../src/loaders/mongoose')

mongooseLoader()
    .then(() => require('../src/services/timetable')())
    .then(() => process.exit(0))
