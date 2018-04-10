<template>
  <div class="current">
    <h1 class="location">{{ store.geocode.formatted_address }}</h1>

    <div class="row">
      <div class="col main">
        <div>{{ date(store.weather.currently.time * 1000, store.weather.timezone) }}</div>
        <div>{{ store.weather.currently.summary }}</div>
        <div class="icon-and-temperature">
          <div class="icon">
            <WeatherIcon :icon="store.weather.currently.icon"></WeatherIcon>
          </div>
          <div class="temperature">
            <div>{{ Math.round(store.weather.currently.temperature) }}</div>
            <sup :class="store.units">
              <button class="us" title="Switch to Fahrenheit" @click="changeUnits('us')">°F</button>
              <button class="si" title="Switch to Celsius" @click="changeUnits('si')">°C</button>
            </sup>
          </div>
        </div>
      </div>

      <ul class="col details">
        <li>
          Precipitation: <strong>{{ toPercentage(store.weather.currently.precipProbability) }}%</strong>
        </li>
        <li>
          Cloud Coverage: <strong>{{ toPercentage(store.weather.currently.cloudCover) }}%</strong>
        </li>
        <li>
          Humidity: <strong>{{ toPercentage(store.weather.currently.humidity) }}%</strong>
        </li>
        <li>
          Dew Point: <strong>{{ Math.round(store.weather.currently.dewPoint) }}° {{ dewPointLabel }}</strong>
        </li>
        <li>
          Wind: <strong>{{ store.weather.currently.windSpeed }} {{ windSpeedLabel }}</strong>
        </li>
        <li>
          Visibility: <strong>{{ store.weather.currently.visibility }} {{ visibilityLabel }}</strong>
        </li>
        <li>
          Sunrise: <strong>{{ timestamp(store.weather.daily.data[0].sunriseTime * 1000, store.weather.timezone)}}</strong>
        </li>
        <li>
          Sunset: <strong>{{ timestamp(store.weather.daily.data[0].sunsetTime * 1000, store.weather.timezone)}}</strong>
        </li>
      </ul>
    </div> <!-- end .row -->
  </div>
</template>

<script>
  import WeatherIcon from './WeatherIcon'
  import moment from 'moment'
  import 'moment-timezone'

  export default {
    name: 'current',
    components: {
      WeatherIcon
    },
    computed: {
      dewPointLabel () {
        switch (this.store.units) {
          case 'us':
            return 'F'
          case 'si':
            return 'C'
        }
      },
      store () {
        return this.$store.state
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
      changeUnits (units) {
        this.$store.dispatch('units', units)
        this.$store.dispatch('appStatus', {state: 'loading'})
        this.$store.dispatch('weather').then(() => this.$store.dispatch('appStatus', {state: 'loaded'}))
      },
      date (time, zone) {
        return moment(time).tz(zone).format('dddd, MMMM Do')
      },
      timestamp (time, zone) {
        return moment(time).tz(zone).format('h:mm A')
      },
      toPercentage (value) {
        return Math.round(value * 100)
      }
    }
  }
</script>

<style lang="scss">
@import '../scss/_vars.scss';

.current {
  font-size: 20px;

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
    margin-bottom: 4px;

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
      color: $accentLight;
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

    svg {
      fill: $accent;
    }
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
      margin-top: 11px;

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
          color: $accentLight;
        }
      }

      &.si {
        .si {
          font-weight: bold;
          pointer-events: none;
        }

        .us {
          color: $accentLight;
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

    @media(max-width: 850px) {
      padding-top: 0;
    }

    li {
      margin-top: 0;
      text-align: right;
      width: 50%;

      @media(max-width: 850px) {
        margin-top: 8px;
        text-align: left;
      }
    }
  }
}
</style>
