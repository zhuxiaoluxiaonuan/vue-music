<template>
  <div class="song-list" ref="songList">
    <loading v-if="!hotSongs.length"></loading>
    <div v-else>
      <div class="play-all" @click="playAll">
        <i class="icon icon-play"></i>
        <span class="text">全部播放</span>
        <span class="num">{{hotSongs.length}}</span>
      </div>
      <div class="list" v-for="(song, index) in hotSongs" :key="song.id" @click="selectItem(song, index)">
        <div :class="getRankCls(index)">{{getRankTxt(index)}}</div>
        <div class="container">
          <div class="song-name">{{song.name}}</div>
          <div class="desc">
            <div class="label" v-show="song.fee !== 0">独家</div>
            <div class="super-quality" v-show="song.privilege && (!song.privilege.dl || song.privilege.pl !== song.privilege.dl)">SQ</div>
            <span class="singer">{{song.singer}}</span>-
            <span class="album">{{song.album}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getSingerDetail} from 'api/axios'
import {createSong} from 'common/js/song'
import Loading from 'base/loading/loading'
import {mapMutations, mapActions} from 'vuex'

export default {
  name: 'song-list',
  props: {
    data: {
      type: Object,
      default: null
    },
    singleHeight: {
      type: Number,
      default: 0
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      singer: this.data.singer,
      hotSongs: [],
      minHeight: 0
    }
  },
  methods: {
    fetch() {
      if (!this.data.songList) { // 如果data中没有传递歌曲列表，则需要请求数据
        return getSingerDetail({
          id: this.singer.id
        }).then(res => {
          if (res.code === 200) {
            this.hotSongs = this._normalizeSongs(res.hotSongs)
            this.setHotSongs(this.hotSongs.slice(0, 3))
          }
        })
      } else {
        this.hotSongs = this._normalizeSongs(this.data.songList)
        this.setHotSongs(this.hotSongs.slice(0, 3))
        return Promise.resolve()
      }
    },
    _normalizeSongs(hotSongs) {
      let ret = []
      hotSongs.forEach(music => {
        if (music.id) {
          ret.push(createSong(music))
        }
      })
      return ret
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.hotSongs,
        index: index
      })
    },
    playAll() {
      this.randomPlay({
        list: this.hotSongs
      })
    },
    getRankCls(index) {
      if (this.rank) {
        if (index <= 2) {
          return `bg bg-${index + 1}`
        }
        return 'serial-num'
      }
      return 'serial-num'
    },
    getRankTxt(index) {
      if (this.rank && index > 2) {
        return index + 1
      } else if (!this.rank) {
        return index + 1
      }
    },
    ...mapMutations({
      'setHotSongs': 'SET_HOTSONGS'
    }),
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    singleHeight(newVal) {
      this.$refs.songList.style.minHeight = newVal + 'px'
    }
  },
  components: {
    Loading
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.song-list
  position relative
  padding 10px 14px
  background-color $color-background
  overflow hidden
  .play-all
    margin-top 20px
    display flex
    align-items center
    i
      margin-right 15px
      font-size $font-size-large-x
      color $color-theme
    span
      color $color-text-l
    .num
      margin-left 5px
      font-size $font-size-small
  .list
    position relative
    margin 25px 0
    .bg
      position absolute
      left 0
      top 50%
      margin-top -8px
      width 16px
      height 16px
      background-size 16px 16px
      &.bg-1
        background-image url("./album-img/first.png")
      &.bg-2
        background-image url("./album-img/second.png")
      &.bg-3
        background-image url("./album-img/third.png")
    .serial-num
      position absolute
      left 0
      top 50%
      margin-top -8px
      width 17px
      text-align center
      color $color-text-ll
    .container
      margin-left 35px
      display flex
      flex-direction column
      justify-content center
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
