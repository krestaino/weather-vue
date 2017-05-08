<template>
  <form class="search" @submit.prevent="validateBeforeSubmit" :class="{'loading': appState.state === 'loading' }">
    
    <div class="search-box">
      <input autofocus :class="{'error': errors.has('inputQuery') }" data-vv-validate-on="keyup" id="inputQuery" name="inputQuery" v-model="search.inputQuery" v-validate:inputQuery.initial="'required'" type="text" placeholder="Search">
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
      <button class="button" title="Find your location" @click.prevent="findLocationEmit">
        <span v-if="search.locationIcon === 'search'">
          <IconLocationSearch></IconLocationSearch>
        </span>
        <span v-else-if="search.locationIcon === 'lock'">
          <IconLocationLock></IconLocationLock>
        </span>
        <span v-else-if="search.locationIcon === 'disabled'">
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

  props: {
    appState: {
      type: Object,
      required: true
    },
    search: {
      type: Object,
      required: true
    }
  },

  methods: {
    findLocationEmit () {
      this.search.inputQuery = ''
      this.errors.clear()
      this.$emit('findLocationEmit')
      this.focusInputQuery()
    },

    focusInputQuery () {
      document.querySelector('#inputQuery').focus()
    },

    setAppStateEmit (state, message) {
      this.$emit('setAppStateEmit', state, message)
    },

    validateBeforeSubmit () {
      this.$validator.validateAll().then(() => {
        this.$emit('setAppStateEmit', 'loading')
        this.$emit('setLocationIconEmit', 'search')
        this.$emit('fetchCoordinatesEmit')
        this.focusInputQuery()
      }).catch(() => {
        return
      })
    }
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
