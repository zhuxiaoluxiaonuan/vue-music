<template>
  <transition name="list-fade">
    <div class="playlist-view" v-show="visible" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeTxt}}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content">
          <transition-group ref="list" name="list" tag="ul">
            <li class="item"
                v-for="(item, index) in sequenceList"
                :key="item.id"
                ref="listItem"
                @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text" :class="getCurrentClass(item)">{{item.name}}</span>
              <span class="like">
                  <i></i>
                </span>
              <span class="delete" @click.stop="deleteOne(item)">
                  <i class="icon-delete"></i>
            </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm
        ref="confirm"
        @confirm="confirmClear"
        text="是否清空播放列表"
        confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import {mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import {playMode} from 'common/js/config'
import {playerMixin} from 'common/js/mixin'
import Confirm from 'base/confirm/confirm'
import AddSong from 'components/add-song/add-song'

export default {
  name: 'playlist-view',
  mixins: [playerMixin],
  data() {
    return {
      visible: false
    }
  },
  methods: {
    show() {
      this.visible = true
      // 重新刷新scroll
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide() {
      this.visible = false
    },
    getCurrentIcon(item) {
      return item.id === this.currentSong.id ? 'icon-play' : ''
    },
    getCurrentClass(item) {
      return item.id === this.currentSong.id ? 'active' : ''
    },
    scrollToCurrent(song) {
      // 找到sequenceList中对应歌曲的index
      let index = this.sequenceList.findIndex(item => item.id === song.id)
      if (index > 3) {
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index - 3], 300)
      }
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex(song => item.id === song.id)
      }
      this.setCurrentIndex(index)
      // 设置播放状态
      this.setPlaying(true)
    },
    deleteOne(item) {
      this.deleteSong(item)
      if (!this.playList.length) {
        this.hide()
      }
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    confirmClear() {
      this.deleteSongList()
      this.hide()
    },
    addSong() {
      this.$refs.addSong.show()
    },
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  watch: {
    currentSong(newVal, oldVal) {
      // 当列表未展开，或者currentSong为发生改变，则直接退出
      if (!this.visible || newVal.id === oldVal.id) {
        return
      }
      setTimeout(() => {
        this.scrollToCurrent(newVal)
      }, 20)
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.playlist-view
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  z-index 200
  background-color $color-text-l
  &.list-fade-enter-active, &.list-fade-leave-active
    transition opacity 0.3s
    .list-wrapper
      transition all 0.3s
  &.list-fade-enter, &.list-fade-leave-to
    opacity 0
    .list-wrapper
      transform translate3d(0, 100%, 0)
  &.list-fade-enter
  .list-wrapper
    position absolute
    left 0
    bottom 0
    width 100%
    border-radius 15px 15px 0 0
    background-color $color-background
    .list-header
      position relative
      padding 20px
      .title
        display flex
        align-items center
        .icon
          margin-right 10px
          font-size $font-size-medium-x
          color $color-text
        .text
          flex 1
          font-size $font-size-small
          color $color-text-ll
        .clear
          extend-click()
          .icon-clear
            font-size $font-size-medium
            color $color-text-d
    .list-content
      max-height 300px
      overflow hidden
      .item
        display flex
        align-items center
        height 40px
        padding 0 20px
        overflow hidden
        &.list-enter-active, &.list-leave-active
          transition all 0.1s
        &.list-enter, &.list-leave-to
          height 0
        .current
          flex 0 0 20px
          width 20px
          font-size $font-size-small
          color $color-text-ll
        .text
          flex 1
          no-wrap()
          font-size $font-size-medium
          color $color-text-l
          &.active
            color $color-text-ll
        .like
          extend-click()
          margin-right 15px
          font-size $font-size-small
          color $color-theme
          .icon-favorite
            color $color-sub-theme
        .delete
          extend-click()
          font-size $font-size-small-s
          color $color-text-l
    .list-operate
      width 140px
      margin 20px auto
      .add
        display flex
        align-items center
        padding 8px 16px
        border 1px solid $color-text-l
        border-radius 100px
        color $color-text-l
        .icon-add
          margin-right 5px
          font-size $font-size-small-s
        .text
          font-size $font-size-small
    .list-close
      text-align center
      line-height 50px
      background $color-background
      border-top 1px solid #f5f5f5
      font-size $font-size-medium
      color $color-text-ll
</style>
