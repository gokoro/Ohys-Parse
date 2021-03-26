const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  env: process.env.NODE_ENV || 'production',

  databaseURL: process.env.DATABASE_URL || '',
  databaseName: process.env.DATABASE_NAME || '',

  logLevel: process.env.LOG_LEVEL || 'info',

  season: process.env.SEASON || '',

  fakeServer: process.env.FAKE_SERVER || 'false',
  port: process.env.PORT || 5000,
  appURL: process.env.APP_URL || '',

  ohysGithubUrl: process.env.OHYS_GITHUB_URL || '',

  currentYear: process.env.CURRENT_YEAR || '',
  currentSeason: process.env.CURRENT_SEASON || '',

  tmdbApiKey: process.env.TMDB_API_KEY || '',
}
