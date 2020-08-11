const http = require('http')
const config = require('../config')

module.exports = () => {
    http.createServer((req, res) => {
        res.end()

    }).listen(config.port)
}