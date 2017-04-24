// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'reset-css'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import App from './App'

Vue.config.productionTip = false
Vue.use(require('vue-moment'))
Vue.use(VeeValidate)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
