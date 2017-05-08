<template>
  <div id="app">

    <div class="weather-card fadeIn">
      <Search :appState="appState" :locationIcon="locationIcon" v-on:findLocationEmit="browerGeolocation()" v-on:validateBeforeSubmitEmit="validateBeforeSubmit($event)"></Search>

      <div class="weather-card-inner">     
        <div class="current-and-forecast fadeIn" v-if="appState.state === 'loaded'"> 
          <Current :darkRes="darkRes" :geoRes="geoRes" :units="units" :unitChangeExtended="unitChange"></Current>
          <Forecast :darkRes="darkRes"></Forecast>
        </div>

        <div class="loading-or-error" v-if="appState.state === 'loading' || 'error'">
          <div v-if="appState.state === 'loading'" class="spinner"></div>
          <span>{{ appState.message }}</span>
        </div>
      </div>

      <div class="refresh">
        <button class="refresh" title="Refresh" v-on:click="refresh()">
          <IconRefresh></IconRefresh>
          <span class="last fadeIn" v-if="darkRes.currently">Last updated: {{ darkRes.currently.time * 1000 | moment("h:mm A") }}</span>
        </button> 
      </div>
    </div>

    <Background :latitude="latitude" :longitude="longitude"></Background>
  </div>
</template>

<script>
import Background from './components/Background'
import Search from './components/Search'
import Current from './components/Current'
import Forecast from './components/Forecast'
import IconRefresh from './assets/icons/ui/refresh.svg'

export default {
  name: 'weather',

  components: {
    Background,
    Search,
    Current,
    Forecast,
    IconRefresh
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
      longitude: '',
      locationIcon: 'search',
      units: 'us'
    }
  },

  methods: {
    browerGeolocation () {
      this.setAppState('loading', 'Determining your location')

      if (!navigator.geolocation) {
        this.setAppState('error', 'Unfortunately, your device does not support geolocation. No problem though, the search still works.')
        return
      }

      let success = (position) => {
        this.errors.clear()
        this.setLocationIcon('lock')
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude
        this.searchQuery = this.latitude + ' ' + this.longitude
        this.fetchLocationName()
      }

      let error = () => {
        this.setAppState('error', 'No geolocation? No problem. Search away.')
        this.setLocationIcon('disabled')
      }

      navigator.geolocation.getCurrentPosition(success, error)
    },

    fetchCoordinates () {
      var searchQuery = this.inputQuery
      // Replacing forward and backslash to prevent broken endpoints
      searchQuery = searchQuery.replace(/\//g, ' ').replace(/\\/g, ' ')

      fetch(process.env.API_URL.geocodingEndpoint + searchQuery)
        .then(
          (response) => {
            if (response.status !== 200) {
              this.setAppState('error', 'Uh oh, the geolocation API is not responding. Please try another search.')
              return
            }

            response.json().then((data) => {
              if (!data.length) {
                this.setAppState('error', 'No results found. Please try another search.')
                return
              }

              this.latitude = data[0].latitude
              this.longitude = data[0].longitude
              this.geoRes = data
              this.fetchWeather()
            })
          }
        )
        .catch(function () {
          this.setAppState('error', 'Unknown error, please try again.')
        })
    },

    fetchLocationName () {
      fetch(process.env.API_URL.reverseGeocodingEndpoint + this.latitude + '/' + this.longitude)
        .then(
          (response) => {
            if (response.status !== 200) {
              this.setAppState('error', 'Uh oh, the reverse geolocation API is not responding. Please try another search.')
              return
            }

            response.json().then((data) => {
              this.latitude = data[0].latitude
              this.longitude = data[0].longitude
              this.geoRes = data
              this.fetchWeather()
            })
          }
        )
        .catch(function () {
          this.setAppState('error', 'Unknown error, please try again.')
        })
    },

    fetchWeather () {
      this.setAppState('loading')

      fetch(process.env.API_URL.darkskyEndpoint + this.latitude + '/' + this.longitude + '/' + this.units)
        .then(
          (response) => {
            if (response.status !== 200) {
              this.setAppState('error', 'Uh oh, the weather API is not responding. Please try again.')
              return
            }

            response.json().then((data) => {
              this.darkRes = data
              this.setAppState('loaded')
            })
          }
        )
        .catch(function () {
          this.setAppState('error', 'Unknown error, please try again.')
        })
    },

    refresh () {
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

    updateInputQuery (query) {
      this.inputQuery = query
    },

    validateBeforeSubmit (query) {
      this.$validator.validateAll().then(() => {
        this.updateInputQuery(query)
        this.setAppState('loading')
        this.fetchCoordinates()
        this.setLocationIcon('search')
      })
      .catch(() => {
        return
      })
    }
  },

  mounted () {
    this.browerGeolocation()
  }
}
</script>

<style lang="scss">
@import 'scss/_vars.scss';
@import 'scss/_animations.scss';
@import 'scss/_base.scss';
@import 'scss/partials/_spinner.scss';

#app {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.weather-card {
  background-color: #fbfbfb;
  border-radius: 3px;
  box-shadow: 0px 0px 150px 0px rgba(0,0,0,0.5);
  color: #96969f;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  min-height: 510px;
  padding: 30px;
  position: relative;
  width: 100%;
  z-index: 1;
}

.search,
.weather-card-inner,
.current-and-forecast,
.current,
.forecast {
  display: flex;
  flex-direction: column;
}

.weather-card-inner {
  flex: 1;
  justify-content: space-between;
  margin-top: 30px;
}

.current-and-forecast {
  flex: 1;
  position: relative;

  .current,
  .forecast {
    flex: 1;

    svg {
      height: auto;
      width: 100%;
    }
  }
}

.loading-or-error {
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;

  .spinner {
    margin-bottom: 10px;
  }

  span {
    font-size: 16px;
    height: 16px;
  }
}

.refresh {
  align-items: center;
  bottom: 5px;
  display: flex;
  left: 5px;
  position: absolute;
  width: 100%;

  button {
    margin: 0;
    opacity: .75;
    padding: 0;
    
    img {
      transition: 0.3s;
    }

    &:hover {
      img {
        transform: rotate(45deg);
      }
    }
  }

  .last {
    color: #a1a1a9;
    font-size: 14px;
    margin-left: 5px;
  }
}
</style>
