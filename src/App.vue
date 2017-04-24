<template>
  <div id="weather">
    <div class="inner">
      <div class="current">
        <div class="row">
          <div class="col">
            <div v-bind:data-icon="darkskyResponse.currently.icon" class="icon"></div>
            <div>{{ Math.round(darkskyResponse.currently.temperature) }} °F</div>
            <div>{{ darkskyResponse.currently.time * 1000 | moment("dddd, MMMM Do") }}</div>
            <div>{{ darkskyResponse.currently.summary }}</div>
            <div>{{ latitude }}</div>
            <div>{{ longitude }}</div>
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

      <div class="controls">
        <button v-on:click="browerGeolocation">Find my Location</button>
        <button v-on:click="fetchWeather">Refresh</button>
        <div>Last updated: {{ darkskyResponse.currently.time * 1000 | moment("h:mm:ss A") }}</div>
      </div>
    </div>
  </div>
</template>

<style src="../node_modules/reset-css/reset.css"></style>
<style scoped lang="scss">
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

<script>
export default {
  name: 'current',
  methods: {
    init: function() {
      this.browerGeolocation();
    },
    fetchWeather: function() {
      fetch(this.darkskyEndpoint + this.latitude + '/' + this.longitude)
        .then(  
          function(response) {
            if (response.status !== 200) {  
              console.log('Looks like there was a problem. Status Code: ' +
                response.status);
              return;
            }

            response.json().then(function(data) {
              this.darkskyResponse = data;
            }.bind(this));
          }.bind(this)
        )  
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
    },
    browerGeolocation: function() {
      if (!navigator.geolocation){
       console.log("Geolocation is not supported by your browser.");
        return;
      }

      function success(position) {
        this.latitude  = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.fetchWeather();
      }

      function error() {
       console.log("Unable to retrieve your location");
      }

      navigator.geolocation.getCurrentPosition(success.bind(this), error);
    }
  },
  mounted: function(){
    this.init();
  },
  data () {
    return {
      latitude: '',
      longitude: '',
      darkskyEndpoint: 'https://api.kmr.io/weather/v1/',
      darkskyResponse: {
        currently: {
          time: '',
          summary: '',
          icon: '',
          nearestStormDistance: '',
          nearestStormBearing: '',
          precipIntensity: '',
          precipProbability: '',
          temperature: '',
          apparentTemperature: '',
          dewPoint: '',
          humidity: '',
          windSpeed: '',
          windBearing: '',
          visibility: '',
          cloudCover: '',
          pressure: '',
          ozone: ''
        },
        daily: {
          data: [
            {
              time: '',
              summary: '',
              icon: '',
              sunriseTime: '',
              sunsetTime: '',
              moonPhase: '',
              precipIntensity: '',
              precipIntensityMax: '',
              precipProbability: '',
              temperatureMin: '',
              temperatureMinTime: '',
              temperatureMax: '',
              temperatureMaxTime: '',
              apparentTemperatureMin: '',
              apparentTemperatureMinTime: '',
              apparentTemperatureMax: '',
              apparentTemperatureMaxTime: '',
              dewPoint: '',
              humidity: '',
              windSpeed: '',
              windBearing: '',
              visibility: '',
              cloudCover: '',
              pressure: '',
              ozone: ''
            },
            {
              time: '',
              summary: '',
              icon: '',
              sunriseTime: '',
              sunsetTime: '',
              moonPhase: '',
              precipIntensity: '',
              precipIntensityMax: '',
              precipProbability: '',
              temperatureMin: '',
              temperatureMinTime: '',
              temperatureMax: '',
              temperatureMaxTime: '',
              apparentTemperatureMin: '',
              apparentTemperatureMinTime: '',
              apparentTemperatureMax: '',
              apparentTemperatureMaxTime: '',
              dewPoint: '',
              humidity: '',
              windSpeed: '',
              windBearing: '',
              visibility: '',
              cloudCover: '',
              pressure: '',
              ozone: ''
            },
            {
              time: '',
              summary: '',
              icon: '',
              sunriseTime: '',
              sunsetTime: '',
              moonPhase: '',
              precipIntensity: '',
              precipIntensityMax: '',
              precipProbability: '',
              temperatureMin: '',
              temperatureMinTime: '',
              temperatureMax: '',
              temperatureMaxTime: '',
              apparentTemperatureMin: '',
              apparentTemperatureMinTime: '',
              apparentTemperatureMax: '',
              apparentTemperatureMaxTime: '',
              dewPoint: '',
              humidity: '',
              windSpeed: '',
              windBearing: '',
              visibility: '',
              cloudCover: '',
              pressure: '',
              ozone: ''
            },
            {
              time: '',
              summary: '',
              icon: '',
              sunriseTime: '',
              sunsetTime: '',
              moonPhase: '',
              precipIntensity: '',
              precipIntensityMax: '',
              precipProbability: '',
              temperatureMin: '',
              temperatureMinTime: '',
              temperatureMax: '',
              temperatureMaxTime: '',
              apparentTemperatureMin: '',
              apparentTemperatureMinTime: '',
              apparentTemperatureMax: '',
              apparentTemperatureMaxTime: '',
              dewPoint: '',
              humidity: '',
              windSpeed: '',
              windBearing: '',
              visibility: '',
              cloudCover: '',
              pressure: '',
              ozone: ''
            },
            {
              time: '',
              summary: '',
              icon: '',
              sunriseTime: '',
              sunsetTime: '',
              moonPhase: '',
              precipIntensity: '',
              precipIntensityMax: '',
              precipProbability: '',
              temperatureMin: '',
              temperatureMinTime: '',
              temperatureMax: '',
              temperatureMaxTime: '',
              apparentTemperatureMin: '',
              apparentTemperatureMinTime: '',
              apparentTemperatureMax: '',
              apparentTemperatureMaxTime: '',
              dewPoint: '',
              humidity: '',
              windSpeed: '',
              windBearing: '',
              visibility: '',
              cloudCover: '',
              pressure: '',
              ozone: ''
            },
            {
              time: '',
              summary: '',
              icon: '',
              sunriseTime: '',
              sunsetTime: '',
              moonPhase: '',
              precipIntensity: '',
              precipIntensityMax: '',
              precipProbability: '',
              temperatureMin: '',
              temperatureMinTime: '',
              temperatureMax: '',
              temperatureMaxTime: '',
              apparentTemperatureMin: '',
              apparentTemperatureMinTime: '',
              apparentTemperatureMax: '',
              apparentTemperatureMaxTime: '',
              dewPoint: '',
              humidity: '',
              windSpeed: '',
              windBearing: '',
              visibility: '',
              cloudCover: '',
              pressure: '',
              ozone: ''
            },
            {
              time: '',
              summary: '',
              icon: '',
              sunriseTime: '',
              sunsetTime: '',
              moonPhase: '',
              precipIntensity: '',
              precipIntensityMax: '',
              precipProbability: '',
              temperatureMin: '',
              temperatureMinTime: '',
              temperatureMax: '',
              temperatureMaxTime: '',
              apparentTemperatureMin: '',
              apparentTemperatureMinTime: '',
              apparentTemperatureMax: '',
              apparentTemperatureMaxTime: '',
              dewPoint: '',
              humidity: '',
              windSpeed: '',
              windBearing: '',
              visibility: '',
              cloudCover: '',
              pressure: '',
              ozone: ''
            },
            {
              time: '',
              summary: '',
              icon: '',
              sunriseTime: '',
              sunsetTime: '',
              moonPhase: '',
              precipIntensity: '',
              precipIntensityMax: '',
              precipProbability: '',
              temperatureMin: '',
              temperatureMinTime: '',
              temperatureMax: '',
              temperatureMaxTime: '',
              apparentTemperatureMin: '',
              apparentTemperatureMinTime: '',
              apparentTemperatureMax: '',
              apparentTemperatureMaxTime: '',
              dewPoint: '',
              humidity: '',
              windSpeed: '',
              windBearing: '',
              visibility: '',
              cloudCover: '',
              pressure: '',
              ozone: ''
            }
          ]
        }
      }
    }
  }
}
</script>