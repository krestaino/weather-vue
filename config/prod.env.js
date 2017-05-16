var keys = require('../.keys')

module.exports = {
  NODE_ENV: '"production"',
  API_KEY: keys.prod,
  API_URL: {
    darkskyEndpoint: '"https://api.kmr.io/weather/v1/"',
    geocodingEndpoint: '"https://api.kmr.io/geocoding/v1/geocode/"',
    reverseGeocodingEndpoint: '"https://api.kmr.io/geocoding/v1/reverse/"'
  }
}
