<template>
  <div id="map" v-if="store.latitude && store.longitude"></div>
</template>

<script>
export default {
  name: 'background',

  computed: {
    store () {
      return this.$store.state
    }
  },

  methods: {
    background () {
      /* eslint-disable no-new, no-undef */
      new google.maps.Map(document.getElementById('map'), {
        center: {lat: this.store.latitude - 1.5, lng: this.store.longitude},
        disableDefaultUI: true,
        draggable: false,
        scrollwheel: false,
        mapTypeControl: false,
        mapTypeId: 'satellite',
        navigationControl: false,
        scaleControl: false,
        zoom: 8
      })
    }
  },

  updated () {
    if (window.innerWidth > 550) {
      this.background()
    }
  }
}
</script>

<style lang="scss" scoped>
#map {
  filter: grayscale(100);
  height: 100%;
  left: 0;
  opacity: 0.5;
  pointer-events: none;
  position: fixed !important;
  top: 0;
  width: 100%;

  @media(max-width: 550px) {
    display: none;
  }
}
</style>
