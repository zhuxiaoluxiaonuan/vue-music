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
