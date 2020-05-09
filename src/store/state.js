import { loadTab } from 'common/js/storage'
import {playMode} from 'common/js/config'

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
  user: {}
}

export default state
