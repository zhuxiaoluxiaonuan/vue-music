<template>
  <div class="album-list">
    <loading v-if="!albums.length"></loading>
    <scroll v-else :data="albums">
      <ul>
        <li v-for="item in albums" :key="item.id">
          <div class="img">
            <img v-lazy="item.picUrl" alt="">
            <div class="msk"></div>
          </div>
          <div class="desc">
            <div class="name">{{item.name}}</div>
            <div class="sub-desc">
              <span class="time">{{item.publishTime | formatDate}}</span>
              <span class="size">{{item.size}}首</span>
            </div>
          </div>
          <div class="play">
            <i class="extend-you-"></i>
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
  name: 'album',
  data() {
    return {
      albums: [],
      albumCount: 0,
      page: 1
    }
  },
  methods: {
    fetch(keywords) {
      getSearchResult({
        keywords,
        type: 10,
        limit: SIZE,
        offset: this.page - 1
      }).then(res => {
        if (res.code === 200) {
          this.albums = res.result.albums
          this.albumCount = res.result.albumCount
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
  .album-list
    position relative
    height 100%
  ul li
    position relative
    margin 15px 0
    display flex
    align-items center
    .img
      position relative
      width 60px
      height 60px
      img
        width 100%
        height 100%
      .msk
        position absolute
        top 0
        left 0
        width 75px
        height 60px
        background url('./digital-album.svg') no-repeat
        background-position 60px 0
    .desc
      flex 1
      margin 0 35px
      overflow hidden
      .name
        margin-bottom 10px
        color $color-text
        font-size $font-size-medium-x
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
      .sub-desc
        color $color-text-l
        font-size $font-size-small
        .time
          margin-right 5px
    .play
      position absolute
      right 0
      color $color-theme
      font-size $font-size-large
</style>
