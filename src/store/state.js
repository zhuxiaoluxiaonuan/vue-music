import { loadTab } from 'common/js/storage'
import {playMode} from 'common/js/config'
import {loadSearch} from 'common/js/cache'

const KEY = 'index'
const state = {
  singer: {},
  tabIndex: loadTab(KEY, 0),
  hotSongs: [],
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: [],
  user: {},
  searchHistory: loadSearch()
}

export default state
