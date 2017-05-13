<template>
  <form class="search" @submit.prevent="validateBeforeSubmit" :class="{'loading': store.appState.state === 'loading' }">
    
    <div class="search-box">
      <input autofocus :class="{'error': errors.has('inputQuery') }" data-vv-validate-on="keyup" id="inputQuery" name="inputQuery" v-model="store.inputQuery" v-validate:inputQuery.initial="'required'" type="text" placeholder="Search">
    </div>

    <div class="error">
      <span class="error-note" v-show="errors.has('inputQuery')">Search field can not be blank.</span>
    </div>

    <div class="search-button">
      <button class="button" title="Search" type="submit">
        <IconSearch class="icon"></IconSearch>
      </button>
    </div>

    <div class="location-button">
      <button class="button" title="Find your location" @click.prevent="browerGeolocation">
        <span v-if="store.locationIcon === 'search'">
          <IconLocationSearch></IconLocationSearch>
        </span>
        <span v-else-if="store.locationIcon === 'lock'">
          <IconLocationLock></IconLocationLock>
        </span>
        <span v-else-if="store.locationIcon === 'disabled'">
          <IconLocationDisabled></IconLocationDisabled>
        </span>
      </button>
    </div>

  </form>
</template>

<script>
import IconLocationDisabled from '../assets/icons/ui/location_disabled.svg'
import IconLocationSearch from '../assets/icons/ui/location_searching.svg'
import IconLocationLock from '../assets/icons/ui/my_location.svg'
import IconSearch from '../assets/icons/ui/search.svg'

export default {
  components: {
    IconLocationDisabled,
    IconLocationSearch,
    IconLocationLock,
    IconSearch
  },

  data () {
    return {
      store: this.$myStore.state.store
    }
  },

  methods: {
    browerGeolocation () {
      this.setAppStateEmit('loading', 'Determining your location')

      if (!navigator.geolocation) {
        this.setAppStateEmit('error', 'Unfortunately, your device does not support geolocation. No problem though, the search still works.')
        return
      }

      let success = (position) => {
        this.errors.clear()
        this.setLocationIcon('lock')
        this.store.latitude = position.coords.latitude
        this.store.longitude = position.coords.longitude
        this.fetchLocationName()
      }

      let error = () => {
        this.setAppStateEmit('error', 'No geolocation? No problem. Search away.')
        this.setLocationIcon('disabled')
      }

      navigator.geolocation.getCurrentPosition(success, error)
    },

    fetchCoordinates () {
      // let searchQuery = this.store.inputQuery
      // console.log(searchQuery)
      // Replacing forward and backslash to prevent broken endpoints
      // searchQuery = searchQuery.replace(/\//g, ' ').replace(/\\/g, ' ')

      fetch(process.env.API_URL.geocodingEndpoint + this.store.inputQuery)
        .then(
          (response) => {
            if (response.status !== 200) {
              this.setAppStateEmit('error', 'Uh oh, the geolocation API is not responding. Please try again.')
              return
            }

            response.json().then((data) => {
              if (!data.length) {
                this.setAppStateEmit('error', 'No results found. Please try another search.')
                return
              }

              this.store.latitude = data[0].latitude
              this.store.longitude = data[0].longitude
              this.store.geoRes = data
              this.fetchWeather()
            })
          }
        )
        .catch(() => {
          this.setAppStateEmit('error', 'Uh oh, the geolocation API is not responding.')
        })
    },

    fetchLocationName () {
      fetch(process.env.API_URL.reverseGeocodingEndpoint + this.store.latitude + '/' + this.store.longitude)
        .then(
          (response) => {
            if (response.status !== 200) {
              this.setAppStateEmit('error', 'Uh oh, the reverse geolocation API did not like that request. Please try again.')
              return
            }

            response.json().then((data) => {
              this.store.latitude = data[0].latitude
              this.store.longitude = data[0].longitude
              this.store.geoRes = data
              this.fetchWeather()
            })
          }
        )
        .catch(() => {
          this.setAppStateEmit('error', 'Uh oh, the reverse geolocation API is not responding.')
        })
    },

    fetchWeather () {
      this.setAppStateEmit('loading')

      fetch(process.env.API_URL.darkskyEndpoint + this.store.latitude + '/' + this.store.longitude + '/' + this.store.units)
        .then(
          (response) => {
            if (response.status !== 200) {
              this.setAppStateEmit('error', 'Uh oh, the weather API did not like that request. Please try again.')
              return
            }

            response.json().then((data) => {
              this.store.darkRes = data
              this.setAppStateEmit('loaded')
            })
          }
        )
        .catch(() => {
          this.setAppStateEmit('error', 'Uh oh, the weather API is not responding.')
        })
    },

    focusInputQuery () {
      document.querySelector('#inputQuery').focus()
    },

    setLocationIcon: function (icon) {
      this.store.locationIcon = icon
    },

    setAppStateEmit (state, message) {
      this.$emit('setAppStateEmit', state, message)
    },

    unitChange: function (unit) {
      this.store.units = unit
      this.fetchWeather()
    },

    validateBeforeSubmit () {
      this.$validator.validateAll().then(() => {
        this.$emit('setAppStateEmit', 'loading')
        this.setLocationIcon('search')
        this.fetchCoordinates()
        this.focusInputQuery()
      }).catch(() => {
        return
      })
    }
  },

  mounted () {
    this.browerGeolocation()
  }
}
</script>

<style lang="scss">
.search {
  display: flex;
  flex-direction: row;
  position: relative;

  &.loading {
    .error-note {
      display: none;
    }

    input {
      border: 1px solid #bbb !important;
    }
  }

  .search-box {
    flex: 1;

    input {
      flex: 1;
      font-size: 20px;
      height: 100%;
      min-width: 150px;
      padding: 5px 10px;
      width: 100%;
    }
  }

  .error-note {
    bottom: -26px;
    color: #cc0000;
    font-size: 14px;
    left: 0;
    position: absolute;
  }

  .button {
    margin-left: 15px;

    span {
      display: flex;
    }
  }
}
</style>
