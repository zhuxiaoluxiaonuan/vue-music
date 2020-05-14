import glfx from 'glfx'
export function shuffle(arr) { // 打乱一个数组的思路：循环遍历数组中的每一项，取出0, i之间的任意一个整数j，然后将数组中的第j项和第i项互换位置。【注意：方法中改变的应该是初始数组的拷贝，以免产生数据污染的情况】
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[j]
    _arr[j] = _arr[i]
    _arr[i] = t
  }
  return _arr
}
// 取出两个数之间的任意一个整数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 图片转 base64
 * @param {String} url 图片链接
 * @param {Function} callback 回调
 * @param {Function} blur 模糊值
 * @param {Function} brightness 明亮值(0 ~ -1)
 */
export function imgToBlob(url, callback, blur, brightness) {
  let img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  img.src = url
  img.onload = () => {
    let canvas = null
    if (blur === undefined || brightness === undefined) {
      canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
    } else {
      canvas = glfx.canvas()
      let texture = canvas.texture(img)
      canvas.draw(texture).lensBlur(blur, -1, 0).brightnessContrast(brightness, 0).update()
    }
    callback(canvas.toDataURL('image/jpeg', 0.8))
  }
}

/**
 * blob 方式跨域下载图片
 * @param {String} url 图片链接
 * @param {String} name 本地保存的图片名
 * @param {Boolean} dl 是否下载
 */
export function downloadByBlob(url, name = 'image') {
  let img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  img.src = url
  img.onload = () => {
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)
    canvas.toBlob((blob) => {
      let url = URL.createObjectURL(blob)
      download(url, name)
      URL.revokeObjectURL(url) // 用完释放URL对象
    })
  }
}
function download(href, name = 'image') {
  let a = document.createElement('a')
  a.download = name
  a.href = href
  a.click()
  a.remove()
}

/**
 * debounce 函数节流，当输入框频繁输入时，需要做函数节流处理 ，提高性能
 * 原理：利用科里化函数的思想
 * @param func
 * @param delay
 */
export function debounce(func, delay) {
  let timer
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
