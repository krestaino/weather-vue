<template>
  <div class="current">
    <h1 class="location" v-if="store.geoRes[0]">
      <!-- US filter, try to show 'City, State';
        if no City, show 'State' -->
      <span v-if="store.geoRes[0].countryCode == 'US'">
        <span v-if="store.geoRes[0].city">{{ store.geoRes[0].city }}, {{ store.geoRes[0].administrativeLevels.level1short }}</span>
        <span v-else>{{ store.geoRes[0].administrativeLevels.level1long }}</span>
      </span>
      <!-- Non-US filter, try to show 'City, Country';
        if no City, show 'Admin Level 1, Country';
        if no Admin Level 1, show 'Country';
        if no Country, show 'formattedAddress' -->
      <span v-if="store.geoRes[0].countryCode != 'US'">
        <span v-if="store.geoRes[0].city">{{ store.geoRes[0].city }}, </span>
        <span v-else>
          <span v-if="store.geoRes[0].administrativeLevels.level1long">{{ store.geoRes[0].administrativeLevels.level1long }}, </span>
        </span>
        <span v-if="store.geoRes[0].country">{{ store.geoRes[0].country }}</span>
        <span v-else>{{ store.geoRes[0].formattedAddress }}</span>
      </span>
      <span class="weak">{{ store.geoRes[0].zipcode }}</span>
    </h1>

    <div class="row">
      <div class="col main">
        <div>{{ store.darkRes.currently.time * 1000 | moment("dddd, MMMM Do") }}</div>
        <div>{{ store.darkRes.currently.summary }}</div>
        <div class="icon-and-temperature">
          <div class="icon">
            <span v-if="store.darkRes.currently.icon === 'clear-day'">
              <WeatherIconClearDay></WeatherIconClearDay>
            </span>
            <span v-if="store.darkRes.currently.icon === 'clear-night'">
              <WeatherIconClearNight></WeatherIconClearNight>
            </span>
            <span v-if="store.darkRes.currently.icon === 'cloudy'">
              <WeatherIconCloudy></WeatherIconCloudy>
            </span>
            <span v-if="store.darkRes.currently.icon === 'partly-cloudy-day'">
              <WeatherIconPartlyCloudyDay></WeatherIconPartlyCloudyDay>
            </span>
            <span v-if="store.darkRes.currently.icon === 'partly-cloudy-night'">
              <WeatherIconPartlyCloudyNight></WeatherIconPartlyCloudyNight>
            </span>
            <span v-if="store.darkRes.currently.icon === 'rain'">
              <WeatherIconRain></WeatherIconRain>
            </span>
            <span v-if="store.darkRes.currently.icon === 'sleet'">
              <WeatherIconSleet></WeatherIconSleet>
            </span>
            <span v-if="store.darkRes.currently.icon === 'snow'">
              <WeatherIconSnow></WeatherIconSnow>
            </span>
            <span v-if="store.darkRes.currently.icon === 'wind'">
              <WeatherIconWind ></WeatherIconWind>
            </span>
          </div>
          <div class="temperature">
            <div>{{ Math.round(store.darkRes.currently.temperature) }}</div>
              <sup :class="store.units">
                <button class="us" title="Switch to Fahrenheit" @click="unitChangeExtended('us')">°F</button>
                <button class="si" title="Switch to Celsius" @click="this.$emit('unitChangeEmit', 'si')">°C</button>
            </sup>
          </div>
        </div> <!-- end .main -->
      </div> <!-- end .col -->

      <div class="col details">
        <div>Precipitation: 
          <strong>{{ store.darkRes.currently.precipProbability }}%</strong>
        </div>
        <div>Cloud Coverage: 
          <strong>{{ store.darkRes.currently.cloudCover }}%</strong>
        </div>
        <div>Humidity: 
          <strong>{{ store.darkRes.currently.humidity }}%</strong>
        </div>
        <div>Dew Point: 
          <strong>
            {{ Math.round(store.darkRes.currently.dewPoint) }}°<span v-if="store.units === 'us'">F</span><span v-else>C</span>
          </strong>
        </div>
        <div>Wind: 
          <strong>{{ store.darkRes.currently.windSpeed }} 
            <span v-if="store.units === 'us'">mph</span><span v-else>kph</span>
          </strong>
        </div>
        <div>Visibility: 
          <strong>{{ store.darkRes.currently.visibility }} 
            <span v-if="store.units === 'us'">miles</span>
            <span v-else>km</span>
          </strong>
        </div>
        <div>Sunrise: 
          <strong>{{ store.darkRes.daily.data[0].sunriseTime * 1000 | moment("h:mm A") }}</strong>
        </div>
        <div>Sunset: 
          <strong>{{ store.darkRes.daily.data[0].sunsetTime * 1000 | moment("h:mm A") }}</strong>
        </div>
      </div> <!-- end .col -->
    </div> <!-- end .row -->
  </div>
</template>

<script>
import WeatherIconClearDay from '../assets/icons/weather/clear_day.svg'
import WeatherIconClearNight from '../assets/icons/weather/clear_night.svg'
import WeatherIconCloudy from '../assets/icons/weather/cloudy.svg'
import WeatherIconPartlyCloudyDay from '../assets/icons/weather/partly_cloudy_day.svg'
import WeatherIconPartlyCloudyNight from '../assets/icons/weather/partly_cloudy_night.svg'
import WeatherIconRain from '../assets/icons/weather/rain.svg'
import WeatherIconSleet from '../assets/icons/weather/sleet.svg'
import WeatherIconSnow from '../assets/icons/weather/snow.svg'
import WeatherIconWind from '../assets/icons/weather/wind.svg'

export default {
  components: {
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

  data () {
    return {
      store: this.$myStore.state.store
    }
  },

  methods: {
    unitChange: function () {
      this.unitChangeExtended()
    }
  }
}
</script>

<style lang="scss">
.current {
  .row {
    display: flex;
    
    & + .row {
      padding-top: 15px;
    }

    @media(max-width: 850px) {
      flex-direction: column;
    }

    .col {
      flex: 1;
    }
  }

  .location {
    font-size: 32px;

    .weak {
      color: #b5b6bc;
      font-size: 26px;
    }
  }

  .icon-and-temperature {
    display: flex;
    padding-top: 5px;
  }

  .icon {
    height: 50px;
    padding: 10px 10px 0 0;
    width: 50px;
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
</style>
