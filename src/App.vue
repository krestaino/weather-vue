<template>
  <div id="app">
    <div class="weather-card">
      <Search @setAppState="setAppState(...arguments)" ref="search"/>

      <div class="weather" v-if="store.appState.state === 'loaded'"> 
        <Current @changeUnits="fetchWeather()"/>
        <Forecast/>
      </div>

      <Credits class="credits" v-else-if="store.appState.state === 'credits'"/> 

      <div :class="store.appState.state" class="loading-or-error" v-else>
        <span>{{ store.appState.message }}</span>
        <div class="spinner" v-if="store.appState.state === 'loading'"></div>
      </div>

      <div class="footer">
        <button class="refresh" title="Refresh" @click="fetchWeather()">
          <div v-if="store.darkRes.currently">
            <IconRefresh/>
            <span>Last updated: {{ timestamp(store.darkRes.currently.time * 1000, store.darkRes.timezone) }}</span>
          </div>
        </button>

        <button class="credits" title="Credits" @click="setAppState('credits')">
          <IconHelp/>
        </button> 
      </div>
    </div>
    <Background/>
  </div>
</template>

<script>
import Background from './components/Background'
import Search from './components/Search'
import Current from './components/Current'
import Forecast from './components/Forecast'
import Credits from './components/Credits'
import IconRefresh from './assets/icons/ui/refresh.svg'
import IconHelp from './assets/icons/ui/help.svg'
import moment from 'moment'
import 'moment-timezone'

export default {
  name: 'app',

  components: {
    Background,
    Search,
    Current,
    Forecast,
    Credits,
    IconRefresh,
    IconHelp
  },

  computed: {
    store () {
      return this.$store.state
    }
  },

  methods: {
    fetchWeather () {
      this.setAppState('loading')
      this.$refs.search.fetchWeather().then(() => {
        this.setAppState('loaded')
      })
    },
    setAppState (state, message) {
      this.store.appState.state = state
      this.store.appState.message = message
    },
    timestamp (time, zone) {
      return moment(time).tz(zone).format('h:mm A')
    }
  },

  mounted () {
    if (localStorage.units) {
      this.store.units = localStorage.getItem('units')
    }
  }
}
</script>

<style lang="scss">
@import 'scss/_vars.scss';
@import 'scss/_base.scss';
@import 'scss/partials/_spinner.scss';

#app {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;

  @media(max-width: 850px) {
    height: initial;
  }
}

.weather-card {
  background-color: #fbfbfb;
  border-radius: 3px;
  box-shadow: 0px 0px 150px 0px rgba(0,0,0,0.5);
  color: #383842;
  display: flex;
  flex-direction: column;
  margin-top: 10vh;
  max-width: 800px;
  min-height: 510px;
  padding: 32px;
  position: relative;
  width: 100%;
  z-index: 1;

  > * {
    display: flex;
    flex-direction: column;
  }

  @media(max-width: 850px) {
    border-radius: 0;
    margin: 32px;
    max-width: 500px;
    padding: 16px;
  }

  @media(max-width: 550px) {
    box-shadow: none;
    margin: 0;
  }
}

.weather {
  flex: 1;
  margin-top: 16px;
  padding-bottom: 16px;
  position: relative;

  @media(max-width: 850px) {
    padding-bottom: 48px;
  }

  .current,
  .forecast {
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-name: fadeIn;
    flex: 1;

    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    svg {
      height: auto;
      width: 100%;
    }
  }
}

.loading-or-error {
  align-items: center;
  flex: 1;
  justify-content: center;
  position: relative;

  .spinner {
    margin: -40px auto 0;
  }

  span {
    font-size: 16px;
    height: 16px;
    margin-top: -26px;
    position: absolute;
    top: 50%;
  }

  &.loading span {
    margin-top: 14px;
  }
}

.footer {
  align-items: center;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  left: 0;
  margin: 0;
  opacity: .75;
  padding: 10px;
  position: absolute;
  width: 100%;

  button {
    display: flex;

    svg {
      fill: $accent;
      transition: 0.3s;
    }

    &:hover {
      svg {
        transform: rotate(45deg);
      }
    }
  }

  .refresh {
    div {
      align-items: center;
      display: flex;
    }
    
    span {
      color: $accent;
      font-size: 14px;
      margin-left: 5px;
    }
  }
}
</style>
