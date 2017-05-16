# Weather Vue

Weather app using Vue.js, Google Maps Geocoding, and Dark Sky.

![alt tag](https://raw.githubusercontent.com/krestaino/weather-vue/master/static/images/og.jpg)

## Getting Started

Rename `.keys.js.example` to `.keys.js` and add your [Google JavaScript API](https://developers.google.com/maps/documentation/javascript/get-api-key) and [Algolia](https://www.algolia.com/users/sign_up/places/) keys. The `prod` keys are exposed in your frontend code, so make sure you restrict the HTTP referrer to only allow requests from your production URL. This can be done in the Google API Console and Algolia dashboard. The `dev` keys are not included in production code and therefore don't need the same restrictions.

## Prerequisites 
The API backend for this project is located [here](https://github.com/krestaino/weather-api). This is required for the project to run. The backend API fetches geolocation data from Google and weather data from Dark Sky and returns it to the Weather Vue app.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [Vue.js webpack guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Built With
* [Vue.js](https://vuejs.org/)
* [Dark Sky API](https://darksky.net/dev/)
* [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/get-api-key)
* [Algolia Places](https://community.algolia.com/places/)

## License 
This project is licensed under the MIT License - see the LICENSE.md file for details
