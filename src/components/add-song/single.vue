<template>
  <div class="single-list">
    <loading v-if="!songs.length"></loading>
    <scroll v-else :data="songs" class="list-content">
      <div class="list-wrapper">
        <ul class="hot-search-list" v-show="showFlag==='hot-search'">
          <li class="search-item" v-for="(item, index) in songs" :key="index" @click="addQuery(item.searchWord)">
            <span class="num" :class="index < 3 ? 'special' : ''">{{index + 1}}</span>
            <div class="container">
              <div class="name">
                <span class="txt">{{item.searchWord}}</span>
                <img :src="item.iconUrl" alt="" v-show="item.iconUrl">
              </div>
              <div class="content">{{item.content}}</div>
            </div>
            <div class="score">{{item.score}}</div>
          </li>
        </ul>
        <ul class="search-result" v-show="showFlag==='search-result'">
          <li class="search-item" v-for="song in songs" :key="song.id" @click="selectItem(song)">
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
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import {getSongDetail} from 'api/axios'
import {createSong} from 'common/js/song'

export default {
  name: 'single',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      songs: [],
      showFlag: 'hot-search'
    }
  },
  methods: {
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        if (item.id) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
    selectItem(item) {
      getSongDetail({
        ids: item.id
      }).then(res => {
        if (res.code === 200) {
          this.$emit('selectItem', createSong(res.songs[0]))
        }
      })
    },
    addQuery(keywords) {
      this.$emit('addQuery', keywords)
    }
  },
  watch: {
    data(newVal) {
      this.showFlag = newVal.songList[0]['searchWord'] ? 'hot-search' : 'search-result'
      this.songs = this.showFlag === 'hot-search' ? newVal.songList : this._normalizeSongs(newVal.songList)
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
  .list-content
    margin 0 20px
  .hot-search-list .search-item
    position relative
    margin 20px 0 0 5px
    display flex
    justify-content space-between
    align-items center
    .num
      flex 0 30px
      font-size $font-size-medium
      color $color-text-m
      &.special
        color red
    .container
      flex 1
      display flex
      flex-direction column
      justify-content space-between
      height 35px
      .name
        font-size $font-size-medium
        .txt
          margin-right 10px
        img
          width auto
          height 12px
      .content
        font-size $font-size-small-s
        color $color-text-l
    .score
      flex 0 60px
      text-align right
      font-size $font-size-small
      color $color-text-l
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
