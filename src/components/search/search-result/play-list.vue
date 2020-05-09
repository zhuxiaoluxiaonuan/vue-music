<template>
  <div class="play-list">
    <loading v-if="!playlists.length"></loading>
    <scroll v-else>
      <ul>
        <li v-for="item in playlists" :key="item.id">
          <div class="img">
            <img v-lazy="item.coverImgUrl" alt="">
          </div>
          <div class="desc">
            <div class="name">{{item.name}}</div>
            <div class="sub-desc">
              <span class="total">{{item.trackCount}}</span>
              by
              <span class="play-count">{{item.creator.nickname}}，播放{{item.playCount | handleNum}}次</span>
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
const SIZE = 20

export default {
  name: 'play-list',
  data() {
    return {
      playlists: [],
      playlistCount: 0,
      page: 1
    }
  },
  methods: {
    fetch(keywords) {
      getSearchResult({
        keywords,
        type: 1000,
        limit: SIZE,
        offset: this.page - 1
      }).then(res => {
        if (res.code === 200) {
          this.playlists = res.result.playlists
          this.playlistCount = res.result.playlistCount
        }
      })
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
  .play-list
    position relative
    height 100%
    ul li
      display flex
      align-items center
      margin 20px 0
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
</style>
