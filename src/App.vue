<template>
  <div id="weather">
    <div class="inner fadeIn">
      <div class="search">
        <input autofocus type="text" v-model="inputQuery" v-on:keyup.enter="spinnerShow() + fetchGeolocation()">
        <button v-on:click="spinnerShow() + fetchGeolocation()">Search</button>
        <button v-on:click="spinnerShow() + browerGeolocation()">Find My Location</button>
      </div>

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
                <div v-bind:data-icon="darkskyResponse.currently.icon" class="icon"></div>
                <div>{{ Math.round(darkskyResponse.currently.temperature) }}°F</div>
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
                <div v-bind:data-icon="day.icon" class="icon"></div>
                <div><strong>{{ Math.round(day.temperatureMax) }}°</strong></div>
                <div>{{ Math.round(day.temperatureMin) }}°</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="spinner"></div>
      </div>

      <div class="refresh">
        <button v-on:click="spinnerShow() + fetchWeather()">Refresh</button>
        <div class="last fadeIn" v-if="darkskyResponse.currently">Last updated: {{ darkskyResponse.currently.time * 1000 | moment("h:mm:ss A") }}</div>
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
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude
        this.searchQuery = this.latitude + ' ' + this.longitude
        this.fetchReverseGeolocation()
        this.background()
      }

      function error () {
        console.log('Unable to retrieve your location.')
      }

      navigator.geolocation.getCurrentPosition(success.bind(this), error.bind(this))
    },
    fetchGeolocation: function () {
      var searchQuery = this.inputQuery

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
      document.querySelector('.weather').classList.remove('loading')
    },
    spinnerShow: function () {
      document.querySelector('.weather').classList.add('loading')
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
      inputQuery: ''
    }
  }
}
</script>

<style lang="scss">
html, body {
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 300;
  height: 100%;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

  strong {
    font-weight: 500;
  }

  button {
    background-color: #ddd;
    border: 0;
    color: #999;
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    font-weight: 500;
    padding: 15px;
    transition: 0.3s;

    &:hover {
      background-color: #ccc;
      color: #888;
    }
  }

  input {
    border: 1px solid #bbb;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;

    &:focus,
    &:hover {
      border: 1px solid #000;
      outline: 0;
    }
  }
  
  .inner {
    background-color: #fbfbfb;
    box-shadow: 0px 0px 150px 0px rgba(0,0,0,0.5);
    color: #777;
    display: flex;
    flex-direction: column;
    height: 440px;
    max-width: 800px;
    padding: 30px;
    position: relative;
    width: 100%;
    z-index: 1;
  }

  #map {
    filter: grayscale(100);
    height: 100%;
    opacity: 0.5;
    position: fixed !important;
    width: 100%;
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

    input {
      flex: 1;
      font-size: 20px;
      padding: 5px;
    }

    button {
      margin-left: 15px;
    }
  }

  .weather {
    flex: 1;
    margin-top: 30px;

    .spinner {
      display: none;
    }

    &.loading {
      .spinner {
        display: block;
      }

      .weather-inner {
        display: none;
      }
    }

    .weather-inner {
      flex: 1;
    }

    .current,
    .forecast {
      flex: 1;
    }

    .details {
      font-size: 18px;
      line-height: 1;
      padding-top: 7px;
    }

    .forecast {
      justify-content: flex-end;
      margin-bottom: 30px;

      .day {
        color: #aaa;
        font-size: 16px;
        line-height: 1.6;
        text-align: center;
      }
    }

    .location {
      font-size: 32px;

      .weak {
        color: #999;
        font-size: 26px;
      }
    }
  }

  .current {
    .row {
      display: flex;

      .col {
        flex: 1;
      }
    }

    .details {
      display: flex;
      flex-wrap: wrap;

      div {
        width: 50%;
      }
    }
  }

  .forecast {
    ul {
      display: flex;

      li {
        flex: 1;
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
      color: #999;
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
    margin: -20px;
    font-size: 10px;
    text-indent: -9999em;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #ddd;
    background: linear-gradient(to right, #ddd 10%, rgba(255, 255, 255, 0) 42%);
    position: absolute;
    animation: spinner 1.4s infinite linear;
    transform: translateZ(0);
  }

  .spinner:before {
    width: 50%;
    height: 50%;
    background: #ddd;
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
