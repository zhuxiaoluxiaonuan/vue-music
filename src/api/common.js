import axios from 'axios'
const ERR_OK = 'OK'
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
