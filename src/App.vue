<template>
  <div id="weather">
    <div class="inner fadeIn">

      <form class="search" @submit.prevent="validateBeforeSubmit" :class="{'loading': appState.state === 'loading' }">
        <div class="search-box">
          <input autofocus :class="{'error': errors.has('inputQuery') }" data-vv-validate-on="keyup" name="inputQuery" v-model="inputQuery" v-validate:inputQuery.initial="'required'" type="text" placeholder="Search">
        </div>
        <div>
          <span class="error-note" v-show="errors.has('inputQuery')">Search field can not be blank.</span>
        </div>
        <div>
          <button class="button" title="Search" type="submit">
            <IconSearch class="icon"></IconSearch>
          </button>
        </div>
        <div>
          <button class="button" title="Find your location" v-on:click="findLocation">
            <span v-if="locationIcon === 'search'">
              <IconLocationSearch></IconLocationSearch>
            </span>
            <span v-else-if="locationIcon === 'lock'">
              <IconLocationLock></IconLocationLock>
            </span>
            <span v-else-if="locationIcon === 'disabled'">
              <IconLocationDisabled></IconLocationDisabled>
            </span>
          </button>
        </div>
      </form>

      <div class="weather">     
        <div class="loading-or-error" v-if="appState.state === 'loading' || 'error'">
          <div v-if="appState.state === 'loading'" class="spinner"></div>
          <span>{{ appState.message }}</span>
        </div>
        <div class="weather-inner fadeIn" v-if="appState.state === 'loaded'"> 
          <Current :darkRes="darkRes" :geoRes="geoRes" :units="units" :unitChangeExtended="unitChange"></Current>
          <Forecast :darkRes="darkRes"></Forecast>
        </div>
      </div>

      <div class="refresh">
        <button class="refresh" title="Refresh" v-on:click="refresh()">
          <IconRefresh></IconRefresh>
          <span class="last fadeIn" v-if="darkRes.currently">Last updated: {{ darkRes.currently.time * 1000 | moment("h:mm A") }}</span>
        </button> 
      </div>
    </div> <!-- end .inner -->
    <div id="map"></div>
  </div> <!-- end #weather -->
</template>

<script>
import GoogleMapsLoader from 'google-maps'
import Current from './components/Current'
import Forecast from './components/Forecast'
import IconLocationDisabled from './assets/icons/ui/location_disabled.svg'
import IconLocationSearch from './assets/icons/ui/location_searching.svg'
import IconLocationLock from './assets/icons/ui/my_location.svg'
import IconRefresh from './assets/icons/ui/refresh.svg'
import IconSearch from './assets/icons/ui/search.svg'

export default {
  name: 'weather',

  components: {
    Current,
    Forecast,
    IconLocationDisabled,
    IconLocationSearch,
    IconLocationLock,
    IconRefresh,
    IconSearch
  },

  methods: {
    background: function () {
      if (process.env.API_KEY) {
        GoogleMapsLoader.KEY = process.env.API_KEY

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
      this.setAppState('loading', 'Determining your location')

      if (!navigator.geolocation) {
        this.setAppState('error', 'Unfortunately, your device does not support geolocation. No problem though, the search still works.')
        return
      }

      function success (position) {
        this.errors.clear()
        this.setLocationIcon('lock')
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude
        this.searchQuery = this.latitude + ' ' + this.longitude
        this.fetchLocationName()
        this.background()
      }

      function error () {
        this.setAppState('error', 'No geolocation? No problem. Search away.')
        this.setLocationIcon('disabled')
      }

      navigator.geolocation.getCurrentPosition(success.bind(this), error.bind(this))
    },

    fetchCoordinates: function () {
      var searchQuery = this.inputQuery
      // Replacing forward and backslash to prevent broken endpoints
      searchQuery = searchQuery.replace(/\//g, ' ').replace(/\\/g, ' ')

      fetch(process.env.API_URL.geocodingEndpoint + searchQuery)
        .then(
          function (response) {
            if (response.status !== 200) {
              this.setAppState('error', 'Uh oh, the geolocation API is not responding. Please try another search.')
              return
            }

            response.json().then(function (data) {
              if (!data.length) {
                this.setAppState('error', 'No results found. Please try another search.')
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
          this.setAppState('error', 'Unknown error, please try again.')
        })
    },

    fetchLocationName: function () {
      fetch(process.env.API_URL.reverseGeocodingEndpoint + this.latitude + '/' + this.longitude)
        .then(
          function (response) {
            if (response.status !== 200) {
              this.setAppState('error', 'Uh oh, the reverse geolocation API is not responding. Please try another search.')
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
          this.setAppState('error', 'Unknown error, please try again.')
        })
    },

    fetchWeather: function () {
      this.setAppState('loading')

      fetch(process.env.API_URL.darkskyEndpoint + this.latitude + '/' + this.longitude + '/' + this.units)
        .then(
          function (response) {
            if (response.status !== 200) {
              this.setAppState('error', 'Uh oh, the weather API is not responding. Please try again.')
              return
            }

            response.json().then(function (data) {
              this.darkRes = data
              this.setAppState('loaded')
            }.bind(this))
          }.bind(this)
        )
        .catch(function () {
          this.setAppState('error', 'Unknown error, please try again.')
        })
    },

    findLocation: function () {
      this.browerGeolocation()
      this.inputQuery = ''
    },

    refresh: function () {
      this.fetchWeather()
      this.errors.clear()
    },

    setAppState: function (state, message) {
      this.appState.state = state
      this.appState.message = message
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
        this.fetchCoordinates()
        this.setLocationIcon('search')
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
      appState: {
        message: '',
        state: 'loading'
      },
      darkRes: {},
      geoRes: {},
      inputQuery: '',
      latitude: '',
      locationIcon: 'search',
      longitude: '',
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
