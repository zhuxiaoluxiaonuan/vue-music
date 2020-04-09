<template>
  <div class="rank-swiper" ref="rankSwiper">
    <div class="swiper-group" ref="swiperGroup">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'rank-swiper',
  mounted () {
    setTimeout(() => {
      this._setClass()
      this._initSwiper()
    }, 20)
  },
  data() {
    return {
      rankType: 0
    }
  },
  methods: {
    _setClass () {
      this.children = this.$refs.swiperGroup.children
      let width = 0
      let parentWidth = this.$refs.rankSwiper.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i]
        child.style.width = parentWidth + 'px'
        width += parentWidth
      }
      this.$refs.swiperGroup.style.width = width + 'px'
    },
    _initSwiper () {
      this.swiper = new BScroll(this.$refs.rankSwiper, {
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
        const pageIndex = this.swiper.getCurrentPage().pageX
        this.$emit('setRankType', pageIndex)
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  .rank-swiper
    position: relative
    overflow: hidden
    .swiper-group
      white-space: nowrap
      touch-action: none
      ul
        position: relative
        display: inline-block
        width 100%
        li
          padding 10px 0 10px 12px
          box-sizing border-box
          position: relative
          display flex
          flex-direction column
          justify-content space-around
          height 100px
          background-color rgba(0, 0, 0, 0.03)
          border-radius 5px
          .name
            margin-bottom 5px
            color $color-text
            font-size $font-size-medium
          .data
            .num, .songName
              font-size $font-size-small-s
              color $color-text-ll
            .singer
              font-size $font-size-small-s
              color $color-text-l
          .pic
            position absolute
            top 0
            right 0
            width 100px
            height 100px
            img
              width 100%
              height 100%
              border-radius 0 5px 5px 0
            .icon
              position absolute
              bottom 5px
              right 5px
              i
                font-size $font-size-large-x
                font-weight 800
                color $color-background-ll
</style>
