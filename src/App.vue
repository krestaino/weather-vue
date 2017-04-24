<template>
  <div id="weather">
    <div class="inner">
      <div class="controls">
        <input autofocus type="text" v-model="inputQuery" v-on:keyup.enter="fetchGeolocation">
        <button v-on:click="browerGeolocation">Find My Location</button>
        <button v-on:click="fetchWeather">Refresh</button>
        <div v-if="darkskyResponse.currently">Last updated: {{ darkskyResponse.currently.time * 1000 | moment("h:mm:ss A") }}</div>
      </div>

      <div v-if="darkskyResponse.currently">
        <div class="current">
          <div class="row">
            <div class="col">
              <div v-bind:data-icon="darkskyResponse.currently.icon" class="icon"></div>
              <div v-if="geocodingResponse[0]">{{ geocodingResponse[0].city }}, {{ geocodingResponse[0].administrativeLevels.level1short }}</div>
              <div>{{ Math.round(darkskyResponse.currently.temperature) }} °F</div>
              <div>{{ darkskyResponse.currently.time * 1000 | moment("dddd, MMMM Do") }}</div>
              <div>{{ darkskyResponse.currently.summary }}</div>
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
              <div>{{ Math.round(day.temperatureMax) }} °F</div>
              <div>{{ Math.round(day.temperatureMin) }} °F</div>
            </li>
          </ul>
        </div>
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
            }.bind(this))
          }.bind(this)
        )
        .catch(function (err) {
          console.log('Fetch Error :-S', err)
        })
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
    }
  },
  mounted: function () {
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
  height: 100%;
}

#weather {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  
  .inner {
    background-color: #fbfbfb;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    padding: 15px;
    position: relative;
    width: 100%;
    z-index: 1;
  }

  #map {
    height: 100%;
    position: fixed !important;
    width: 100%;
  }

  button {
    border: 1px solid red;
  }

  div {
    min-height: 20px;
  }

  .current,
  .forecast,
  .controls {
    display: flex;
    flex-direction: column;
    
    + div {
      margin-top: 30px;
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
}
</style>
