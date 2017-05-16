<template>
  <div class="credits">
    <p>Weather Vue is made using the following technologies.</p>
    <ul>
      <li>
        <a href="https://vuejs.org/" target="_blank">Vue.js</a>
      </li>
      <li>
        <a href="https://darksky.net/dev/" target="_blank">Dark Sky API</a>
      </li>
      <li>
        <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank">Google Maps JavaScript API</a>
      </li>
      <li>
        <a href="https://developers.google.com/maps/documentation/geocoding/get-api-key" target="_blank">Google Geocoding API</a>
      </li>
      <li>
        <a href="https://community.algolia.com/places/" target="_blank">Algolia Places API</a>
      </li>
    </ul>

    <p class="source">Grab the <a href="https://github.com/krestaino/weather-vue/" target="_blank">source</a>.</p>
  </div>
</template>

<script>
export default {
  name: 'credits',

  computed: {
    store () {
      return this.$store.state
    }
  }
}
</script>

<style lang="scss" scoped>
.credits {
  align-items: center;
  display: flex;
  flex: 1;
  height: 100%;
  justify-content: center;
  text-align: center;
}

p {
  margin-top: 8px;
}

ul {
  margin-top: 16px;
}

li {
  + li {
    margin-top: 12px;
  }
}

.source {
  font-size: 14px;
  margin-top: 28px;
}
</style>
