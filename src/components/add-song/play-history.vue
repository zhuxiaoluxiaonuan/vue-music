<template>
  <div class="play-history" @click.stop>
    <div class="title">
      <div class="left">
        <i class="icon-play"></i>
        <span class="text" @click="playAll">播放全部(共{{playHistory.length}}首)</span>
      </div>
      <div class="right">
        <i class="icon-clear" @click="deleteAll"></i>
      </div>
    </div>
    <div class="no-history" v-if="!playHistory.length">暂无播放记录</div>
    <scroll v-else :data="playHistory" class="list-content">
      <div class="list-wrapper">
        <ul class="search-result">
          <li class="search-item" v-for="song in playHistory" :key="song.id" @click="selectItem(song)">
            <div class="song-name">{{song.name}}</div>
            <div class="desc">
              <div class="label" v-show="song.fee !== 0">独家</div>
              <div class="super-quality" v-show="song.privilege && (!song.privilege.dl || song.privilege.pl !== song.privilege.dl)">SQ</div>
              <span class="singer">{{song.singer}}</span>-
              <span class="album">{{song.album}}</span>
            </div>
          </li>
        </ul>
      </div>
    </scroll>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Scroll from 'base/scroll/scroll'
import Song from 'common/js/song'

export default {
  name: 'play-history',
  methods: {
    selectItem(item) {
      // 一定要注意把item装换为Song的实例，否则无法调取getLyric方法
      this.$emit('selectItem', new Song(item))
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
    playAll() {
      this.$emit('playAll', this._normalizeSongs(this.playHistory))
    },
    deleteAll() {
      this.$emit('clearPlayHistory')
    }
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable.styl'
  .play-history
    position relative
    height 100%
    .title
      margin 0 20px 20px 20px
      display flex
      justify-content space-between
      align-items center
      font-size $font-size-medium
      .left
        display flex
        align-items center
        i
          margin-right 10px
          font-size $font-size-large
      .right i
        font-size $font-size-medium
    .no-history
      height 60px
      line-height 60px
      text-align center
      font-size $font-size-medium
      color $color-text-d
    .list-content
      position absolute
      top 40px
      left 20px
      right 20px
      bottom 0
      height auto
      .search-result .search-item
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
</style>
