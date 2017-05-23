<template>
  <form class="search" @submit.prevent>
    <VueGoogleAutocomplete
      autofocus
      class="search-box"
      id="inputQuery"
      placeholder="Search"
      types="(cities)"
      @placechanged="getInputQuery"/>

    <button class="search-button button" title="Search" type="submit">
      <IconSearch class="icon"/>
    </button>

    <button class="location-button button" title="Find your location" @click.prevent="findLocation">
      <IconLocationSearch v-if="store.locationIcon === 'search'"/>
      <IconLocationLock v-else-if="store.locationIcon === 'lock'"/>
      <IconLocationDisabled v-else-if="store.locationIcon === 'disabled'"/>
    </button>
  </form>
</template>

<script>
import IconLocationDisabled from '../assets/icons/ui/location_disabled.svg'
import IconLocationSearch from '../assets/icons/ui/location_searching.svg'
import IconLocationLock from '../assets/icons/ui/my_location.svg'
import IconSearch from '../assets/icons/ui/search.svg'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

export default {
  name: 'search',

  components: {
    IconLocationDisabled,
    IconLocationSearch,
    IconLocationLock,
    IconSearch,
    VueGoogleAutocomplete
  },

  computed: {
    store () {
      return this.$store.state
    }
  },

  methods: {
    browerGeolocation () {
      return new Promise((resolve, reject) => {
        this.$emit('setAppState', 'loading', 'Determining your location')

        if (!navigator.geolocation) {
          this.$emit('setAppState', 'error', 'Unfortunately, your device does not support geolocation. No problem though. Search away.')
          return
        }

        let success = (position) => {
          this.store.locationIcon = 'lock'
          this.store.latitude = position.coords.latitude
          this.store.longitude = position.coords.longitude
          resolve()
        }

        let error = () => {
          this.store.locationIcon = 'disabled'
          this.$emit('setAppState', 'error', 'No geolocation? No problem. Search away.')
        }

        navigator.geolocation.getCurrentPosition(success, error)
      })
    },

    findLocation () {
      document.querySelector('#inputQuery').value = ''
      this.browerGeolocation().then(() => {
        this.$store.dispatch('geocode', 'default').then(() => {
          this.$store.dispatch('weather').then(() => {
            this.$emit('setAppState', 'loaded')
          })
        })
      })
    },

    getInputQuery (addressData, placeResultData) {
      this.store.inputQuery = placeResultData.formatted_address
      this.store.locationIcon = 'search'
      this.$emit('setAppState', 'loading')
      this.$store.dispatch('geocode', 'reverse').then(() => {
        this.$store.dispatch('weather').then(() => {
          this.$emit('setAppState', 'loaded')
        })
      })
    },

    inputQueryFocus (boolean) {
      this.searchFocus = boolean
    }
  },

  mounted () {
    this.browerGeolocation().then(() => {
      this.$store.dispatch('geocode', 'default').then(() => {
        this.$store.dispatch('weather').then(() => {
          this.$emit('setAppState', 'loaded')
        })
      })
    })
  }
}
</script>

<style lang="scss">
@import '../scss/_vars.scss';

.search {
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  position: relative;

  @media(max-width: 850px) {
    margin-bottom: 16px;

    &.focus {
      .button {
        border-color: $accent;
      }

      .location-button {
        .button {
          border-bottom-right-radius: 0;
        }
      }
    }
  }

  .search-box {
    flex: 1;
    font-size: 20px;
    min-width: 150px;
    padding: 5px 10px;
    width: calc(100% - 2px);

    &::-ms-clear {
      display: none;
    }

    @media(max-width: 850px) {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    } 
  }

  .button {
    margin-left: 15px;

    @media(max-width: 850px) {
      border: 1px solid #bbb;
      border-left: 0;
      border-radius: 0;
      margin-left: 0;
    }

    span {
      display: flex;
    }
  }

  .location-button {
    .button {
      border-bottom-right-radius: 2px;
      border-top-right-radius: 2px;
    }
  }
}

.pac-container {
  background-color: #fbfbfb;
  border-radius: 2px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-left: 1px solid #2c2d3e;
  border-right: 1px solid #2c2d3e;
  border-bottom: 1px solid #2c2d3e;
  border-top: 0;
  box-shadow: none;
  font-size: 15px;

  @media(max-width: 550px) {
    width: calc(100% - 32px) !important;
  }

  &::after {
    display: none;
  }

  .pac-item {
    cursor: pointer;
    padding: 8px 16px;

    &:hover,
    &.pac-item-selected {
      background-color: #eaeaec;
    }

    @media(max-width: 850px) {
      padding: 16px;
    }

    + .pac-item {
      border-top: 1px solid #ccc;
    }
  }
} 
</style>
