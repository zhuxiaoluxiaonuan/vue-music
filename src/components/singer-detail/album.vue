<template>
  <div class="album-list">
    <loading v-if="!albums.length"></loading>
    <ul v-else>
      <li v-for="item in albums" :key="item.id">
        <div class="img">
          <img v-lazy="item.picUrl" alt="">
          <div class="msk"></div>
        </div>
        <div class="desc">
          <div class="name">{{item.name}}</div>
          <div class="sub-desc">
            <span class="time">{{item.publishTime | getTime}}</span>
            <span class="size">{{item.size}}首</span>
          </div>
        </div>
        <div class="play">
          <i class="extend-you-"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {getSingerAlbum} from 'api/axios'
import Loading from 'base/loading/loading'
export default {
  name: 'album',
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      singer: this.data.singer,
      albums: []
    }
  },
  methods: {
    fetch() {
      return getSingerAlbum({
        id: this.singer.id,
        limit: 30
      }).then(res => {
        if (res.code === 200) {
          this.albums = res.hotAlbums
        }
      })
    }
  },
  filters: {
    'getTime': val => {
      let fullDate = new Date(val)
      return `${fullDate.getFullYear()}.${fullDate.getMonth() + 1}.${fullDate.getDate()}`
    }
  },
  components: {
    Loading
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.album-list
  padding 10px 14px
  background-color $color-background-l
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
        background url('./album-img/digital-album.svg') no-repeat
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
