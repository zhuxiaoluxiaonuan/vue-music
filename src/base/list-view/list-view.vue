<template>
  <div class="list-view">
    <loading v-if="singers.length === 0"></loading>
    <scroll
      v-else
      :data="singers"
      :probe-type="probeType"
      :listenScroll="listenScroll"
      @scroll="scroll"
      ref="listView"
    >
      <ul>
        <li class="list-group" v-for="(singer, index) in singers" :key="index" ref="listGroup">
          <div class="title">{{singer.title}}</div>
          <ul>
            <li class="list-group-item" v-for="item in singer.items" :key="item.id" @click="toDetail(item)">
              <img v-lazy="item.picUrl" alt="">
              <div class="desc">
                <div class="name">
                  {{item.name}}
                  <span v-show="item.alias.length">({{item.alias[0]}})</span>
                </div>
                <div class="size">
                  <div class="music-size">歌曲：{{item.musicSize}}</div>
                  <div class="album-size">专辑：{{item.albumSize}}</div>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="shortcutList"
       v-show="shortcutList.length"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li
          :class="{'item': true, 'current': currentIndex === index}"
          v-for="(shortcut, index) in shortcutList"
          :key="index"
          :data-index="index"
        >
          {{shortcut}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="listFixed">
      <h1 class="title">{{fixedTitle}}</h1>
    </div>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT = 18 // 每个字母的高度
const TITLE_HEIGHT = 30 // 标题的高度
export default {
  name: 'list-view',
  created() {
    this.touch = [] // 在created函数中定义而不在data中定义的原因：在data中定义的变量会被自动监听，而在created中定义的变量不会被监听
    this.listenScroll = true
    this.probeType = 3
    this.listHeight = []
  },
  props: {
    singers: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1 // 列表滚动的距离与每一个字母组末尾位置的高度差
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      const anchorIndex = getData(e.target, 'index')
      this.touch.startY = e.touches[0].pageY
      this.touch.anchorIndex = parseInt(anchorIndex) // 将字符串转换为整数
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      this.touch.endY = e.touches[0].pageY
      const delta = (this.touch.endY - this.touch.startY) / ANCHOR_HEIGHT | 0 // 非0：等同于Math.floor()
      const anchorIndex = delta + this.touch.anchorIndex
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      // 边界情况判断
      if (!index && index !== 0) return
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      // 当点击右侧字母时
      this.scrollY = -this.listHeight[index]
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight() {
      this.listHeight = []
      let list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    },
    toDetail(item) {
      this.$emit('select', item)
    },
    refresh () { // 供外部父组件调用
      this.$refs.listView && this.$refs.listView.refresh()
    }
  },
  computed: {
    shortcutList () {
      if (this.singers.length > 0) {
        return this.singers.map(singer => {
          return singer.title.substring(0, 1)
        })
      }
      return []
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.singers[this.currentIndex] ? this.singers[this.currentIndex].title : ''
    }
  },
  watch: {
    singers () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newVal) {
      const listHeight = this.listHeight
      // 1. 当newVal > 0的时候，滚动到最顶部
      if (newVal > 0) {
        this.currentIndex = 0
        return
      }
      // 当滚动到中间的时候
      for (let i = 0; i < listHeight.length - 1; i++) {
        const heightStar = listHeight[i]
        const heightEnd = listHeight[i + 1]
        if (-newVal >= heightStar && -newVal < heightEnd) {
          this.diff = heightEnd + newVal // 这里的newVal负值，结果是高度差
          this.currentIndex = i
          return
        }
      }
      // 当滚动到最底部的时候，且newVal的值大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2 // 为什么减2？因为listHeight数组始终大1
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) return
      this.fixedTop = fixedTop
      this.$refs.listFixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable.styl'
.list-view
  position relative
  width 100%
  height 100%
  .title
    padding-left 14px
    height 30px
    line-height 30px
    background-color #f9f9f9
    font-size $font-size-small
    color $color-text-ll
  .list-group
    padding-bottom 10px
    ul
      .list-group-item
        padding-left 14px
        display flex
        align-items center
        justify-content left
        height 80px
        img
          width 60px
          height 60px
          border-radius 50%
        .desc
          margin-left 20px
          display flex
          flex-direction column
          justify-content center
          .name
            margin-bottom 10px
            color $color-text-ll
            font-size $font-size-medium
          .size
            display flex
            align-items center
            color $color-text-d
            font-size $font-size-small
            .music-size
              margin-right 10px
  .shortcutList
    position absolute
    right 0
    top 50%
    transform translateY(-50%)
    width 20px
    padding 20px 0
    text-align center
    font-family Helvetica
    .item
      padding 3px
      line-height 1
      color $color-text-d
      font-size $font-size-small
      &.current
        color $color-theme
  .list-fixed
    position absolute
    top 0
    left 0
    width 100%
</style>
