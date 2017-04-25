<template>
  <div id="weather">
    <div class="inner fadeIn">

      <form class="search" @submit.prevent="validateBeforeSubmit" :class="{'loading': appState === 'loading' }">
        <input data-vv-validate-on="keyup" autofocus name="inputQuery" v-model="inputQuery" v-validate:inputQuery.initial="'required'" :class="{'error': errors.has('inputQuery') }" type="text" placeholder="Search">
        
        <span class="error-note" v-show="errors.has('inputQuery')">Search field can not be blank.</span>
        
        <button class="button" title="Search" type="submit">
          <img class="icon" v-bind:src="'/static/icons/ui/ic_search_black_24px.svg'">
        </button>

        <button class="button" title="Find your location" v-on:click="findLocation()">
          <img class="icon" v-bind:src="'/static/icons/ui/'+locationIcon">
        </button>
      </form>

      <div class="weather">
        
        <div class="spinner" v-if="appState === 'loading'"></div>
        <div v-else-if="appState === 'error'">{{ setAppStateError }}</div>
        <div class="weather-inner fadeIn" v-else-if="appState === 'loaded'">
          
          <div class="current">
            <h1 class="location" v-if="geoRes[0]">
              <!-- US filter, try to show 'City, State';
                if no City, show 'State' -->
              <span v-if="geoRes[0].countryCode == 'US'">
                <span v-if="geoRes[0].city">{{ geoRes[0].city }}, {{ geoRes[0].administrativeLevels.level1short }}</span>
                <span v-if="!geoRes[0].city">{{ geoRes[0].administrativeLevels.level1long }}</span>
              </span>
              <!-- Non-US filter, try to show 'City, County';
                if no City, show 'Admin Level 1, County';
                if no Admin Level 1, show 'County';
                if no County, show 'formattedAddress' -->
              <span v-if="geoRes[0].countryCode != 'US'">
                <span v-if="geoRes[0].city">{{ geoRes[0].city }}, </span>
                <span v-if="!geoRes[0].city">
                  <span v-if="geoRes[0].administrativeLevels.level1long">{{ geoRes[0].administrativeLevels.level1long }}, </span>
                </span>
                <span v-if="geoRes[0].country">{{ geoRes[0].country }}</span>
                <span v-if="!geoRes[0].country">{{ geoRes[0].formattedAddress }}</span>
              </span>
              <span class="weak">{{ geoRes[0].zipcode }}</span>
            </h1>

            <div class="row">

              <div class="col">
                <div>{{ darkRes.currently.time * 1000 | moment("dddd, MMMM Do") }}</div>
                <div>{{ darkRes.currently.summary }}</div>
                <div class="main">
                  <img class="icon" v-bind:src="'/static/icons/weather/'+darkRes.currently.icon+'.svg'">
                  <div class="temperature">
                    <div>{{ Math.round(darkRes.currently.temperature) }}</div>
                      <sup :class="units">
                        <button class="us" title="Switch to Fahrenheit" v-on:click="unitChange('us')">°F</button>
                        <button class="si" title="Switch to Celsius" v-on:click="unitChange('si')">°C</button>
                    </sup>
                  </div>
                </div>
              </div>

              <div class="col details">
                <div>Precipitation: 
                  <strong>{{ darkRes.currently.precipProbability }}%</strong>
                </div>
                <div>Cloud Coverage: 
                  <strong>{{ darkRes.currently.cloudCover }}%</strong>
                </div>
                <div>Humidity: 
                  <strong>{{ darkRes.currently.humidity }}%</strong>
                </div>
                <div>Dew Point: 
                  <strong>
                    {{ Math.round(darkRes.currently.dewPoint) }}°<span v-if="units === 'us'">F</span><span v-else>C</span>
                  </strong>
                </div>
                <div>Wind: 
                  <strong>{{ darkRes.currently.windSpeed }} 
                    <span v-if="units === 'us'">mph</span><span v-else>kph</span>
                  </strong>
                </div>
                <div>Visibility: 
                  <strong>{{ darkRes.currently.visibility }} 
                    <span v-if="units === 'us'">miles</span>
                    <span v-else>km</span>
                  </strong>
                </div>
                <div>Sunrise: 
                  <strong>{{ darkRes.daily.data[0].sunriseTime * 1000 | moment("h:mm A") }}</strong>
                </div>
                <div>Sunset: 
                  <strong>{{ darkRes.daily.data[0].sunsetTime * 1000 | moment("h:mm A") }}</strong>
                </div>
              </div>

            </div> <!-- end .weather-inner -->
          </div> <!-- end .weather -->

          <div class="forecast">
            <ul class="days">
              <li class="day" v-for="day in darkRes.daily.data">
                <div>{{ day.time * 1000 | moment("ddd") }}</div>
                <img class="icon" v-bind:src="'/static/icons/weather/'+day.icon+'.svg'">
                <div><strong>{{ Math.round(day.temperatureMax) }}°</strong></div>
                <div>{{ Math.round(day.temperatureMin) }}°</div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div class="refresh">
        <button class="refresh" title="Refresh" v-on:click="refresh()">
          <img src="/static/icons/ui/ic_refresh_black_24px.svg">
          <span class="last fadeIn" v-if="darkRes.currently">Last updated: {{ darkRes.currently.time * 1000 | moment("h:mm A") }}</span>
        </button> 
      </div>

    </div> <!-- end .inner -->

    <div id="map"></div>

  </div> <!-- end #weather -->
</template>

<script>
import GoogleMapsLoader from 'google-maps'

export default {
  name: 'weather',

  methods: {
    background: function () {
      if (window.innerWidth > 550) {
        GoogleMapsLoader.KEY = 'AIzaSyDsGZx5bZluCWBpTRvWDerUIqFka7r7dmI'

        GoogleMapsLoader.load(function (google) {
          /* eslint-disable no-new */
          new google.maps.Map(document.getElementById('map'), {
            center: {lat: this.latitude, lng: this.longitude},
            disableDefaultUI: true,
            draggable: false,
            scrollwheel: false,
            mapTypeControl: false,
            mapTypeId: 'satellite',
            navigationControl: false,
            scaleControl: false,
            zoom: 8
          })
        }.bind(this))
      }
    },

    browerGeolocation: function () {
      if (!navigator.geolocation) {
        this.setAppState('error')
        this.setAppStateError = 'Unfortunately, your device does not support geolocation. No problem though, the search still works.'
        return
      }

      function success (position) {
        this.errors.clear()
        this.setLocationIcon(this.locationIconLock)
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude
        this.searchQuery = this.latitude + ' ' + this.longitude
        this.coords2words()
        this.background()
      }

      function error () {
        this.setAppState('error')
        this.setAppStateError = 'No geolocation? No problem. Search away.'
        this.setLocationIcon(this.locationIconDisabled)
      }

      navigator.geolocation.getCurrentPosition(success.bind(this), error.bind(this))
    },

    words2coords: function () {
      var searchQuery = this.inputQuery
      // Replacing forward and backslash to prevent broken endpoints
      searchQuery = searchQuery.replace(/\//g, ' ').replace(/\\/g, ' ')

      fetch(this.geocodingEndpoint + searchQuery)
        .then(
          function (response) {
            if (response.status !== 200) {
              this.setAppState('error')
              this.setAppStateError = 'Uh oh, the geolocation API is not responding. Please try another search.'
              return
            }

            response.json().then(function (data) {
              if (!data.length) {
                this.setAppState('error')
                this.setAppStateError = 'No results found. Please try another search.'
                return
              }

              this.latitude = data[0].latitude
              this.longitude = data[0].longitude
              this.geoRes = data
              this.fetchWeather()
              this.background()
            }.bind(this))
          }.bind(this)
        )
        .catch(function () {
          this.setAppState('error')
        })
    },

    coords2words: function () {
      fetch(this.reverseGeocodingEndpoint + this.latitude + '/' + this.longitude)
        .then(
          function (response) {
            if (response.status !== 200) {
              this.setAppState('error')
              this.setAppStateError = 'Uh oh, the reverse geolocation API is not responding. Please try another search.'
              return
            }

            response.json().then(function (data) {
              this.latitude = data[0].latitude
              this.longitude = data[0].longitude
              this.geoRes = data
              this.fetchWeather()
            }.bind(this))
          }.bind(this)
        )
        .catch(function () {
          this.setAppState('error')
        })
    },

    fetchWeather: function () {
      this.setAppState('loading')

      fetch(this.darkskyEndpoint + this.latitude + '/' + this.longitude + '/' + this.units)
        .then(
          function (response) {
            if (response.status !== 200) {
              this.setAppState('error')
              this.setAppStateError = 'Uh oh, the weather API is not responding. Please try again.'
              return
            }

            response.json().then(function (data) {
              this.darkRes = data
              this.setAppState('loaded')
            }.bind(this))
          }.bind(this)
        )
        .catch(function () {
          this.setAppState('error')
        })
    },

    findLocation: function () {
      this.setAppState('loading')
      this.browerGeolocation()
      this.inputQuery = ''
    },

    refresh: function () {
      this.fetchWeather()
      this.errors.clear()
    },

    setAppState: function (state) {
      this.appState = state
    },

    setLocationIcon: function (icon) {
      this.locationIcon = icon
    },

    unitChange: function (unit) {
      this.units = unit
      this.fetchWeather()
    },

    validateBeforeSubmit: function () {
      this.$validator.validateAll().then(function () {
        this.setAppState('loading')
        this.words2coords()
        this.setLocationIcon(this.locationIconSearching)
      }.bind(this)).catch(function () {
        return
      })
    }
  },

  mounted: function () {
    this.browerGeolocation()
  },

  data () {
    return {
      appState: 'loading',
      darkRes: {},
      darkskyEndpoint: 'https://api.kmr.io/weather/v1/',
      geocodingEndpoint: 'https://api.kmr.io/geocoding/v1/geocode/',
      geoRes: {},
      inputQuery: '',
      latitude: '',
      locationIcon: 'ic_location_searching_black_24px.svg',
      locationIconDisabled: 'ic_location_disabled_black_24px.svg',
      locationIconLock: 'ic_my_location_black_24px.svg',
      locationIconSearching: 'ic_location_searching_black_24px.svg',
      longitude: '',
      reverseGeocodingEndpoint: 'https://api.kmr.io/geocoding/v1/reverse/',
      setAppStateError: '',
      units: 'us'
    }
  }
}
</script>

<style lang="scss">
@import 'scss/_vars.scss';
@import 'scss/_animations.scss';
@import 'scss/_base.scss';
@import 'scss/_weather.scss';
@import 'scss/partials/_spinner.scss';
</style>
