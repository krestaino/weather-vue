import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appState: {
      message: '',
      state: 'loading'
    },
    darkRes: {},
    geoRes: {},
    latitude: '',
    longitude: '',
    inputQuery: '',
    locationIcon: 'search',
    units: 'us'
  }
})
