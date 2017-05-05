<template>
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

  props: {
    darkRes: {
      type: Object,
      required: true
    }
  }
}
</script>
