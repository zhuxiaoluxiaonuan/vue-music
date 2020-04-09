<template>
 <div class="container">
   <div class="dots" ref="dots">
     <span class="dot" v-for='(dot, index) in dots' :key="index"></span>
   </div>
   <div class="list-swiper" ref="listSwiper">
     <div class="swiper-group" ref="swiperGroup">
       <slot></slot>
     </div>
   </div>
 </div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass, removeClass } from 'common/js/dom'
export default {
  name: 'list-swiper',
  data() {
    return {
      dots: []
    }
  },
  mounted () {
    setTimeout(() => {
      this._setClass()
      this._initDots()
      this._initSwiper()
      this.$nextTick(() => {
        addClass(this.$refs.dots.children[0], 'active')
      })
    }, 20)
  },
  methods: {
    _setClass () {
      this.children = this.$refs.swiperGroup.children
      let width = 0
      let parentWidth = this.$refs.listSwiper.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i]
        child.style.width = parentWidth - 19 + 'px'
        width += parentWidth
      }
      this.$refs.swiperGroup.style.width = width + 'px'
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _initSwiper () {
      this.swiper = new BScroll(this.$refs.listSwiper, {
        scrollX: true,
        momentum: false,
        snap: {
          loop: false,
          threshold: 0.3,
          speed: 400
        },
        bounce: {
          right: true
        },
        stopPropagation: true,
        eventPassthrough: 'vertical'
      })
      this.swiper.on('scrollEnd', () => {
        let pageIndex = this.swiper.getCurrentPage().pageX
        let childrenArr = this.$refs.dots.children
        for (let i = 0; i < childrenArr.length; i++) {
          if (i === pageIndex) {
            addClass(childrenArr[i], 'active')
          } else {
            removeClass(childrenArr[i], 'active')
          }
        }
      })
    }
  }
}
</script>

  <style scoped lang="stylus">
  @import "~common/stylus/variable"
  .container
    .dots
      margin 0 0 5px 2px
      width 100%
      line-height 2px;
      .dot
        display inline-block
        margin-right 10px
        width 12px
        height 2px
        background $color-text-s
        &.active
          background $color-theme
    .list-swiper
      position: relative
      overflow: hidden
      .swiper-group
        white-space: nowrap
        ul
          margin-right: 20px
          position: relative
          display: inline-block
          li
            position: relative
            margin-right -14px
            padding 10px 14px 10px 0
            display flex
            align-items center
            height 65px
            &:first-child
              margin-top: 0
            &:hover .mark
              width: 100%
              opacity: 1
            .mark
              position: absolute
              top: 10px
              left: 0
              width: 80%
              height: 76%
              background-color: $color-hover
              transition: 0.15s ease
              opacity: 0
              border-radius: 5px
            .icon
              flex: 0 0 60px
              width: 60px
              padding-right: 20px
              img
                position: relative
                width 65px
                border-radius 5px
                vertical-align: middle
                z-index 2
                box-shadow rgba(0,0,0,0.04) 5px 5px 0px 0px
            .text
              display: flex
              flex-direction: column
              justify-content: center
              flex: 1
              line-height: 20px
              overflow: hidden
              font-size: $font-size-medium
              .name
                margin-bottom: 10px
                color: $color-text
              .singer
                color: $color-text-d
            .icon-right
              color: $color-theme
              font-size: $font-size-large-x
</style>
