<template>
  <div id="weather">
    <div class="inner fadeIn">
      <form class="search" @submit.prevent="validateBeforeSubmit" :class="{'loading': appState === 'loading' }">
        <input data-vv-validate-on="keyup" autofocus name="inputQuery" v-model="inputQuery" v-validate:inputQuery.initial="'required'" :class="{'error': errors.has('inputQuery') }" type="text" placeholder="Search">
        <span class="error-note" v-show="errors.has('inputQuery')">Search field can not be blank.</span>
        <button class="button" title="Search" type="submit">
          <img class="icon" v-bind:src="'/static/icons/ui/ic_search_black_24px.svg'">
        </button>

        <button class="button" title="Find your location" v-on:click="setAppState('loading') + browerGeolocation() + emptyQuery()">
          <img class="icon" v-bind:src="'/static/icons/ui/'+locationIcon">
        </button>
      </form>

      <div class="weather">
        <div class="spinner" v-if="appState === 'loading'"></div>
        <div v-else-if="appState === 'error'">{{ setAppStateError }}</div>
        <div class="weather-inner fadeIn" v-else-if="appState === 'loaded'">
          <div class="current">
            <div class="row">
              <div class="col">
                <div class="location" v-if="geocodingResponse[0]">
                  <!-- US filter, try to show 'City, State';
                    if no City, show 'State' -->
                  <span v-if="geocodingResponse[0].countryCode == 'US'">
                    <span v-if="geocodingResponse[0].city">{{ geocodingResponse[0].city }}, {{ geocodingResponse[0].administrativeLevels.level1short }}</span>
                    <span v-if="!geocodingResponse[0].city">{{ geocodingResponse[0].administrativeLevels.level1long }}</span>
                  </span>
                  <!-- Non-US filter, try to show 'City, County';
                    if no City, show 'Admin Level 1, County';
                    if no Admin Level 1, show 'County';
                    if no County, show 'formattedAddress' -->
                  <span v-if="geocodingResponse[0].countryCode != 'US'">
                    <span v-if="geocodingResponse[0].city">{{ geocodingResponse[0].city }}, </span>
                    <span v-if="!geocodingResponse[0].city">
                      <span v-if="geocodingResponse[0].administrativeLevels.level1long">{{ geocodingResponse[0].administrativeLevels.level1long }}, </span>
                    </span>
                    <span v-if="geocodingResponse[0].country">{{ geocodingResponse[0].country }}</span>
                    <span v-if="!geocodingResponse[0].country">{{ geocodingResponse[0].formattedAddress }}</span>
                  </span>
                  <span class="weak">{{ geocodingResponse[0].zipcode }}</span>
                </div>
                <div>{{ darkskyResponse.currently.time * 1000 | moment("dddd, MMMM Do") }}</div>
                <div>{{ darkskyResponse.currently.summary }}</div>
                <div class="main">
                  <img class="icon" v-bind:src="'/static/icons/weather/'+darkskyResponse.currently.icon+'.svg'">
                  <div class="temperature">
                    <div>{{ Math.round(darkskyResponse.currently.temperature) }}</div>
                      <sup :class="units">
                        <button class="us" title="Switch to Fahrenheit" v-on:click="unitChange('us')">°F</button>
                        <button class="si" title="Switch to Celsius" v-on:click="unitChange('si')">°C</button>
                    </sup>
                  </div>
                </div>
              </div>

              <div class="col details">
                <div>Precipitation: <strong>{{ darkskyResponse.currently.precipProbability }}%</strong></div>
                <div>Cloud Coverage: <strong>{{ darkskyResponse.currently.cloudCover }}%</strong></div>
                <div>Humidity: <strong>{{ darkskyResponse.currently.humidity }}%</strong></div>
                <div>Dew Point: <strong>{{ Math.round(darkskyResponse.currently.dewPoint) }}°<span v-if="units === 'us'">F</span><span v-else>C</span></strong></div>
                <div>Wind: <strong>{{ darkskyResponse.currently.windSpeed }} <span v-if="units === 'us'">mph</span><span v-else>kph</span></strong></div>
                <div>Visibility: <strong>{{ darkskyResponse.currently.visibility }} <span v-if="units === 'us'">miles</span><span v-else>km</span></strong></div>
                <div>Sunrise: <strong>{{ darkskyResponse.daily.data[0].sunriseTime * 1000 | moment("h:mm A") }}</strong></div>
                <div>Sunset: <strong>{{ darkskyResponse.daily.data[0].sunsetTime * 1000 | moment("h:mm A") }}</strong></div>
              </div>
            </div>
          </div>

          <div class="forecast">
            <ul class="days">
              <li class="day" v-for="day in darkskyResponse.daily.data">
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
        <button class="refresh" title="Refresh" v-on:click="fetchWeather()">
          <img src="/static/icons/ui/ic_refresh_black_24px.svg">
          <span class="last fadeIn" v-if="darkskyResponse.currently">Last updated: {{ darkskyResponse.currently.time * 1000 | moment("h:mm A") }}</span>
        </button>
        
      </div>
    </div>

    <div id="map"></div>
  </div>
</template>

<script>
import GoogleMapsLoader from 'google-maps'

export default {
  name: 'current',
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
        this.locationIcon = this.locationIconLock
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude
        this.searchQuery = this.latitude + ' ' + this.longitude
        this.fetchReverseGeolocation()
        this.background()
      }

      function error () {
        this.setAppState('error')
        this.setAppStateError = 'No geolocation? No problem. Search away.'
        this.locationIcon = this.locationIconDisabled
      }

      navigator.geolocation.getCurrentPosition(success.bind(this), error.bind(this))
    },
    emptyQuery: function () {
      this.inputQuery = ''
    },
    fetchGeolocation: function () {
      var searchQuery = this.inputQuery
      // Replacing forward and backslash to prevent broken endpoints
      searchQuery = searchQuery.replace(/\//g, ' ').replace(/\\/g, ' ')
      this.locationIcon = this.locationIconSearching

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
              this.geocodingResponse = data
              this.fetchWeather()
              this.background()
            }.bind(this))
          }.bind(this)
        )
        .catch(function () {
          this.setAppState('error')
        })
    },
    fetchReverseGeolocation: function () {
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
              this.geocodingResponse = data
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
              this.darkskyResponse = data
              this.setAppState('loaded')
            }.bind(this))
          }.bind(this)
        )
        .catch(function () {
          this.setAppState('error')
        })
    },
    setAppState: function (state) {
      this.appState = state
    },
    unitChange: function (unit) {
      this.units = unit
      this.fetchWeather()
    },
    validateBeforeSubmit: function () {
      this.$validator.validateAll().then(function () {
        this.setAppState('loading')
        this.fetchGeolocation()
      }.bind(this)).catch(function () {
        return
      })
    }
  },
  mounted: function () {
    this.setAppState('loading')
    this.browerGeolocation()
  },
  data () {
    return {
      appState: '',
      setAppStateError: '',
      darkskyEndpoint: 'https://api.kmr.io/weather/v1/',
      darkskyResponse: {},
      geocodingEndpoint: 'https://api.kmr.io/geocoding/v1/geocode/',
      geocodingResponse: {},
      reverseGeocodingEndpoint: 'https://api.kmr.io/geocoding/v1/reverse/',
      latitude: '',
      longitude: '',
      locationIcon: 'ic_location_searching_black_24px.svg',
      locationIconDisabled: 'ic_location_disabled_black_24px.svg',
      locationIconSearching: 'ic_location_searching_black_24px.svg',
      locationIconLock: 'ic_my_location_black_24px.svg',
      inputQuery: '',
      units: 'us'
    }
  }
}
</script>

<style lang="scss">
$accent: #2c2d3e;

// Hide Google Map extra UI elements
.gmnoprint a, .gmnoprint span, .gm-style-cc {
  display: none;
}

.gmnoprint div {
  background: none !important;
}

html, body, button {
  color: #96969f;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 300;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html, body {
  height: 100%;

  @media(max-width: 550px) {
    height: initial;
  }
}

html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body {
  background-color: $accent;

  @media(max-width: 550px) {
    background-color: #fbfbfb;
  }
}

img {
  max-width: 100%;
  height: auto;
}

::selection {
  background-color: #ddd;
}

#weather {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;

  @media(max-height: 730px) {
    justify-content: flex-start;
    padding: 15px;
  }

  @media(max-width: 850px) {
    justify-content: flex-start;
    padding: 15px;
  }

  @media(max-width: 550px) {
    justify-content: flex-start;
    padding: 0;
  }

  strong {
    font-weight: 500;
  }

  button {
    background-color: transparent;
    border: 0;
    cursor: pointer;
  }

  .button {
    align-items: center;
    background-color: #eaeaec;
    border: 0;
    border-radius: 2px;
    color: #96969f;
    display: flex;
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    font-weight: 500;
    justify-content: center;
    padding: 15px;
    transition: 0.3s;

    &:hover {
      background-color: #d5d5d8;
      color: #2c2d3e;
    }

    @media(max-width: 550px) {
      justify-content: flex-start;
    }
  }

  input {
    border: 1px solid #bbb;
    border-radius: 2px;
    color: $accent;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;

    &.error {
      border-color: #cc0000 !important;
    }

    &:focus,
    &:hover {
      outline: 0;
    }

    &:hover {
      border: 1px solid #96969f;
    }

    &:focus {
      border: 1px solid $accent;
    }
  }
  
  .inner {
    background-color: #fbfbfb;
    border-radius: 3px;
    box-shadow: 0px 0px 150px 0px rgba(0,0,0,0.5);
    color: #96969f;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    height: 510px;
    padding: 30px;
    position: relative;
    width: 100%;
    z-index: 1;

    @media(max-height: 730px) {
      display: block;
      height: initial;
    }

    @media(max-width: 850px) {
      display: block;
      height: initial;
    }

    @media(max-width: 550px) {
      border-radius: 0;
      box-shadow: none;
      padding: 15px;
    }
  }

  #map {
    filter: grayscale(100);
    height: 100%;
    left: 0;
    opacity: 0.5;
    position: fixed !important;
    top: 0;
    width: 100%;

    @media(max-width: 550px) {
      display: none;
    }
  }

  .search,
  .weather,
  .weather-inner,
  .current,
  .forecast {
    display: flex;
    flex-direction: column;
  }

  .search {
    flex-direction: row;
    position: relative;

    &.loading {
      .error-note {
        display: none;
      }

      input {
        border: 1px solid #bbb !important;
      }
    }

    input {
      flex: 1;
      font-size: 20px;
      min-width: 150px;
      padding: 5px 10px;
    }

    .error-note {
      bottom: -26px;
      color: #cc0000;
      font-size: 14px;
      left: 0;
      position: absolute;
    }

    .button {
      margin-left: 15px;
    }
  }

  .weather {
    flex: 1;
    margin-top: 30px;
    min-height: 200px;

    .weather-inner {
      flex: 1;
    }

    .current,
    .forecast {
      flex: 1;
    }

    .main {
      display: flex;
      padding-top: 5px;
    }

    .current {
      .row {
        display: flex;

        @media(max-width: 850px) {
          flex-direction: column;
        }

        .col {
          flex: 1;
        }
      }

      .icon {
        height: 50px;
        padding: 10px 10px 0 0;
        width: 50px;
      }

      .details {
        display: flex;
        flex-wrap: wrap;
        font-size: 15px;
        line-height: 1;
        padding-top: 8px;

        div {
          margin-top: 0;
          text-align: right;
          width: 50%;
        }
      }
    }

    .temperature {
      display: flex;
      margin-top: -10px;

      div {
        font-size: 60px;
        font-weight: 300;
      }

      sup {
        margin-top: 10px;

        .us {
          padding-right: 4px;
        }

        .si {
          border-left: 1px solid #ddd;
          padding-left: 4px;
        }

        &.us {
          .us {
            font-weight: bold;
            pointer-events: none;
          }

          .si {
            color: #b5b6bc;
          }
        }

        &.si {
          .si {
            font-weight: bold;
            pointer-events: none;
          }

          .us {
            color: #b5b6bc;
          }
        }

        span {
          cursor: pointer;
        }
      }
    }

    .forecast {
      justify-content: flex-end;
      margin-bottom: 30px;
      margin-top: 30px;

      ul {
        display: flex;

        li {
          flex: 1;
        }
      }

      .day {
        color: #b5b6bc;
        font-size: 16px;
        line-height: 1.6;
        text-align: center;
      }

      .icon {
        height: 30px;
        width: 30px;
      }
    }

    .location {
      font-size: 32px;

      .weak {
        color: #b5b6bc;
        font-size: 26px;
      }
    }
  }

  .refresh {
    align-items: center;
    display: flex;
    position: relative;

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
      color: #c0c0c5;
      font-size: 14px;
      margin-left: 5px;
    }
  }

  .fadeIn {
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-name: fadeIn;

    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }

  .spinner {
    left: 50%;
    top: 50%;
    margin: -45px -20px;
    font-size: 10px;
    text-indent: -9999em;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #d5d5d8;
    background: linear-gradient(to right, #d5d5d8 10%, rgba(255, 255, 255, 0) 42%);
    position: absolute;
    animation: spinner 1.4s infinite linear;
    transform: translateZ(0);
  }

  .spinner:before {
    width: 50%;
    height: 50%;
    background: #d5d5d8;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }

  .spinner:after {
    background: #fbfbfb;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
