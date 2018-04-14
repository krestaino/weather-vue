<template>
  <form class="search fadeIn" :class="{ 'focus': inputQueryFocus }" @submit.prevent v-if="store.googleMapsLoaded">
    <div class="search-box">
      <div class="input-box">
        <VueGoogleAutocomplete
          autofocus
          id="inputQuery"
          placeholder="Search"
          required
          spellcheck="false"
          types="(regions)"
          @blur="inputQueryFocus = false"
          @focus="inputQueryFocus = true"
          @no-results-found="getInputQuery"
          @placechanged="getInputQuery">
        </VueGoogleAutocomplete>
        <button class="clear-button button" title="Clear search" type="button" @click.prevent="clearInputQuery">
          <IconClear class="icon"></IconClear>
        </button>
      </div>
    </div>

    <button class="search-button button" title="Search" @click.prevent="getInputQuery">
      <IconSearch class="icon"></IconSearch>
    </button>

    <button class="location-button button" title="Find your location" @click.prevent="findLocation">
      <IconLocationSearch v-if="store.locationIcon === 'search'"></IconLocationSearch>
      <IconLocationLock v-else-if="store.locationIcon === 'lock'"></IconLocationLock>
      <IconLocationDisabled v-else-if="store.locationIcon === 'disabled'"></IconLocationDisabled>
    </button>
  </form>
</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import arrive from 'arrive'
  import IconLocationDisabled from '../assets/icons/ui/location_disabled.svg'
  import IconLocationSearch from '../assets/icons/ui/location_searching.svg'
  import IconLocationLock from '../assets/icons/ui/my_location.svg'
  import IconSearch from '../assets/icons/ui/search.svg'
  import IconClear from '../assets/icons/ui/clear.svg'
  import VueGoogleAutocomplete from 'vue-google-autocomplete'

  export default {
    name: 'search',
    components: {
      IconLocationDisabled,
      IconLocationSearch,
      IconLocationLock,
      IconSearch,
      IconClear,
      VueGoogleAutocomplete
    },
    computed: {
      formattedAddress () {
        return this.store.geocode.formattedAddress
      },
      store () {
        return this.$store.state
      }
    },
    data () {
      return {
        inputQueryFocus: false
      }
    },
    methods: {
      clearInputQuery () {
        let inputQueryDOM = document.querySelector('#inputQuery')
        inputQueryDOM.value = ''
        inputQueryDOM.focus()
        this.$store.dispatch('inputQuery', null)
      },
      movePacContainer (addressData) {
        document.arrive('.pac-container', function () {
          document.querySelector('.search-box').appendChild(this)
        })
      },
      browerGeolocation () {
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            this.$store.dispatch('appStatus', {
              state: 'error',
              message: 'Unfortunately, your device does not support geolocation. No problem though. Search away.'
            })
            return
          }
          let success = position => {
            this.$store.dispatch('locationIcon', 'lock')
            this.$store.dispatch('coordinates', {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
            resolve()
          }
          let error = () => {
            this.$store.dispatch('locationIcon', 'disabled')
            this.$store.dispatch('appStatus', {
              state: 'error',
              message: 'No geolocation? No problem. Search away.'
            })
          }
          navigator.geolocation.getCurrentPosition(success, error)
        })
      },
      findLocation () {
        document.querySelector('#inputQuery').value = ''
        this.$store.dispatch('inputQuery', null)
        this.$store.dispatch('appStatus', {state: 'loading'})
        this.getBrowserLocation()
      },
      getBrowserLocation () {
        this.browerGeolocation().then(() => {
          this.$store.dispatch('geocode', 'default').then(() => {
            this.$store.dispatch('weather')
              .then(() => this.$store.dispatch('appStatus', {state: 'loaded'}))
          })
        })
      },
      getInputQuery (addressData, placeResultData) {
        let query = (placeResultData)
          ? query = placeResultData.formatted_address
          : query = document.querySelector('#inputQuery').value
        this.$store.dispatch('inputQuery', query)
        this.$store.dispatch('locationIcon', 'search')
        this.$store.dispatch('appStatus', {state: 'loading'})
        this.$store.dispatch('geocode', 'reverse')
          .then(() => this.$store.dispatch('weather')
            .then(() => this.$store.dispatch('appStatus', {state: 'loaded'})))
      }
    },
    mounted () {
      this.movePacContainer()
      this.getBrowserLocation()
    },
    watch: {
      formattedAddress () {
        document.title = `${this.store.geocode.formattedAddress} | Weather Vue`
      }
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
  z-index: 1;

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
    position: relative;

    .input-box {
      display: flex;
      height: 100%;
      overflow: hidden;
      position: relative;
    }

    input {
      font-size: 20px;
      height: 100%;
      min-width: 150px;
      padding: 5px 10px;
      position: absolute;
      width: 100%;

      &::-ms-clear {
        display: none;
      }

      &:valid + .clear-button {
        opacity: 1;
        visibility: visible;
      }

      @media(max-width: 850px) {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
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
      left: 0 !important;
      top: 100% !important;
      width: 100% !important;

      @media(max-width: 550px) {
        margin-left: 0;
        width: calc(100% + 110px) !important;
      }

      &::after {
        display: none;
      }

      .pac-item {
        align-items: center;
        display: flex;
        border-top: 0;
        cursor: pointer;
        padding: 8px 16px;

        @media(max-width: 850px) {
          padding: 16px;
        }

        span {
          font-family: inherit;
          font-size: 15px;
        }

        &:hover,
        &.pac-item-selected {
          background-color: #eaeaec;
        }

        & + .pac-item {
          border-top: 1px solid #ccc;
        }

        .pac-icon {
          margin-top: 0;
        }
      }
    }

    .clear-button {
      background-color: transparent;
      opacity: 0;
      position: absolute;
      right: 0;
      top: 0;
      transition: 0.15s;
      visibility: hidden;
    }
  }

  .button {
    margin: 0;
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
</style>
