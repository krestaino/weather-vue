var keys = require('../.keys')

module.exports = {
  NODE_ENV: '"production"',
  API_KEY: keys.prod,
  API_URL: {
    geocode: '"https://maps.googleapis.com/maps/api/geocode/json?"',
    weather: '"https://api.kmr.io/weather/v1/json?"'
  }
}
