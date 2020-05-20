import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {getSearchSuggest, getHotSearch} from 'api/axios'
import NoResult from 'base/no-result/no-result'
import SearchBox from 'base/search-box/search-box'

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
      this.showToast()
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
    showToast() {
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
export const searchMixin = {
  data() {
    return {
      keywords: '',
      searchSuggests: [],
      hotSearchList: [],
      step: 1,
      flag: false, // 标志是否发送过搜索建议请求
      sureQuery: false // 是否确认搜索
    }
  },
  methods: {
    _getSearchSuggest() {
      getSearchSuggest({
        keywords: this.keywords,
        limit: 15,
        type: 'mobile'
      }).then(res => {
        if (res.code === 200) {
          if (res.msg) return
          this.searchSuggests = res.result.allMatch ? res.result.allMatch : []
          this.flag = true
        }
      })
    },
    addQuery(keywords, step = 3, pageLabel = '综合') {
      this.sureQuery = true
      this.keywords = keywords
      this.$refs.searchBox.setQuery(keywords)
      this.searchSuggests = []
      this.step = step
      this.changePage(pageLabel)
      // 将搜索记录保存到本地缓存中
      this.saveSearchHistory(this.keywords)
    },
    _getHotSearch() {
      getHotSearch().then(res => {
        if (res.code === 200) {
          this.hotSearchList = res.data
        }
      })
    },
    del() {
      this.sureQuery = false
      this.step = 1
    },
    query(keywords) {
      this.keywords = keywords
      if (keywords === '') {
        this.sureQuery = false
        this.step = 1
        this.searchSuggests = []
        return
      }
      if (this.sureQuery) {
        this.sureQuery = false
        return
      }
      this.step = 2
      this._getSearchSuggest()
    },
    ...mapActions([
      'insertSong',
      'saveSearchHistory'
    ])
  },
  computed: {
    isResult() {
      return this.flag && this.searchSuggests.length === 0
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  components: {
    SearchBox,
    NoResult
  }
}
