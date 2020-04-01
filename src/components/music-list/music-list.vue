<template>
  <div class="music-list" v-show="singer">
    <div class="header" ref="header">
      <div class="back" @click="back">
        <i class="extend-fanhui"></i>
      </div>
      <h1 class="title" ref="title">{{singer.name}}</h1>
    </div>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>
    <div v-show="!isScrollTop" class="person-container" ref="personContainer">
      <div class="introduce">
        <div class="name">{{singer.name}}</div>
        <div class="rank" v-show="rankNum !== 0">歌手热门榜华语地区&nbsp;NO.{{rankNum}}</div>
        <div class="topic">
          <span>关注 0</span>
          <span>|</span>
          <span>话题 {{this.singer.topicPerson}}</span>
        </div>
        <div class="desc">Deer音乐人</div>
      </div>
      <div class="follow" v-show="!isScrollTop">＋&nbsp;关注</div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <sub-tab :tabs="tabs" class="sub-tab" ref="subTab"></sub-tab>
    <scroll
      class="song-list-warpper"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      @scroll="scroll"
      ref="list">
      <slot></slot>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getSingerRank} from 'api/axios'
import SubTab from 'base/tab/sub-tab'
import {prefixStyle} from 'common/js/dom'
import {mapMutations} from 'vuex'
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
    }
  },
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
      tabs: [
        {
          label: '单曲',
          data: {
            size: this.singer.musicSize
          }
        },
        {
          label: '专辑',
          data: {
            size: this.singer.albumSize
          }
        },
        {
          label: '关于TA',
          data: {
            size: ''
          }
        }
      ]
    }
  },
  mounted() {
    this._setScrollTop()
  },
  methods: {
    _getSingerRank() {
      getSingerRank().then(res => {
        if (res.code === 200) {
          this.rankList = res.list.artists
        }
      })
    },
    _setScrollTop() {
      this.top = this.$refs.personContainer.offsetTop // 提前保存距离顶部的距离
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.maxHeight = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
      // 获取tab区域的最小高度
      this.$emit('setMinHeight', document.body.clientHeight - this.imageHeight)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.setTabIndex(0)
      this.$router.back()
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
        this.$refs.personContainer.style.top = `${top}px`
      } else { // 手指向上滑
        personContainerZIndex = 0
      }
      this.$refs.personContainer.style.zIndex = personContainerZIndex
      if (newY < this.maxHeight) { // 此时已经超出页面高度
        this.isScrollTop = true
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        // 顶部标题透明度设置
        this.$refs.title.style.opacity = 1
        // 顶部标题背景设置
        this.$refs.header.style.backgroundColor = 'rgba(0, 135, 119, 1)'
        // 设置顶部tab栏固定，并设置初始index值
        this.$refs.subTab.$el.style.zIndex = 10
      } else {
        this.isScrollTop = false
        this.$refs.bgImage.style.paddingTop = '75%'
        this.$refs.bgImage.style.height = 0
        let gradientValue = (-newY / (-this.maxHeight - newY)) * 2
        this.$refs.title.style.opacity = gradientValue
        this.$refs.header.style.backgroundColor = `rgba(0, 135, 119, ${gradientValue})`
        this.$refs.subTab.$el.style.zIndex = -1
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.singer.picUrl})`
    },
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
    background-image none
    .back
      position absolute
      top 0
      left 10px
      z-index 2
      i
        font-size $font-size-large-x
        color $color-text
    .title
      font-size $font-size-medium-x
      text-align center
      opacity 0
  .bg-image
    position relative
    padding-top: 75%
    transform-origin: top
    background-size: cover
    background-image:url('singer.png')
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: $color-mask
  .person-container
    position absolute
    top 160px
    left 14px
    z-index 2
    width 100%
    .introduce
      color $color-text
      .name, .rank, .topic
        margin-bottom: 15px
      .name
        font-size $font-size-large
        font-weight 800
      .rank, .topic, .desc
        font-size $font-size-small
    .follow
      position absolute
      right 28px
      bottom 0
      width 65px
      height 28px
      line-height 28px
      text-align center
      border-radius 15px
      background-color $color-text
      color $color-background
      font-size $font-size-small
      font-weight 800
      z-index 2
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
