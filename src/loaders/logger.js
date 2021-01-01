const winston = require('winston')
const config = require('../config')

const logger = winston.createLogger({
    level: config.env === 'development' ? 'debug': 'info',
    
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.ms(),
        winston.format.json()
    ),

    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
            )
        })
    ]
})
module.exports = logger