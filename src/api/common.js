/**
 * axios 封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios'
import Vue from 'vue'

const ERR_OK = 'OK'

// 请求超时时间
axios.defaults.timeout = 10000
// 设置跨域 cookie
axios.defaults.withCredentials = true
// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是 200 的情况
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 301:
          error.message = '需要登录'
          break
        case 503:
          error.message = '验证码错误'
          break
        default:
      }
      Vue.prototype.$errorMessage = error.message
      return Promise.reject(error.response)
    }
  }
)

export function get(url) {
  return function (params) {
    return axios.get(url, {
      params
    }).then(res => {
      const {statusText, data} = res
      if (statusText === ERR_OK) {
        return data
      }
    }).catch(rej => {})
  }
}
export function all(promiseArr) {
  return axios.all(promiseArr).then(
    axios.spread(function(...resList) {
      return resList
    }))
}
