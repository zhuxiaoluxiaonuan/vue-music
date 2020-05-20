<template>
  <transition name="up">
    <div class="my-like" v-if="visible" @click.stop>
      <div class="header">
        我喜欢
        <i class="extend-fanhui" @click="hide"></i>
      </div>
      <cube-tab-bar v-model="selectedLabel"
                    show-slider
                    :use-transition="disabled"
                    ref="tabNav"
                    :data="tabLabels">
      </cube-tab-bar>
      <div class="tab-slide-container">
        <cube-slide
          ref="slide"
          :loop="loop"
          :initial-index="index"
          :auto-play="autoPlay"
          :show-dots="showDots"
          :options="slideOptions"
          @scroll="scroll"
          @change="changePage"
        >
          <!-- 歌曲 -->
          <cube-slide-item>
            <cube-scroll :data="likeArr" :options="scrollOptions">
              <ul class="single-list">
                <li v-show="likeArr.length===0" class="no-data">
                  点击
                  <i class="extend-xihuan1"></i>
                  添加喜欢的歌曲到这里</li>
                <li class="list-item" v-for="song in likeArr" :key="song.id">
                  <div class="container">
                    <div class="song-name">{{song.name}}</div>
                    <div class="desc">
                      <div class="label" v-show="song.fee !== 0">独家</div>
                      <div class="super-quality" v-show="song.privilege && (!song.privilege.dl || song.privilege.pl !== song.privilege.dl)">SQ</div>
                      <span class="singer">{{song.singer}}</span>-
                      <span class="album">{{song.album}}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </cube-scroll>
          </cube-slide-item>
          <!-- 歌手 -->
          <cube-slide-item>
            <cube-scroll :data="likeArr" :options="scrollOptions">
              <ul class="singer-list">
                <li v-show="likeArr.length===0" class="no-data">
                  点击
                  <i class="extend-xihuan1"></i>
                  添加喜欢的歌手到这里</li>
                <li class="list-item" v-for="item in likeArr" :key="item.id">
                  <img v-lazy="item.picUrl" alt="">
                  <div class="desc">
                    <div class="name">
                      {{item.name}}
                      <span v-if="item.alias && item.alias.length">({{item.alias[0]}})</span>
                    </div>
                    <div class="size">
                      <div class="music-size">歌曲：{{item.musicSize}}</div>
                      <div class="album-size">专辑：{{item.albumSize}}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </cube-scroll>
          </cube-slide-item>
          <!--歌单-->
          <cube-slide-item>
            <cube-scroll :data="likeArr" :options="scrollOptions">
              <ul class="play-list">
                <li v-show="likeArr.length===0" class="no-data">
                  点击
                  <i class="extend-xihuan1"></i>
                  添加喜欢的歌单到这里</li>
                <li class="list-item" v-for="item in likeArr" :key="item.id">
                  <div class="img">
                    <img v-lazy="item.coverImgUrl" alt="">
                  </div>
                  <div class="desc">
                    <div class="name">{{item.name}}</div>
                    <div class="sub-desc">
                      <span class="total">{{item.trackCount}}</span>
                      by
                      <span class="play-count" v-if="item.creator">{{item.creator.nickname}}，播放{{item.playCount | handleNum}}次</span>
                    </div>
                  </div>
                </li>
              </ul>
            </cube-scroll>
          </cube-slide-item>
        </cube-slide>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import Song from 'common/js/song'

export default {
  name: 'my-like',
  props: {
    initialIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      visible: false,
      tabLabels: [
        {
          label: '歌曲'
        },
        {
          label: '歌手'
        },
        {
          label: '歌单'
        }
      ],
      selectedLabel: ['歌曲', '歌手', '歌单'][this.initialIndex],
      disabled: false,
      tabType: ['song', 'singer', 'playlist'],
      loop: false,
      autoPlay: false,
      showDots: false,
      slideOptions: {
        listenScroll: true,
        probeType: 3,
        directionLockThreshold: 0
      },
      scrollOptions: {
        directionLockThreshold: 0
      }
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    changePage (current) {
      this.selectedLabel = this.tabLabels[current].label
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        if (item.id) {
          ret.push(new Song(item))
        }
      })
      return ret
    },
    scroll (pos) {
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabNav.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = x / slideScrollerWidth * tabItemWidth
      this.$refs.tabNav.setSliderTransform(deltaX)
    }
  },
  computed: {
    likeArr() {
      if (!this.user.userId) {
        return []
      }
      let tempList = this.likeList[this.user.userId] ? this.likeList[this.user.userId][this.tabType[this.index]] || [] : []
      return this.index === 0 ? this._normalizeSongs(tempList) : tempList
    },
    index () {
      let tIndex = 0
      tIndex = this.tabLabels.findIndex(item => item.label === this.selectedLabel)
      return tIndex
    },
    ...mapGetters([
      'user',
      'likeList'
    ])
  },
  watch: {
    initialIndex(newVal) {
      this.selectedLabel = this.tabLabels[newVal].label
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable.styl"
.my-like
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color $color-background
  .header
    position relative
    padding 15px
    text-align center
    i
      position absolute
      top 15px
      left 14px
  .cube-tab-bar
    padding 0 14px
    border-bottom 1px solid #f5f5f5
  .cube-tab
    font-size $font-size-small
    color $color-text-d
    &.cube-tab_active
      font-size $font-size-medium
      color $color-text
  .cube-tab-bar-slider
    background-color $color-text
  .tab-slide-container
    position absolute
    top 74px
    left 0
    right 0
    bottom 0
  .no-data
    display flex
    justify-content center
    align-items center
    margin  0 auto
    height 150px
    color $color-text-l
    font-size $font-size-small
    i
      font-size $font-size-large-x
      color red
  .single-list, .singer-list, .play-list
    margin 20px 14px 0 14px
    overflow: hidden
  .single-list  .list-item
    position relative
    display flex
    flex-direction column
    justify-content center
    margin-bottom 25px
    .song-name, .album
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
    .song-name
      margin-bottom 10px
      color $color-text
      font-size $font-size-medium
    .desc
      display flex
      align-items center
      font-size $font-size-small
      color $color-text-l
      .label, .super-quality
        margin-right 5px
        height 14px
        line-height 14px
        text-align center
        color $color-theme
        font-size $font-size-small-s
        border-radius 1px
        border 1px solid $color-theme
      .label
        flex 0 0 24px
      .super-quality
        flex 0 0 18px
      .singer
        margin-left 5px
        margin-right 4px
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
      .album
        margin-left 4px
  .singer-list .list-item
    display flex
    align-items center
    justify-content left
    margin-bottom 25px
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
  .play-list .list-item
    display flex
    align-items center
    margin-bottom 25px
    height 60px
    .img
      margin-right 15px
      width 60px
      height 100%
      img
        width 100%
        height 100%
        border-radius 5px
        box-shadow rgba(0,0,0,0.04) 5px 5px 0px 0px
    .desc
      display flex
      flex-direction column
      justify-content center
      align-content space-around
      .name
        margin-bottom 10px
        font-size $font-size-medium
      .sub-desc
        display flex
        align-items center
        font-size $font-size-small-s
        color $color-text-l
        .total
          margin-right 5px
        .play-count
          margin-left 5px
&.up-enter-active, &.up-leave-active
  transition: all 0.3s
&.up-enter, &.up-leave-to
  transform: translate3d(0, 100%, 0)
</style>
