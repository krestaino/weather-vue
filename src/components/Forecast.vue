<template>
  <ul class="forecast">
    <li class="day" v-for="day in store.darkRes.daily.data">
      <div>{{ day.time * 1000 | moment("ddd") }}</div>
      <div class="icon">
        <WeatherIcon :icon="day.icon"/>
      </div>
      <strong>{{ Math.round(day.temperatureMax) }}°</strong>
      <div>{{ Math.round(day.temperatureMin) }}°</div>
    </li>
  </ul>
</template>

<script>
import WeatherIcon from './WeatherIcon'

export default {
  name: 'forecast',

  components: {
    WeatherIcon
  },

  data () {
    return {
      store: this.$myStore.state.store
    }
  }
}
</script>

<style lang="scss">
.forecast {
  border-top: 1px solid #dedede;
  display: flex;
  margin-top: 16px;
  padding-top: 16px;

  li {
    flex: 1;
  }

  .day {
    color: #b5b6bc;
    font-size: 16px;
    line-height: 1.6;
    text-align: center;
  }

  .icon {
    height: 32px;
    margin: 0 auto;
    width: 32px;
  }
}
</style>
