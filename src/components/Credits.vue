<template>
    <div class="credits">
        <p>Weather Vue is made using the following technologies.</p>
        <ul>
            <li>
                <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue.js</a>
            </li>
            <li>
                <a href="https://darksky.net/dev/" target="_blank" rel="noopener">Dark Sky API</a>
            </li>
            <li>
                <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank"
                   rel="noopener">Google Maps JavaScript API</a>
            </li>
            <li>
                <a href="https://developers.google.com/maps/documentation/geocoding/get-api-key" target="_blank"
                   rel="noopener">Google Geocoding API</a>
            </li>
            <li>
                <a href="https://developers.google.com/places/web-service/autocomplete" target="_blank" rel="noopener">Google Places API</a>
            </li>
        </ul>

        <p class="source">
            Grab the <a href="https://github.com/krestaino/weather-vue/" target="_blank" rel="noopener">source</a>.
        </p>
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
        animation-duration: 0.3s;
        animation-fill-mode: forwards;
        animation-iteration-count: 1;
        animation-name: fadeIn;
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
