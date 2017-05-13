import store from './store'
export default {
  store,
  install (Vue, options) {
    Vue.prototype.$myStore = store
  }
}
