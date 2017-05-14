<template>
  <div>
    <WeatherIconClearDay v-if="icon === 'clear-day'"/>
    <WeatherIconClearNight v-if="icon === 'clear-night'"/>
    <WeatherIconCloudy v-if="icon === 'cloudy'"/>
    <WeatherIconPartlyCloudyDay v-if="icon === 'partly-cloudy-day'"/>
    <WeatherIconPartlyCloudyNight v-if="icon === 'partly-cloudy-night'"/>
    <WeatherIconRain v-if="icon === 'rain'"/>
    <WeatherIconSleet v-if="icon === 'sleet'"/>
    <WeatherIconSnow v-if="icon === 'snow'"/>
    <WeatherIconWind v-if="icon === 'wind'"/>
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
  name: 'weatherIcon',

  props: ['icon'],

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
  }
}
</script>
