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
  },

  actions: {
    geocode ({ commit, state }, type) {
      return new Promise((resolve, reject) => {
        let query = (type === 'default')
          ? query = `latlng=${state.latitude},${state.longitude}`
          : query = `address=${encodeURIComponent(state.inputQuery)}`

        fetch(`${process.env.API_URL.geocode}${query}&key=${process.env.API_KEY.google}`)
          .then((response) => {
            if (response.status !== 200) {
              state.appState.state = 'error'
              state.appState.message = 'Uh oh, the geolocation API is not responding. Please try again.'
              return
            }

            response.json().then((data) => {
              if (!data.results.length) {
                state.appState.state = 'error'
                state.appState.message = 'No results found. Please try another search.'
                return
              }
              state.latitude = data.results[0].geometry.location.lat
              state.longitude = data.results[0].geometry.location.lng
              state.geoRes = data.results[0]
              resolve(response)
            })
          })
          .catch(() => {
            state.appState.state = 'error'
            state.appState.message = 'Uh oh, the geolocation API is not responding.'
          })
      })
    },
    weather ({ commit, state }) {
      return new Promise((resolve, reject) => {
        fetch(`${process.env.API_URL.weather}lat=${state.latitude}&lon=${state.longitude}&units=${state.units}`)
          .then((response) => {
            if (response.status !== 200) {
              state.appState.state = 'error'
              state.appState.message = 'Uh oh, the geolocation API is not responding. Please try again.'
              return
            }

            response.json().then((data) => {
              if (!data) {
                state.appState.state = 'error'
                state.appState.message = 'No results found. Please try another search.'
                return
              }
              state.darkRes = data
              resolve(response)
            })
          })
          .catch(() => {
            state.appState.state = 'error'
            state.appState.message = 'Uh oh, the geolocation API is not responding.'
          })
      })
    }
  }
})
