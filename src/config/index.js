const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    databaseURL: process.env.DATABASE_URL || '',
    databaseName: process.env.DATABASE_NAME || '',

    logLevel: process.env.LOG_LEVEL || 'info'
}
