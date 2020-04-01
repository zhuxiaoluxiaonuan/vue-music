export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  const classNameArr = el.className.split(' ')
  classNameArr.push(className)
  el.className = classNameArr.join(' ')
}
export function removeClass(el, className) {
  if (!hasClass(el, className)) {
    return
  }
  const classNameArr = el.className.split(' ')
  for (let i = 0; i < classNameArr.length; i++) {
    if (classNameArr[i] === className) {
      classNameArr[i] = classNameArr[classNameArr.length - 1]
      classNameArr.length -= 1
    }
  }
  el.className = classNameArr.join(' ')
}
function hasClass(el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

let elementStyle = document.createElement('div').style
let vendor = (() => { // 返回当前浏览器是属于那种浏览器【谷歌、火狐、欧朋、IE。。】
  let transformNames = {
    webkit: 'webkitTransform',
    moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()
export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
