const http = require('http')
const axios = require('axios')
const config = require('../config')

const logger = require('../loaders/logger')

module.exports = () => {
    http.createServer((req, res) => {
        res.end()

    }).listen(config.port)

    setInterval(async () => {
        await axios(config.appURL)

        logger.info('Fetched not to sleep for Heroku server')
    }, 10 * 60 * 1000)
}