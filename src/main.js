// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'reset-css'
import Vue from 'vue'
import VueMoment from 'vue-moment'
import VeeValidate from 'vee-validate'
import Promise from 'promise-polyfill'
import 'whatwg-fetch'
import App from './App'

Vue.config.productionTip = false
Vue.use(VueMoment)
Vue.use(VeeValidate)

if (!window.Promise) {
  window.Promise = Promise
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
