<template>
  <div id="weather">
    <div class="inner fadeIn">
      <form class="search" @submit.prevent="validateBeforeSubmit" :class="{'loading': appState.state === 'loading' }">
        <input data-vv-validate-on="keyup" autofocus name="inputQuery" v-model="inputQuery" v-validate:inputQuery.initial="'required'" :class="{'error': errors.has('inputQuery') }" type="text" placeholder="Search">
        
        <span class="error-note" v-show="errors.has('inputQuery')">Search field can not be blank.</span>
        
        <button class="button" title="Search" type="submit">
          <IconSearch class="icon"></IconSearch>
        </button>

        <button class="button" title="Find your location" v-on:click="findLocation">
          <IconLocationSearch class="icon"></IconLocationSearch>
          <IconLocationLock v-if="locationIcon === 'lock'" class="icon"></IconLocationLock>
          <IconLocationDisabled v-if="locationIcon === 'disabled'" class="icon"></IconLocationDisabled>
        </button>
      </form>

      <div class="weather">     
        <div class="loading-or-error" v-if="appState.state === 'loading' || 'error'">
          <div v-if="appState.state === 'loading'" class="spinner"></div>
          <span>{{ appState.message }}</span>
        </div>

        <div class="weather-inner fadeIn" v-if="appState.state === 'loaded'"> 
          <div class="current">
            <h1 class="location" v-if="geoRes[0]">
              <!-- US filter, try to show 'City, State';
                if no City, show 'State' -->
              <span v-if="geoRes[0].countryCode == 'US'">
                <span v-if="geoRes[0].city">{{ geoRes[0].city }}, {{ geoRes[0].administrativeLevels.level1short }}</span>
                <span v-if="!geoRes[0].city">{{ geoRes[0].administrativeLevels.level1long }}</span>
              </span>
              <!-- Non-US filter, try to show 'City, Country';
                if no City, show 'Admin Level 1, Country';
                if no Admin Level 1, show 'Country';
                if no Country, show 'formattedAddress' -->
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
                  <div class="icon">
                    <span v-if="darkRes.currently.icon === 'clear-day'">
                      <WeatherIconClearDay></WeatherIconClearDay>
                    </span>
                    <span v-if="darkRes.currently.icon === 'clear-night'">
                      <WeatherIconClearNight></WeatherIconClearNight>
                    </span>
                    <span v-if="darkRes.currently.icon === 'cloudy'">
                      <WeatherIconCloudy></WeatherIconCloudy>
                    </span>
                    <span v-if="darkRes.currently.icon === 'partly-cloudy-day'">
                      <WeatherIconPartlyCloudyDay></WeatherIconPartlyCloudyDay>
                    </span>
                    <span v-if="darkRes.currently.icon === 'partly-cloudy-night'">
                      <WeatherIconPartlyCloudyNight></WeatherIconPartlyCloudyNight>
                    </span>
                    <span v-if="darkRes.currently.icon === 'rain'">
                      <WeatherIconRain></WeatherIconRain>
                    </span>
                    <span v-if="darkRes.currently.icon === 'sleet'">
                      <WeatherIconSleet></WeatherIconSleet>
                    </span>
                    <span v-if="darkRes.currently.icon === 'snow'">
                      <WeatherIconSnow></WeatherIconSnow>
                    </span>
                    <span v-if="darkRes.currently.icon === 'wind'">
                      <WeatherIconWind ></WeatherIconWind>
                    </span>
                  </div>
                  <div class="temperature">
                    <div>{{ Math.round(darkRes.currently.temperature) }}</div>
                      <sup :class="units">
                        <button class="us" title="Switch to Fahrenheit" v-on:click="unitChange('us')">°F</button>
                        <button class="si" title="Switch to Celsius" v-on:click="unitChange('si')">°C</button>
                    </sup>
                  </div>
                </div> <!-- end .main -->
              </div> <!-- end .col -->

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
              </div> <!-- end .col -->
            </div> <!-- end .row -->
          </div> <!-- end .current -->

          <div class="forecast">
            <ul class="days">
              <li class="day" v-for="day in darkRes.daily.data">
                <div>{{ day.time * 1000 | moment("ddd") }}</div>
                <div class="icon">
                  <span v-if="day.icon === 'clear-day'">
                    <WeatherIconClearDay></WeatherIconClearDay>
                  </span>
                  <span v-if="day.icon === 'clear-night'">
                    <WeatherIconClearNight></WeatherIconClearNight>
                  </span>
                  <span v-if="day.icon === 'cloudy'">
                    <WeatherIconCloudy></WeatherIconCloudy>
                  </span>
                  <span v-if="day.icon === 'partly-cloudy-day'">
                    <WeatherIconPartlyCloudyDay></WeatherIconPartlyCloudyDay>
                  </span>
                  <span v-if="day.icon === 'partly-cloudy-night'">
                    <WeatherIconPartlyCloudyNight></WeatherIconPartlyCloudyNight>
                  </span>
                  <span v-if="day.icon === 'rain'">
                    <WeatherIconRain></WeatherIconRain>
                  </span>
                  <span v-if="day.icon === 'sleet'">
                    <WeatherIconSleet></WeatherIconSleet>
                  </span>
                  <span v-if="day.icon === 'snow'">
                    <WeatherIconSnow></WeatherIconSnow>
                  </span>
                  <span v-if="day.icon === 'wind'">
                    <WeatherIconWind ></WeatherIconWind>
                  </span>
                </div>
                <div><strong>{{ Math.round(day.temperatureMax) }}°</strong></div>
                <div>{{ Math.round(day.temperatureMin) }}°</div>
              </li>
            </ul>
          </div> <!-- end .forecast -->
        </div> <!-- end .weather-inner -->
      </div> <!-- end .weather -->

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
import IconLocationDisabled from './assets/icons/ui/location_disabled.svg'
import IconLocationSearch from './assets/icons/ui/location_searching.svg'
import IconLocationLock from './assets/icons/ui/my_location.svg'
import IconRefresh from './assets/icons/ui/refresh.svg'
import IconSearch from './assets/icons/ui/search.svg'
import WeatherIconClearDay from './assets/icons/weather/clear_day.svg'
import WeatherIconClearNight from './assets/icons/weather/clear_night.svg'
import WeatherIconCloudy from './assets/icons/weather/cloudy.svg'
import WeatherIconPartlyCloudyDay from './assets/icons/weather/partly_cloudy_day.svg'
import WeatherIconPartlyCloudyNight from './assets/icons/weather/partly_cloudy_night.svg'
import WeatherIconRain from './assets/icons/weather/rain.svg'
import WeatherIconSleet from './assets/icons/weather/sleet.svg'
import WeatherIconSnow from './assets/icons/weather/snow.svg'
import WeatherIconWind from './assets/icons/weather/wind.svg'

export default {
  name: 'weather',

  components: {
    IconLocationDisabled,
    IconLocationSearch,
    IconLocationLock,
    IconRefresh,
    IconSearch,
    WeatherIconClearDay,
    WeatherIconClearNight,
    WeatherIconCloudy,
    WeatherIconPartlyCloudyDay,
    WeatherIconPartlyCloudyNight,
    WeatherIconRain,
    WeatherIconSleet,
    WeatherIconSnow,
    WeatherIconWind
  },

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
        this.coords2words()
        this.background()
      }

      function error () {
        this.setAppState('error', 'No geolocation? No problem. Search away.')
        this.setLocationIcon('disabled')
      }

      navigator.geolocation.getCurrentPosition(success.bind(this), error.bind(this))
    },

    words2coords: function () {
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

    coords2words: function () {
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
        this.words2coords()
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
