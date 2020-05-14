import {mapGetters, mapMutations} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() {
      // 当调用此mixin的组件中没有定义这个方法时，就会调用此方法，并会抛出异常
      throw new Error('component must implement handlePlayList method')
    }
  }
}
export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.loop ? 'extend-danquxunhuan1' : (this.mode === playMode.random ? 'extend-bofangye-caozuolan-suijibofang' : 'extend-xunhuanbofang')
    },
    modeTxt() {
      return this.mode === playMode.loop ? '单曲循环' : (this.mode === playMode.random ? '随机播放' : '顺序播放')
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playList'
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      this.showToastType()
      let list = this.sequenceList
      if (mode === playMode.random) {
        list = shuffle(list)
      }
      // 在打乱顺序的列表中找到与当前播放的音乐对应的index，并将它赋值到当前的index属性中
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(arr) {
      let index = arr.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    showToastType() {
      const toast = this.$createToast({
        txt: this.modeTxt,
        type: 'correct'
      })
      toast.show()
    },
    ...mapMutations({
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    })
  }
}
