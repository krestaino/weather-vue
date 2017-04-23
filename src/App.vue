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
          <li class="day">
            <div>{{ darkskyResponse.daily.data[0].time * 1000 | moment("ddd") }}</div>
            <div v-bind:data-icon="darkskyResponse.daily.data[0].icon" class="icon"></div>
            <div>{{ Math.round(darkskyResponse.daily.data[0].temperatureMax) }} °F</div>
            <div>{{ Math.round(darkskyResponse.daily.data[0].temperatureMin) }} °F</div>
          </li>

          <li class="day">
            <div>{{ darkskyResponse.daily.data[1].time * 1000 | moment("ddd") }}</div>
            <div v-bind:data-icon="darkskyResponse.daily.data[1].icon" class="icon"></div>
            <div>{{ Math.round(darkskyResponse.daily.data[1].temperatureMax) }} °F</div>
            <div>{{ Math.round(darkskyResponse.daily.data[1].temperatureMin) }} °F</div>
          </li>

          <li class="day">
            <div>{{ darkskyResponse.daily.data[2].time * 1000 | moment("ddd") }}</div>
            <div v-bind:data-icon="darkskyResponse.daily.data[2].icon" class="icon"></div>
            <div>{{ Math.round(darkskyResponse.daily.data[2].temperatureMax) }} °F</div>
            <div>{{ Math.round(darkskyResponse.daily.data[2].temperatureMin) }} °F</div>
          </li>

          <li class="day">
            <div>{{ darkskyResponse.daily.data[3].time * 1000 | moment("ddd") }}</div>
            <div v-bind:data-icon="darkskyResponse.daily.data[3].icon" class="icon"></div>
            <div>{{ Math.round(darkskyResponse.daily.data[3].temperatureMax) }} °F</div>
            <div>{{ Math.round(darkskyResponse.daily.data[3].temperatureMin) }} °F</div>
          </li>

          <li class="day">
            <div>{{ darkskyResponse.daily.data[4].time * 1000 | moment("ddd") }}</div>
            <div v-bind:data-icon="darkskyResponse.daily.data[4].icon" class="icon"></div>
            <div>{{ Math.round(darkskyResponse.daily.data[4].temperatureMax) }} °F</div>
            <div>{{ Math.round(darkskyResponse.daily.data[4].temperatureMin) }} °F</div>
          </li>

          <li class="day">
            <div>{{ darkskyResponse.daily.data[5].time * 1000 | moment("ddd") }}</div>
            <div v-bind:data-icon="darkskyResponse.daily.data[5].icon" class="icon"></div>
            <div>{{ Math.round(darkskyResponse.daily.data[5].temperatureMax) }} °F</div>
            <div>{{ Math.round(darkskyResponse.daily.data[5].temperatureMin) }} °F</div>
          </li>

          <li class="day">
            <div>{{ darkskyResponse.daily.data[6].time * 1000 | moment("ddd") }}</div>
            <div v-bind:data-icon="darkskyResponse.daily.data[6].icon" class="icon"></div>
            <div>{{ Math.round(darkskyResponse.daily.data[6].temperatureMax) }} °F</div>
            <div>{{ Math.round(darkskyResponse.daily.data[6].temperatureMin) }} °F</div>
          </li>

          <li class="day">
            <div>{{ darkskyResponse.daily.data[7].time * 1000 | moment("ddd") }}</div>
            <div v-bind:data-icon="darkskyResponse.daily.data[7].icon" class="icon"></div>
            <div>{{ Math.round(darkskyResponse.daily.data[7].temperatureMax) }} °F</div>
            <div>{{ Math.round(darkskyResponse.daily.data[7].temperatureMin) }} °F</div>
          </li>
        </ul>
      </div>

      <div class="controls">
        <button v-on:click="fetchWeather">Refresh</button>
        <div>Last updated: {{ darkskyResponse.currently.time * 1000 | moment("h:mm:ss A") }}</div>
      </div>
    </div>
  </div>
</template>

<style>
/* http://meyerweb.com/eric/tools/css/reset/ 
 v2.0 | 20110126
 License: none (public domain)
*/
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
  display: block;
}
html, body {
  height: 100%;
}
body {
  line-height: 1;
}
ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}

html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
</style>

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