<template>
  <div class="music-list" v-show="singer">
    <div class="header" ref="header">
      <div class="back" @click="back">
        <i class="extend-fanhui"></i>
      </div>
      <h1 class="title" ref="title">{{minTitle}}</h1>
    </div>
    <slot name="descSlot"
            :is-scroll-top="isScrollTop"
            :rank-num="rankNum"></slot>
    <div class="bg-layer" ref="layer"></div>
    <sub-tab :tabs="minTabs" class="sub-tab" ref="subTab"></sub-tab>
    <scroll
      class="song-list-warpper"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      @scroll="scroll"
      ref="list">
      <slot name="songList"></slot>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getSingerRank} from 'api/axios'
import SubTab from 'base/tab/sub-tab'
import {prefixStyle} from 'common/js/dom'
import {mapMutations} from 'vuex'
import {playListMixin} from 'common/js/mixin'

const RESERVED_HEIGHT = 50 // 顶部预留的高度
const transform = prefixStyle('transform')

export default {
  name: 'music-list',
  props: {
    singer: {
      type: Object,
      default() {
        return {}
      }
    },
    paddingTop: {
      type: String,
      default: ''
    },
    minTitle: {
      type: String,
      default: ''
    },
    minTabs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  mixins: [playListMixin],
  created() {
    this.probeType = 3
    this.listenScroll = true
    this._getSingerRank()
  },
  data() {
    return {
      rankList: [],
      isShowTitle: false,
      isScrollTop: false, // 是否将列表滑动到顶部
      scrollY: -1, // 需要watch的数据必须在data中初始化，否则监测不到它的变化
      minHeight: 0,
      bgImage: {},
      personContainer: {}
    }
  },
  mounted() {
    this.getSlotChildren() // 获得插槽中的元素
    this._setScrollTop()
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '45px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    _getSingerRank() {
      getSingerRank().then(res => {
        if (res.code === 200) {
          this.rankList = res.list.artists
        }
      })
    },
    _setScrollTop() {
      this.top = this.personContainer.offsetTop // 提前保存距离顶部的距离
      this.imageHeight = this.bgImage.clientHeight
      this.maxHeight = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
      // 获取tab区域的最小高度
      this.$emit('setMinHeight', document.body.clientHeight - this.imageHeight)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$emit('back')
      setTimeout(() => {
        this.setTabIndex(0)
      }, 200)
    },
    getSlotChildren() {
      let parent = this.$el.children[1]
      this.bgImage = parent.children[0]
      this.personContainer = parent.children[1]
    },
    ...mapMutations({
      'setTabIndex': 'SET_TABINDEX'
    })
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.maxHeight, newY)
      let zIndex = 0
      let personContainerZIndex = 0
      let scale = 1 // 背景图片放大倍数
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      let percent = Math.abs(newY / this.imageHeight) // 滑动距离与背景图片的比值
      if (newY > 0) { // 手指向下滑动
        scale = 1 + percent
        personContainerZIndex = 10
        let top = this.top + newY
        this.personContainer.style.top = `${top}px`
      } else { // 手指向上滑
        personContainerZIndex = 0
      }
      this.personContainer.style.zIndex = personContainerZIndex
      if (newY < this.maxHeight) { // 此时已经超出页面高度
        this.isScrollTop = true
        zIndex = 10
        this.bgImage.style.paddingTop = 0
        this.bgImage.style.height = `${RESERVED_HEIGHT}px`
        // 顶部标题透明度设置
        this.$refs.title.style.opacity = 1
        // 顶部标题背景设置
        this.$refs.header.style.backgroundColor = '#000000'
        // 设置顶部tab栏固定，并设置初始index值
        this.$refs.subTab.$el.style.zIndex = 10
        this.personContainer.style.opacity = 0
      } else {
        this.isScrollTop = false
        this.bgImage.style.paddingTop = this.paddingTop
        this.bgImage.style.height = 0
        let gradientValue = (-newY / (-this.maxHeight - newY)) * 2
        this.$refs.title.style.opacity = gradientValue
        this.$refs.header.style.backgroundColor = `rgba(0, 0, 0, ${gradientValue})`
        this.$refs.subTab.$el.style.zIndex = -1
        this.personContainer.style.opacity = 1 - gradientValue
      }
      this.bgImage.style.zIndex = zIndex
      this.bgImage.style[transform] = `scale(${scale})`
    }
  },
  computed: {
    rankNum() {
      let num = 0
      let rankList = this.rankList
      if (!rankList.length) return
      for (let i = 0; i < rankList.length; i++) {
        const rank = rankList[i]
        if (rank.id === this.singer.id) {
          num = i + 1
          break
        }
      }
      return num
    }
  },
  components: {
    Scroll,
    SubTab
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.music-list
  position relative
  width 100%
  height 100%
  .header
    position fixed
    top 0
    left 0
    width 100%
    height 50px
    line-height 50px
    z-index: 100
    color $color-background
    .back
      position absolute
      top 0
      left 10px
      z-index 2
      i
        font-size $font-size-large-x
    .title
      margin 0 auto
      width 75%
      font-size $font-size-medium-x
      text-align center
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      opacity 0
  .bg-layer
    position: relative
    height: 100%
    background: $color-background
    z-index 2
  .song-list-warpper
    position fixed
    top 0
    bottom 0
    width: 100%
    height auto
    overflow initial
    z-index 2
  .sub-tab
    position fixed
    top 50px
    left 0
    width 100%
    height 44px
    z-index -1
    background-color $color-background
</style>
