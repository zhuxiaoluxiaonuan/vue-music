<template>
  <transition name="fade">
    <div class="play-list-cover" v-show="visible" :style="{ backgroundImage: `url(${coverUrlBlur})` }">
      <div class="close" @click="closePage">&#10005;</div>
      <loading v-if="!disc"></loading>
      <scroll v-else class="container-wrapper">
        <div class="container">
          <div class="center">
            <img :src="picture" alt="">
            <div class="playlist-name">{{title}}</div>
          </div>
          <div class="division">
            <img src="./line.png" alt="">
          </div>
          <div class="introduce">
            <div class="tag">
              <label v-for="(tag, index) in tags" :key="index">{{tag}}</label>
            </div>
            <div class="brief">{{brief}}</div>
          </div>
        </div>
      </scroll>
      <div class="bottom">
        <div class="save-button" @click.stop="downloadByBlob(picture, `${title}`)">保存封面</div>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {mapGetters} from 'vuex'
import {imgToBlob, downloadByBlob} from 'common/js/util'
import {color} from 'common/js/background-color'

export default {
  name: 'play-list-cover',
  props: {
    brief: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default() {
        return []
      }
    },
    topList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      coverUrlBlur: color.black,
      visible: false,
      downloadByBlob
    }
  },
  created() {
    this._initPage()
  },
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    _initPage() {
      imgToBlob(this.picture + '?imageView=1&thumbnail=225x0', blur => { this.coverUrlBlur = blur }, 100, -0.1)
    },
    closePage() {
      this.hide()
    }
  },
  computed: {
    title() {
      return this.disc.name
    },
    picture() {
      if (this.topList) return this.disc.tracks[0].al.picUrl
      return this.disc.picUrl || this.disc.coverImgUrl // 重点注意：当从推荐页进入此页面时，取的是picUrl的值，反之，当点击了相似歌单，再次进入此页面时，取的是coverImgUrl中的值
    },
    ...mapGetters(['disc'])
  },
  components: {
    Loading,
    Scroll
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.play-list-cover
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background no-repeat 50%/cover
  opacity 1
  z-index 100
  .close
    position absolute
    top 20px
    right 20px
    font-size $font-size-large
    color $color-background
    z-index 2
  .container-wrapper
    position absolute
    top 0
    left 0
    right 0
    bottom 60px
    height auto
    .container
      margin 0 30px
      .center
        padding 70px 0 10px 0
        margin 0 auto
        width 220px
        img
          width 100%
          height 220px
          border-radius 5px

        .playlist-name
          margin-top 20px
          line-height 20px
          text-align center
          font-weight 700
          color $color-background
          font-size $font-size-medium
      .division img
        width 100%
      .introduce
        margin-top 10px
        .tag
          display flex
          justify-content center
          align-content center
          label
            padding 0 10px
            margin 0 5px
            height 22px
            line-height 22px
            background-color $color-background-s
            border-radius 10px
            font-size $font-size-small-s
            color $color-background-ll
        .brief
          margin-top 15px
          line-height 20px
          text-align center
          white-space pre-wrap
          font-size $font-size-small
          color $color-background
  .bottom
    position absolute
    left 50%
    bottom 20px
    margin-left -35px
    font-size $font-size-large
    color $color-background
    .save-button
      width 70px
      height 25px
      line-height 25px
      text-align center
      font-size $font-size-small-s
      border 1px solid $color-background-l
      border-radius 20px
  &.fade-enter-active, &.fade-leave-active
    transition: all 0.4s
  &.fade-enter, &.fade-leave-to
    opacity 0
</style>
