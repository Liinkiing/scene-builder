// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
let THREE = require('three')

Vue.config.productionTip = false

export const EventBus = new Vue()
export const LS_SAVE_KEY = 'working_scene'
THREE.Cache.enabled = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
