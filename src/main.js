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

Vue.filter('handleNum', function(count) {
  let tempCount = count
  if (count / 100000000 >= 1) {
    tempCount = Number(parseFloat(count / 100000000).toFixed(2).slice(0, -1))
    tempCount += '亿'
  } else if (count / 10000 >= 1) {
    tempCount = Number(parseFloat(count / 10000).toFixed(2).slice(0, -1))
    tempCount += '万'
  }
  return tempCount
})
Vue.filter('getSinger', function(artists) {
  let singer = []
  artists.forEach(item => {
    singer.push(item.name)
  })
  return singer.join('/')
})
Vue.filter('formatDate', function(date) {
  let time = new Date(Number(date))
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    prePlayListComp: null
  },
  router,
  store,
  render: h => h(App)
})
