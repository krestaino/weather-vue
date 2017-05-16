<template>
  <div class="credits">
    <span>Weather Vue is made using the following technologies.</span>
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
        <a href="https://community.algolia.com/places/" target="_blank">Algolia Places</a>
      </li>
    </ul>
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

span {
  font-size: 16px;
}

ul {
  margin-top: 16px;
}

li {
  margin-top: 12px;
}
</style>
