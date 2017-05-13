// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'reset-css'
import Vue from 'vue'
import App from './App'
import VueMoment from 'vue-moment'
import VeeValidate from 'vee-validate'
import Vuex from 'vuex'
import storePlugin from './storePlugin'
import Promise from 'promise-polyfill'
import 'whatwg-fetch'

Vue.config.productionTip = false

Vue.use(VueMoment)
Vue.use(VeeValidate)
Vue.use(Vuex)
Vue.use(storePlugin)

// IE11 Promise Polyfill
if (!window.Promise) {
  window.Promise = Promise
}

const bus = new Vue()
Vue.prototype.$bus = bus

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
