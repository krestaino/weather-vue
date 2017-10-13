var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var keys = require('../keys')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_KEY: keys.dev,
  API_URL: {
    geocode: '"http://localhost:3000/geocode/v1/json?"',
    weather: '"http://localhost:3000/weather/v1/json?"'
  }
})
