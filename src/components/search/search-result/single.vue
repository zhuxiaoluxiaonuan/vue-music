<template>
  <div class="single-list">
    <loading v-if="!songs.length"></loading>
    <scroll v-else>
      <ul>
        <li v-for="song in songs" :key="song.id">
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
    </scroll>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import {getSearchResult} from 'api/axios'
import {createSong} from 'common/js/song'
const SIZE = 20

export default {
  name: 'single',
  data() {
    return {
      songs: [],
      songCount: 0,
      page: 1
    }
  },
  methods: {
    fetch(keywords) {
      getSearchResult({
        keywords,
        type: 1,
        limit: SIZE,
        offset: this.page - 1
      }).then(res => {
        if (res.code === 200) {
          this.songs = this._normalizeSongs(res.result.songs)
          this.songCount = res.result.songCount
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        if (item.id) {
          ret.push(createSong(item))
        }
      })
      return ret
    }
  },
  components: {
    Loading,
    Scroll
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable.styl'
.single-list
  position relative
  height 100%
  ul li
    position relative
    margin-bottom 25px
  .container
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
