<template>
  <div id="app">

    <div class="weather-card">
      <Search @setAppStateEmit="setAppState(...arguments)"></Search>

      <div class="weather" v-if="store.appState.state === 'loaded'"> 
        <Current></Current>
        <Forecast></Forecast>
      </div>

      <div class="loading-or-error" v-else>
        <span>{{ store.appState.message }}</span>
        <div class="spinner" v-if="store.appState.state === 'loading'"></div>
      </div>

      <button class="refresh" title="Refresh" @click="refresh()" v-if="store.darkRes.currently">
        <IconRefresh></IconRefresh>
        <span class="last fadeIn">Last updated: {{ store.darkRes.currently.time * 1000 | moment("h:mm A") }}</span>
      </button> 
    </div>
    <Background></Background>
  </div>
</template>

<script>
import Background from './components/Background'
import Search from './components/Search'
import Current from './components/Current'
import Forecast from './components/Forecast'
import IconRefresh from './assets/icons/ui/refresh.svg'

export default {
  name: 'weather',

  components: {
    Background,
    Search,
    Current,
    Forecast,
    IconRefresh
  },

  data () {
    return {
      store: this.$myStore.state.store
    }
  },

  methods: {
    refresh () {
      // bus.$emit('delete-todo', id)
    },

    setAppState: function (state, message) {
      this.store.appState.state = state
      this.store.appState.message = message
    }
  }
}
</script>

<style lang="scss">
@import 'scss/_vars.scss';
@import 'scss/_animations.scss';
@import 'scss/_base.scss';
@import 'scss/partials/_spinner.scss';

#app {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.weather-card {
  background-color: #fbfbfb;
  border-radius: 3px;
  box-shadow: 0px 0px 150px 0px rgba(0,0,0,0.5);
  color: #96969f;
  display: flex;
  flex-direction: column;
  margin-top: 10vh;
  max-width: 800px;
  min-height: 510px;
  padding: 30px;
  position: relative;
  width: 100%;
  z-index: 1;
}

.weather-card > * {
  display: flex;
  flex-direction: column;
}

.weather {
  flex: 1;
  margin-top: 16px;
  padding-bottom: 16px;
  position: relative;

  .current,
  .forecast {
    flex: 1;

    svg {
      height: auto;
      width: 100%;
    }
  }
}

.loading-or-error {
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  position: relative;

  > div {
    position: relative;
  }

  .spinner {
    margin: auto;
  }

  span {
    font-size: 16px;
    height: 16px;
    position: absolute;
    margin-bottom: -46px;
  }
}

.refresh {
  align-items: center;
  bottom: 10px;
  flex-direction: row;
  left: 10px;
  padding: 0;
  position: absolute;

  button {
    margin: 0;
    opacity: .75;
    padding: 0;
    
    img {
      transition: 0.3s;
    }

    &:hover {
      img {
        transform: rotate(45deg);
      }
    }
  }

  .last {
    color: #a1a1a9;
    font-size: 14px;
    margin-left: 5px;
  }
}
</style>
