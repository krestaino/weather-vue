<template>
  <form class="search" @submit.prevent="validateBeforeSubmitEmit" :class="{'loading': appState.state === 'loading' }">
    <div class="search-box">
      <input autofocus :class="{'error': errors.has('inputQuery') }" data-vv-validate-on="keyup" name="inputQuery" v-model="inputQuery" v-validate:inputQuery.initial="'required'" type="text" placeholder="Search">
    </div>
    <div>
      <span class="error-note" v-show="errors.has('inputQuery')">Search field can not be blank.</span>
    </div>
    <div>
      <button class="button" title="Search" type="submit">
        <IconSearch class="icon"></IconSearch>
      </button>
    </div>
    <div>
      <button class="button" title="Find your location" v-on:click.prevent="findLocationEmit">
        <span v-if="locationIcon === 'search'">
          <IconLocationSearch></IconLocationSearch>
        </span>
        <span v-else-if="locationIcon === 'lock'">
          <IconLocationLock></IconLocationLock>
        </span>
        <span v-else-if="locationIcon === 'disabled'">
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
      inputQuery: ''
    }
  },

  props: {
    appState: {
      type: Object,
      required: true
    },
    locationIcon: {
      type: String,
      required: true
    }
  },

  methods: {
    findLocationEmit () {
      this.inputQuery = ''
      this.$emit('findLocationEmit')
    },
    validateBeforeSubmitEmit () {
      this.$emit('validateBeforeSubmitEmit', this.inputQuery)
    }
  }
}
</script>
