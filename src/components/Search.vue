<template>
  <form class="search" @submit.prevent="validateBeforeSubmit" :class="{'loading': store.appState.state === 'loading' }">
    <div class="search-box">
      <input autofocus
        :class="{'error': errors.has('inputQuery') }"
        data-vv-validate-on="keyup"
        id="inputQuery"
        name="inputQuery"
        placeholder="Search"
        type="text"
        v-model="store.inputQuery"
        v-validate:inputQuery.initial="'required'">
      <div class="error-note" v-show="errors.has('inputQuery')">Search field can not be blank.</div>
    </div>

    <div class="search-button">
      <button class="button" title="Search" type="submit">
        <IconSearch class="icon"/>
      </button>
    </div>

    <div class="location-button">
      <button class="button" title="Find your location" @click.prevent="browerGeolocation">
        <span v-if="store.locationIcon === 'search'">
          <IconLocationSearch/>
        </span>
        <span v-else-if="store.locationIcon === 'lock'">
          <IconLocationLock/>
        </span>
        <span v-else-if="store.locationIcon === 'disabled'">
          <IconLocationDisabled/>
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
  name: 'search',

  components: {
    IconLocationDisabled,
    IconLocationSearch,
    IconLocationLock,
    IconSearch
  },

  computed: {
    store () {
      return this.$store.state
    }
  },

  methods: {
    browerGeolocation () {
      this.$emit('setAppState', 'loading', 'Determining your location')

      if (!navigator.geolocation) {
        this.$emit('setAppState', 'error', 'Unfortunately, your device does not support geolocation. No problem though. Search away.')
        return
      }

      let success = (position) => {
        this.store.locationIcon = 'lock'
        this.store.inputQuery = null
        this.store.latitude = position.coords.latitude
        this.store.longitude = position.coords.longitude
        this.fetchLocationName().then(() => {
          this.fetchWeather().then(() => {
            this.$emit('setAppState', 'loaded')
          })
        })
      }

      let error = () => {
        this.store.locationIcon = 'disabled'
        this.$emit('setAppState', 'error', 'No geolocation? No problem. Search away.')
      }

      navigator.geolocation.getCurrentPosition(success, error)
    },

    fetchCoordinates () {
      return new Promise((resolve, reject) => {
        fetch(process.env.API_URL.geocodingEndpoint + encodeURIComponent(this.store.inputQuery))
          .then(
            (response) => {
              if (response.status !== 200) {
                this.$emit('setAppState', 'error', 'Uh oh, the geolocation API is not responding. Please try again.')
                return
              }

              response.json().then((data) => {
                if (!data.length) {
                  this.$emit('setAppState', 'error', 'No results found. Please try another search.')
                  return
                }

                this.store.latitude = data[0].latitude
                this.store.longitude = data[0].longitude
                this.store.geoRes = data[0]
                resolve(response)
              })
            }
          )
          .catch(() => {
            this.$emit('setAppState', 'error', 'Uh oh, the geolocation API is not responding.')
          })
      })
    },

    fetchLocationName () {
      return new Promise((resolve, reject) => {
        fetch(process.env.API_URL.reverseGeocodingEndpoint + this.store.latitude + '/' + this.store.longitude)
          .then(
            (response) => {
              if (response.status !== 200) {
                this.$emit('setAppState', 'error', 'Uh oh, the reverse geolocation API did not like that request. Please try again.')
                return
              }

              response.json().then((data) => {
                this.store.latitude = data[0].latitude
                this.store.longitude = data[0].longitude
                this.store.geoRes = data[0]
                resolve(response)
              })
            }
          )
          .catch(() => {
            this.$emit('setAppState', 'error', 'Uh oh, the reverse geolocation API is not responding.')
          })
      })
    },

    fetchWeather () {
      return new Promise((resolve, reject) => {
        fetch(process.env.API_URL.darkskyEndpoint + this.store.latitude + '/' + this.store.longitude + '/' + this.store.units)
          .then(
            (response) => {
              if (response.status !== 200) {
                this.$emit('setAppState', 'error', 'Uh oh, the weather API did not like that request. Please try again.')
                return
              }

              response.json().then((data) => {
                this.store.darkRes = data
                resolve(response)
              })
            }
          )
          .catch(() => {
            this.$emit('setAppState', 'error', 'Uh oh, the weather API is not responding.')
          })
      })
    },

    validateBeforeSubmit () {
      this.$validator.validateAll().then(() => {
        this.store.locationIcon = 'search'
        this.$emit('setAppState', 'loading')
        this.fetchCoordinates().then(() => {
          this.fetchWeather().then(() => {
            this.$emit('setAppState', 'loaded')
          })
        })
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
  margin-bottom: 26px;
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
