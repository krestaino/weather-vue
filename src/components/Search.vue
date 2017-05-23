<template>
  <form class="search" @submit.prevent>
    <div class="search-box">
      <vue-google-autocomplete autofocus
        id="inputQuery"
        placeholder="Search"
        types="(cities)"
        v-on:placechanged="getInputQuery"/>
    </div>

    <div class="search-button">
      <button class="button" title="Search" type="submit">
        <IconSearch class="icon"/>
      </button>
    </div>

    <div class="location-button">
      <button class="button" title="Find your location" @click.prevent="findLocation">
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

  data () {
    return {
      searchFocus: false
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

    input {
      width: 100%;
      font-size: 20px;
      height: 100%;
      min-width: 150px;
      padding: 5px 10px;

      &::-ms-clear {
        display: none;
      }

      @media(max-width: 850px) {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
      }
    }

    .algolia-places-nostyle {
      display: flex !important;
      flex: 1;
      font-size: 15px;
      height: 100%;
      width: 100%;

      .ap-nostyle-dropdown-menu {
        background-color: #fbfbfb;
        border-radius: 2px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-left: 1px solid #2c2d3e;
        border-right: 1px solid #2c2d3e;
        border-bottom: 1px solid #2c2d3e;
        width: 100%;

        @media(max-width: 850px) {
          width: calc(100% + 110px);
        }

        .ap-nostyle-suggestion {
          cursor: pointer;
          padding: 8px 16px;

          @media(max-width: 850px) {
            padding: 16px;
          }

          + .ap-nostyle-suggestion {
            border-top: 1px solid #ccc;
          }

          em {
            font-weight: 400;
          }

          .ap-address {
            color: inherit;
          }

          &.ap-nostyle-cursor {
            background-color: #eaeaec;
          }

          svg {
            fill: #ceced2;
          }
        }

        .ap-footer {
          display: none;
        }
      }

      .ap-nostyle-icon-clear {
        height: 100%;
        padding: 15px;
        position: absolute;
        right: 0;
        top: 0;
      }

      .ap-nostyle-icon-pin {
        display: none;
      }
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
