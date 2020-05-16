import storage from 'good-storage'

const SEARCH_KEY = '_search_'
const SEARCH_MAX_LENGTH = 15 // 搜索历史数组中最多能存储的数据总数
const PLAY_KEY = '_play_'
const PLAY_MAX_LENGTH = 200 // 播放历史数组中最多能存储的数据总数

/**
 * 向搜索历史数组中插入某一项
 * 规则：
 * 新插入的数据必须插入到数组中的第一项
 * 当数组中有与插入项相同的数据，则删除重复数据，再插入
 * 当数组第一项与插入项相同，直接退出，不执行任何操作
 * 如果执行插入操作后，数组的长度操作最大长度值，则删除删除数组中的最后一项
 * @param arr
 * @param val
 * @param compare
 * @param maxLen
 */
function insertArray(arr, val, compare, maxLen) {
  let index = arr.findIndex(compare)
  if (index === 0) return
  if (index > 0) arr.splice(index, 1)
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) arr.pop()
}

/**
 * 将最新的搜索保存到本地存储中
 * @param query
 * @returns {*}
 */
export function saveSearch(query) {
  let searchArr = storage.get(SEARCH_KEY, [])
  insertArray(searchArr, query, item => item === query, SEARCH_MAX_LENGTH)
  // 将最新的数组保存到本地存储中
  storage.set(SEARCH_KEY, searchArr)
  // 将最新的数组返回
  return searchArr
}

/**
 * 获取本地存储中的搜索历史数组
 * @returns {*}
 */
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

/**
 * 删除本地存储的搜索历史数据
 * @returns {*}
 */
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

/**
 * 将最新的播放歌曲保存到本地存储中
 * @param song
 * @returns {*}
 */
export function savePlay(song) {
  let playArr = storage.get(PLAY_KEY, [])
  insertArray(playArr, song, item => item.id === song.id, PLAY_MAX_LENGTH)
  // 将最新的数组保存到本地存储中
  storage.set(PLAY_KEY, playArr)
  // 将最新的数组返回
  return playArr
}

/**
 * 获取本地存储中的播放历史数组
 * @returns {*}
 */
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

/**
 * 删除本地存储的播放历史数据
 * @returns {*}
 */
export function clearPlay() {
  storage.remove(PLAY_KEY)
  return []
}
