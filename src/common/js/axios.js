import axios from 'axios'

export default function send(url) {
  return new Promise((resolve, reject) => {
    axios.get(url, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
