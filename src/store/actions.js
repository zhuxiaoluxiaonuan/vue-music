import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
// 当需要批量操作mutation时，可以使用actions
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}
// 随机播放
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  // 从第一项开始播放
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}
// 添加歌曲
export const insertSong = function({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = state.playList[currentIndex]
  // 查询在playList中是否已经包含插入的歌曲
  let fpIndex = findIndex(playList, song)
  // 因为是插入歌曲，所有索引+1
  currentIndex++
  // 向playList中插入歌曲, 在当前歌曲的后面插入
  playList.splice(currentIndex, 0, song)
  if (fpIndex > -1) { // playList列表中包含当前插入歌曲
    if (fpIndex >= currentIndex) { // 重复元素在当前播放歌曲的后面
      playList.splice(fpIndex + 1, 1)
    } else { // 重复元素在当前播放歌曲的前面
      playList.splice(fpIndex, 1)
      currentIndex--
    }
  }
  // 查询在sequenceList中是否已经包含插入的歌曲
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  // 查询在sequenceList中是否已经包含插入的歌曲
  let fsIndex = findIndex(sequenceList, song)
  // 向sequenceList中插入歌曲, 在当前歌曲的后面插入
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) { // sequenceList列表中包含当前插入歌曲
    if (fsIndex >= currentSIndex) { // 重复元素在当前播放歌曲的后面
      sequenceList.splice(fsIndex + 1, 1)
    } else { // 重复元素在当前播放歌曲的前面
      sequenceList.splice(fsIndex, 1)
    }
  }
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}
