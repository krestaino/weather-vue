<template>
  <div id="map" v-if="latitude && longitude"></div>
</template>

<script>
import GoogleMapsLoader from 'google-maps'

export default {
  props: {
    latitude: {
      required: true
    },
    longitude: {
      required: true
    }
  },

  methods: {
    background: function () {
      if (process.env.API_KEY) {
        GoogleMapsLoader.KEY = process.env.API_KEY

        GoogleMapsLoader.load((google) => {
          /* eslint-disable no-new */
          new google.maps.Map(document.getElementById('map'), {
            center: {lat: this.latitude, lng: this.longitude},
            disableDefaultUI: true,
            draggable: false,
            scrollwheel: false,
            mapTypeControl: false,
            mapTypeId: 'satellite',
            navigationControl: false,
            scaleControl: false,
            zoom: 8
          })
        })
      }
    }
  },
  updated () {
    this.background()
  }
}
</script>

<style lang="scss">
#map {
  filter: grayscale(100);
  height: 100%;
  left: 0;
  opacity: 0.5;
  position: fixed !important;
  top: 0;
  width: 100%;
}
</style>
