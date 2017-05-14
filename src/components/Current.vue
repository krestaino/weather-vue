<template>
  <div class="current">
    <h1 class="location" v-if="store.geoRes">
    <!--
      * Attempt to display one of the following formats, whichever matches first.
      *
      * City, State
      * State
      *-->
      <span v-if="store.geoRes.countryCode == 'US'">
        <span v-if="store.geoRes.city">{{ store.geoRes.city }}, {{ store.geoRes.administrativeLevels.level1short }}</span>
        <span v-else>{{ store.geoRes.administrativeLevels.level1long }}</span>
      </span>
      <!--
        * Tokyo, Japan
        * Italy
        * 401 N Wabash Ave, Chicago, IL 60611, USA
        *-->
      <span v-if="store.geoRes.countryCode != 'US'">
        <span v-if="store.geoRes.city">{{ store.geoRes.city }}, </span>
        <span v-else>
          <span v-if="store.geoRes.administrativeLevels.level1long"> {{ store.geoRes.administrativeLevels.level1long }}, </span>
        </span>
        <span v-if="store.geoRes.country">{{ store.geoRes.country }}</span>
        <span v-else>{{ store.geoRes.formattedAddress }}</span>
      </span>
      <span class="weak">{{ store.geoRes.zipcode }}</span>
    </h1>

    <div class="row">
      <div class="col main">
        <div>{{ store.darkRes.currently.time * 1000 | moment("dddd, MMMM Do") }}</div>
        <div>{{ store.darkRes.currently.summary }}</div>
        <div class="icon-and-temperature">
          <div class="icon">
            <WeatherIcon :icon="store.darkRes.currently.icon"/>
          </div>
          <div class="temperature">
            <div>{{ Math.round(store.darkRes.currently.temperature) }}</div>
              <sup :class="store.units">
                <button class="us" title="Switch to Fahrenheit" @click="changeUnits('us')">°F</button>
                <button class="si" title="Switch to Celsius" @click="changeUnits('si')">°C</button>
            </sup>
          </div>
        </div>
      </div>

      <ul class="col details">
        <li>
          Precipitation: <strong>{{ Math.round(store.darkRes.currently.precipProbability * 100) }}%</strong>
        </li>
        <li>
          Cloud Coverage: <strong>{{ Math.round(store.darkRes.currently.cloudCover * 100) }}%</strong>
        </li>
        <li>
          Humidity: <strong>{{ store.darkRes.currently.humidity * 100 }}%</strong>
        </li>
        <li>
          Dew Point: <strong>{{ Math.round(store.darkRes.currently.dewPoint) }}° {{ dewPointLabel }}</strong>
        </li>
        <li>
          Wind: <strong>{{ store.darkRes.currently.windSpeed }} {{ windSpeedLabel }}</strong>
        </li>
        <li>
          Visibility: <strong>{{ store.darkRes.currently.visibility }} {{ visibilityLabel }}</strong>
        </li>
        <li>
          Sunrise: <strong>{{ store.darkRes.daily.data[0].sunriseTime * 1000 | moment("h:mm A") }}</strong>
        </li>
        <li>
          Sunset: <strong>{{ store.darkRes.daily.data[0].sunsetTime * 1000 | moment("h:mm A") }}</strong>
        </li>
      </ul>
    </div> <!-- end .row -->
  </div>
</template>

<script>
import WeatherIcon from './WeatherIcon'

export default {
  name: 'current',

  components: {
    WeatherIcon
  },

  computed: {
    store () {
      return this.$store.state
    },

    dewPointLabel () {
      switch (this.store.units) {
        case 'us':
          return 'F'
        case 'si':
          return 'C'
      }
    },

    visibilityLabel () {
      switch (this.store.units) {
        case 'us':
          return 'miles'
        case 'si':
          return 'km'
      }
    },

    windSpeedLabel () {
      switch (this.store.units) {
        case 'us':
          return 'mph'
        case 'si':
          return 'kph'
      }
    }
  },

  methods: {
    changeUnits (unit) {
      localStorage.setItem('units', unit)
      this.store.units = unit
      this.$emit('changeUnits')
    }
  }
}
</script>

<style lang="scss">
.current {
  .row {
    display: flex;
    
    & + .row {
      padding-top: 16px;
    }

    @media(max-width: 850px) {
      flex-direction: column;
    }

    .col {
      flex: 1;
    }
  }

  .location {
    align-items: baseline;
    display: flex;
    font-size: 32px;

    div span {
      &::after {
        content: ', '
      }

      &:last-child {
        &::after {
          content: ''
        }
      }
    }

    .weak {
      color: #b5b6bc;
      font-size: 26px;
      margin-left: 8px;
    }
  }

  .icon-and-temperature {
    display: flex;
    padding-top: 8px;
  }

  .icon {
    height: 64px;
    width: 64px;
  }

  .temperature {
    display: flex;
    margin-left: 8px;
    margin-top: -8px;

    div {
      font-size: 64px;
      font-weight: 300;
    }

    sup {
      margin-top: 8px;

      .us {
        padding-right: 4px;
      }

      .si {
        border-left: 1px solid #ddd;
        padding-left: 4px;
      }

      &.us {
        .us {
          font-weight: bold;
          pointer-events: none;
        }

        .si {
          color: #b5b6bc;
        }
      }

      &.si {
        .si {
          font-weight: bold;
          pointer-events: none;
        }

        .us {
          color: #b5b6bc;
        }
      }

      span {
        cursor: pointer;
      }
    }
  }

  .details {
    display: flex;
    flex-wrap: wrap;
    font-size: 15px;
    line-height: 1;
    padding-top: 8px;

    li {
      margin-top: 0;
      text-align: right;
      width: 50%;
    }
  }
}
</style>
