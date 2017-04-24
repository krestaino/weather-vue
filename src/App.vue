<template>
  <div id="weather">
    <div class="inner fadeIn">
      <form class="search" @submit.prevent="validateBeforeSubmit">
        <input data-vv-validate-on="keyup" autofocus name="inputQuery" v-model="inputQuery" v-validate:inputQuery.initial="'required'" :class="{'error': errors.has('inputQuery') }" type="text" placeholder="Search">
        <span class="error-note" v-show="errors.has('inputQuery')">Search field can not be blank.</span>
        <button title="Search" type="submit">
          <img class="icon" v-bind:src="'/static/icons/ui/ic_search_black_24px.svg'">
        </button>

        <button title="Find your location" v-on:click="spinnerShow() + browerGeolocation() + emptyQuery()">
          <img class="icon" v-bind:src="'/static/icons/ui/'+locationIcon">
        </button>
      </form>

      <div class="weather">
        <div class="weather-inner fadeIn" v-if="darkskyResponse.currently">
          <div class="current">
            <div class="row">
              <div class="col">
                <div class="location" v-if="geocodingResponse[0]">
                  <span v-if="geocodingResponse[0].countryCode == 'US'">
                    <span v-if="geocodingResponse[0].city">{{ geocodingResponse[0].city }}, {{ geocodingResponse[0].administrativeLevels.level1short }}</span>
                    <span v-if="!geocodingResponse[0].city">{{ geocodingResponse[0].administrativeLevels.level1long }}</span>
                  </span>
                  <span v-if="geocodingResponse[0].countryCode != 'US'">{{ geocodingResponse[0].city }}, {{ geocodingResponse[0].country }}</span>
                  <span class="weak">{{ geocodingResponse[0].zipcode }}</span>
                </div>
                <div>{{ darkskyResponse.currently.time * 1000 | moment("dddd, MMMM Do") }}</div>
                <div>{{ darkskyResponse.currently.summary }}</div>
                <div class="main">
                  <img class="icon" v-bind:src="'/static/icons/weather/'+darkskyResponse.currently.icon+'.svg'">
                  <div class="temperature"><span>{{ Math.round(darkskyResponse.currently.temperature) }}</span><sup>°F</sup></div>
                </div>
              </div>

              <div class="col details">
                <div>Precipitation: {{ darkskyResponse.currently.precipProbability }}%</div>
                <div>Cloud Coverage: {{ darkskyResponse.currently.cloudCover }}%</div>
                <div>Humidity: {{ darkskyResponse.currently.humidity }}%</div>
                <div>Dew Point: {{ Math.round(darkskyResponse.currently.dewPoint) }} °F</div>
                <div>Wind: {{ darkskyResponse.currently.windSpeed }} mph</div>
                <div>Visibility: {{ darkskyResponse.currently.visibility }} miles</div>
                <div>Sunrise: {{ darkskyResponse.daily.data[0].sunriseTime * 1000 | moment("h:mm A") }}</div>
                <div>Sunset: {{ darkskyResponse.daily.data[0].sunsetTime * 1000 | moment("h:mm A") }}</div>
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
        <div class="spinner"></div>
      </div>

      <div class="refresh">
        <button title="Refresh" v-on:click="spinnerShow() + fetchWeather()">Refresh</button>
        <div class="last fadeIn" v-if="darkskyResponse.currently">Last updated: {{ darkskyResponse.currently.time * 1000 | moment("h:mm A") }}</div>
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
    },
    browerGeolocation: function () {
      if (!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser.')
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
        this.locationIcon = this.locationIconDisabled
      }

      navigator.geolocation.getCurrentPosition(success.bind(this), error.bind(this))
    },
    emptyQuery: function () {
      this.inputQuery = ''
    },
    fetchGeolocation: function () {
      var searchQuery = this.inputQuery
      this.locationIcon = this.locationIconSearching

      fetch(this.geocodingEndpoint + searchQuery)
        .then(
          function (response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status)
              return
            }

            response.json().then(function (data) {
              this.latitude = data[0].latitude
              this.longitude = data[0].longitude
              this.geocodingResponse = data
              this.fetchWeather()
              this.background()
            }.bind(this))
          }.bind(this)
        )
        .catch(function (err) {
          console.log('Fetch Error :-S', err)
        })
    },
    fetchReverseGeolocation: function () {
      fetch(this.reverseGeocodingEndpoint + this.latitude + '/' + this.longitude)
        .then(
          function (response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status)
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
        .catch(function (err) {
          console.log('Fetch Error :-S', err)
        })
    },
    fetchWeather: function () {
      fetch(this.darkskyEndpoint + this.latitude + '/' + this.longitude)
        .then(
          function (response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status)
              return
            }

            response.json().then(function (data) {
              this.darkskyResponse = data
              this.spinnerHide()
            }.bind(this))
          }.bind(this)
        )
        .catch(function (err) {
          console.log('Fetch Error :-S', err)
        })
    },
    spinnerHide: function () {
      document.querySelector('#weather').classList.remove('loading')
    },
    spinnerShow: function () {
      document.querySelector('#weather').classList.add('loading')
    },
    validateBeforeSubmit: function () {
      this.$validator.validateAll().then(function () {
        this.spinnerShow()
        this.fetchGeolocation()
      }.bind(this)).catch(function () {
        return
      })
    }
  },
  mounted: function () {
    this.spinnerShow()
    this.browerGeolocation()
  },
  data () {
    return {
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
      inputQuery: ''
    }
  }
}
</script>

<style lang="scss">
// Hide Google Map extra UI elements
.gmnoprint a, .gmnoprint span, .gm-style-cc {
  display:none;
}

.gmnoprint div {
  background:none !important;
}

$accent: #2c2d3e;


html, body {
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 300;
  height: 100%;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

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

  @media(max-width: 850px) {
    padding: 15px;
  }

  @media(max-width: 550px) {
    justify-content: flex-start;
    padding: 0;
  }

  &.loading {
    .weather .spinner {
      display: block;
    }

    .weather {
      .spinner {
        display: block;
      }

      .weather-inner {
        display: none;
      }
    }

    .search {
      .error-note {
        display: none;
      }

      input {
        border: 1px solid #bbb !important;
      }
    }
  }

  strong {
    font-weight: 500;
  }

  button {
    align-items: center;
    background-color: #eaeaec;
    border: 0;
    border-radius: 2px;
    color: #96969f;
    cursor: pointer;
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
    padding: 30px;
    position: relative;
    width: 100%;
    z-index: 1;

    @media(max-width: 550px) {
      border-radius: 0;
      box-shadow: none;
      padding: 15px;
    }
  }

  #map {
    filter: grayscale(100);
    height: 100%;
    opacity: 0.5;
    position: fixed !important;
    width: 100%;

    @media(max-width: 550px) {
      display: none;
    }
  }

  .search,
  .weather,
  .weather-inner,
  .current,
  .forecast,
  .refresh {
    display: flex;
    flex-direction: column;
  }

  .search {
    flex-direction: row;
    position: relative;

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

    button {
      margin-left: 15px;
    }
  }

  .weather {
    flex: 1;
    margin-top: 30px;
    min-height: 200px;

    .spinner {
      display: none;
    }

    .weather-inner {
      flex: 1;
    }

    .current,
    .forecast {
      flex: 1;
    }

    .main {
      display: flex;
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

        div {
          margin-top: 10px;
          width: 50%;
        }
      }
    }

    .temperature {
      display: flex;
      margin-top: -10px;

      span {
        font-size: 60px;
        font-weight: 300;
      }

      sup {
        margin-top: 10px;
      }
    }

    .details {
      font-size: 18px;
      line-height: 1;
      padding-top: 7px;
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
    position: relative;

    button {
      margin-bottom: 29px;
    }

    .last {
      bottom: 0;
      color: #c0c0c5;
      font-size: 14px;
      margin-top: 10px;
      position: absolute;
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
