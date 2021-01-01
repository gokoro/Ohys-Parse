const mongooseLoader = require('../src/loaders/mongoose')

mongooseLoader().then(() => require('../src/services/timetable')())
