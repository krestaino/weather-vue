<template>
  <div id="current">
    <div>{{ darkskyResponse.currently.temperature }}</div>
    <button v-on:click="fetchWeather">Fetch Weather</button>
  </div>
</template>

<script>
export default {
  name: 'current',
  methods: {
    fetchWeather: function() {
      fetch(this.darkskyEndpoint)
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
    }
  },
  data () {
    return {
      darkskyEndpoint: 'http://localhost:420/weather/v1/42.0457/-87.8501',
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