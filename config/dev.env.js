var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var keys = require('../.keys')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_KEY: keys.dev,
  API_URL: {
    darkskyEndpoint: '"http://localhost:3000/weather/v1/"',
    geocodingEndpoint: '"http://localhost:3000/geocoding/v1/geocode/"',
    reverseGeocodingEndpoint: '"http://localhost:3000/geocoding/v1/reverse/"'
  }
})
