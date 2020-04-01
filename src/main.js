import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import 'common/stylus/index.styl'
import store from './store'
import './cube-ui'
import './createAPI/createAPI'

Vue.use(VueLazyload, {
  loading: require('./common/image/default.png')
})
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
