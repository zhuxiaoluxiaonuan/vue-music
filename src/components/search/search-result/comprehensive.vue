<template>
  <div class="comprehensive">
    <loading v-if="!singleList.songs"></loading>
    <scroll v-else class="scroll-box">
      <div class="scroll-wrapper">
        <div class="single-list">
          <div class="title">单曲</div>
          <ul>
            <li v-for="song in singleList.songs" :key="song.id">
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
          <div class="lookMore">
            <span>{{singleList.moreText}}</span>
            <i class="extend-you-"></i>
          </div>
        </div>
        <div class="play-list">
          <div class="title">歌单</div>
          <ul>
            <li v-for="item in playList.playLists" :key="item.id">
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
          <div class="lookMore">
            <span>{{playList.moreText}}</span>
            <i class="extend-you-"></i>
          </div>
        </div>
        <div class="simi-search">
          <div class="title">相似搜索</div>
          <ul>
            <li v-for="item in sim_query.sim_querys" :key="item.keyword">{{item.keyword}}</li>
          </ul>
        </div>
        <div class="album-list">
          <div class="title">专辑</div>
          <ul>
            <li v-for="item in albumList.albums" :key="item.id">
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
          <div class="lookMore">
            <span>{{albumList.moreText}}</span>
            <i class="extend-you-"></i>
          </div>
        </div>
        <div class="singer-list">
          <div class="title">歌手</div>
          <ul>
            <li class="list-group-item" v-for="item in singerList.artists" :key="item.id">
              <img v-lazy="item.picUrl" alt="">
              <div class="desc">
                <div class="name">
                  {{item.name}}
                  <span v-show="item.alias.length">({{item.alias[0]}})</span>
                </div>
                <div class="size">
                  <div class="music-size">歌曲：{{item.musicSize}}</div>
                  <div class="album-size">专辑：{{item.albumSize}}</div>
                </div>
              </div>
            </li>
          </ul>
          <div class="lookMore">
            <span>{{singerList.moreText}}</span>
            <i class="extend-you-"></i>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import {getSearchResult} from 'api/axios'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

export default {
  name: 'comprehensive',
  data() {
    return {
      singleList: [],
      playList: [],
      sim_query: [],
      albumList: [],
      singerList: []
    }
  },
  methods: {
    fetch(keywords) {
      getSearchResult({
        keywords,
        type: 1018
      }).then(res => {
        if (res.code === 200) {
          let result = res.result
          this.singleList = result.song
          this.singleList.songs = this._normalizeSongs(result.song.songs)
          this.playList = result.playList
          this.albumList = result.album
          this.sim_query = result.sim_query
          this.singerList = result.artist
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
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.comprehensive
  position relative
  height 100%
  .title
    margin-bottom 20px
    font-size $font-size-medium-x
    font-weight 800
  .lookMore
    display flex
    justify-content center
    align-items center
    color $color-text-m
    font-size $font-size-small
    i
      margin-left 5px
      color $color-text-s
  .scroll-box
    .scroll-wrapper
      padding-bottom 20px
      .single-list, .play-list, .simi-search, .album-list
        margin-bottom 30px
      .single-list
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
      .play-list ul li
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
      .simi-search ul
        display flex
        flex-wrap wrap
        li
          margin 0 10px 10px 0
          padding 10px
          text-align center
          font-size $font-size-small
          background-color #f5f5f5
          color $color-text
          border-radius 20px
      .album-list ul li
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
      .singer-list ul
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
