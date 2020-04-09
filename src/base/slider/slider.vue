<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span v-for="(dot, index) in dots" :key="index" :class="{'dot': true, 'active' : currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'
export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDot() // 初始化点，必须放在轮播图初始化之前，轮播图宽度设置之后
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    }, 20) // 约定俗成20ms为最佳等待时间
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true) // true标志位：表示当前是重置slider的宽度，而不是第一次设置宽度
      this.slider.refresh()
    }) // 监听当前视口是否发生了改变
  },
  methods: {
    _setSliderWidth(isReset) { // 设置slider元素的宽高
      this.children = this.$refs.sliderGroup.children
      const sliderWidth = this.$refs.slider.clientWidth
      let width = 0
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isReset) { // 如果当前操作是重置，则width不需要再增加两个sliderWidth大小
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() { // 初始化better-scroll
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        bounce: false,
        stopPropagation: true
      })
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
          this._play()
        }
      })
    },
    _initDot() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  .slider
    position: relative
    margin: 10px 15px
    overflow: hidden
    vertical-align: top
    -webkit-box-shadow: rgba(62,57,107,0.3) 0px 6px 16px 0px
    box-shadow: rgba(62,57,107,0.3) 0px 6px 16px 0px
    border-radius: 5px
    .slider-group
      margin-bottom: -3px
      white-space: nowrap
      .slider-item
        display: inline-block
        text-align: center
        img
          display: block
          width: 100%
          max-height 135px
  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 8px
    text-align: center
    font-size: 0
    .dot
      display: inline-block
      margin: 0 4px
      width: 6px
      height: 6px
      border-radius: 50%
      background: $color-background-d
      &.active
        width: 12px
        border-radius: 5px
        background: $color-background
</style>
