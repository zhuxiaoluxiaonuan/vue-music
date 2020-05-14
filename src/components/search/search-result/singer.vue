<template>
  <div class="singer-list">
    <loading v-if="!artists.length"></loading>
    <scroll v-else :data="artists">
      <ul>
        <li class="list-group-item" v-for="item in artists" :key="item.id" @click="selectItem(item)">
          <img v-lazy="item.picUrl" alt="">
          <div class="desc">
            <div class="name">
              {{item.name}}
              <span v-show="item.alias.length">({{item.alias[0]}})</span>
            </div>
            <div class="size">
              <div class="music-size" v-show="item.musicSize">歌曲：{{item.musicSize}}</div>
              <div class="album-size">专辑：{{item.albumSize}}</div>
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
import Singer from 'common/js/singer'
const SIZE = 20

export default {
  name: 'singer',
  data() {
    return {
      artists: [],
      artistCount: 0,
      page: 1
    }
  },
  methods: {
    fetch(keywords) {
      getSearchResult({
        keywords,
        type: 100,
        limit: SIZE,
        offset: this.page - 1
      }).then(res => {
        if (res.code === 200) {
          this.artists = this.handleSinger(res.result.artists)
          this.artistCount = res.result.artistCount
        }
      })
    },
    handleSinger(artists) {
      let res = []
      artists.forEach(item => {
        res.push(new Singer({
          id: item.id,
          name: item.name,
          picUrl: item.img1v1Url,
          alias: item.alias,
          musicSize: item.musicSize,
          albumSize: item.albumSize,
          topicPerson: item.topicPerson
        }))
      })
      return res
    },
    selectItem(item) {
      this.$emit('selectItem', {type: 'singer', item})
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
  .singer-list
    position relative
    height 100%
    ul
      .list-group-item
        display flex
        align-items center
        justify-content left
        height 80px
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
</style>
