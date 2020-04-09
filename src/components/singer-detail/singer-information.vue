<template>
  <transition name="fade">
    <div class="singer-information" v-show="visible">
      <div class="header">
        <div class="top">
        <span class="back" @click="back">
          <i class="extend-fanhui"></i>
        </span>
          歌手详情
        </div>
        <div class="avatar">
          <img v-lazy="singer.picUrl" alt="">
          <div class="name">{{singer.name}}</div>
        </div>
        <div class="msk"></div>
        <div class="filter" :style="byStyle"></div>
      </div>
      <scroll :data="getBaseData" class="info-wrapper">
        <div class="container">
          <div class="information-item" v-for="(info, index) in getBaseData" :key="index">
            <div class="title">{{info.ti}}</div>
            <div class="desc">{{info.txt}}</div>
          </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll'
export default {
  name: 'singer-information',
  props: {
    singer: {
      type: Object,
      default: null
    },
    baseData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      information: [],
      visible: false
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    back() {
      this.hide()
    }
  },
  computed: {
    getBaseData() {
      let briefDesc = {
        ti: '歌手简介',
        txt: this.baseData.briefDesc
      }
      let arr = [briefDesc]
      arr.push(...this.baseData.introduction)
      return arr
    },
    byStyle() {
      return `background-image: url(${this.singer.picUrl})`
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.singer-information
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  background-color $color-background
  opacity 1
  .header
    position fixed
    top 0
    left 0
    width 100%
    overflow hidden
    color $color-background
    .top, .avatar
      margin 0 14px
    .top
      height 50px
      line-height 50px
      text-align center
      .back
        display float
        float left
        font-size $font-size-large
        color $color-background
    .avatar
      display flex
      align-items center
      height 100px
      img
        width 60px
        height 60px
        border-radius 50%
        box-shadow $color-background-d 0px 2px 6px 0px
      .name
        margin-left 20px
        font-size $font-size-medium-x
        font-weight 800
        color $color-background
    .filter, .msk
      position absolute
      top 0
      left 0
      width 100%
      height 100%
    .msk
      background-color $color-text-s
      z-index -1
    .filter
      filter blur(7px)
      transform scale(1.2)
      z-index -2
  .info-wrapper
    position absolute
    top 150px
    left 0
    bottom 0
    width 100%
    height auto
    .container
      padding 10px 14px
      background-color $color-background
      .information-item
        margin-bottom 20px
        .title
          margin-bottom 10px
          font-size $font-size-medium
          font-weight 800
          color $color-text
        .desc
          line-height 25px
          white-space pre-wrap
          font-size $font-size-small
          color $color-text-l
  &.fade-enter-active, &.fade-leave-active
    transition: all 0.4s
  &.fade-enter, &.fade-leave-to
    opacity 0
</style>
