<template>
  <div class="rank" ref="rank">
    <loading v-if="rankList.length === 0"></loading>
    <scroll v-else ref="scroll">
      <div class="container">
        <div class="rank-list" v-if="rankList.length > 0">
          <ul>
            <li v-for="item in rankList" :key="item.playlist.id" @click="selectItem(item.playlist)">
              <div class="name">{{item.playlist.name}}</div>
              <div class="data" v-for="(song, index) in item.playlist.tracks.slice(0, 3)" :key="index">
                <span class="num">{{index + 1}}</span>
                <span class="songName">{{song.name}}</span>
                <span>&nbsp;-&nbsp;</span>
                <span class="singer">{{song.ar | getSinger}}</span>
              </div>
              <div class="pic">
                <img v-lazy="item.playlist.tracks[0].al.picUrl">
                <div class="mask"></div>
                <div class="label">{{item.playlist.updateTime | formatDate}}</div>
                <div class="icon">
                  <div class="play-count">
                    <i class="extend-bofangliang-"></i>
                    <span>{{item.playlist.playCount | handleNum}}</span>
                  </div>
                  <div class="play">
                    <i class="icon-play"></i>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="characteristic-rank" v-if="characteristicRank.length > 0">
          <div class="title">特色榜</div>
          <ul class="play-list">
            <li class="list-item" v-for="item in characteristicRank" :key="item.id" @click="selectItem(item)">
              <div class="item-img">
                <img v-lazy="item.coverImgUrl" alt="">
                <div class="label">{{item.updateTime | formatDate}}</div>
                <div class="icon">
                  <div class="play-count">
                    <i class="extend-bofangliang-"></i>
                    <span>{{item.playCount | handleNum}}</span>
                  </div>
                  <div class="play">
                    <i class="icon-play"></i>
                  </div>
                </div>
              </div>
              <div class="item-introduce">
                <div class="update">
                  <span class="updateFrequency">{{item.updateFrequency}}</span>
                </div>
                <div class="name">{{item.name}}</div>
                <div class="desc">{{item.description}}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="global-rank" v-if="globalRank.length > 0">
          <div class="title">全球榜</div>
          <ul class="play-list">
            <li class="list-item" v-for="item in globalRank" :key="item.id" @click="selectItem(item)">
              <div class="item-img">
                <img v-lazy="item.coverImgUrl" alt="">
                <div class="label">{{item.updateTime | formatDate}}</div>
                <div class="icon">
                  <div class="play-count">
                    <i class="extend-bofangliang-"></i>
                    <span>{{item.playCount | handleNum}}</span>
                  </div>
                  <div class="play">
                    <i class="icon-play"></i>
                  </div>
                </div>
              </div>
              <div class="item-introduce">
                <div class="update">
                  <span class="updateFrequency">{{item.updateFrequency}}</span>
                </div>
                <div class="name">{{item.name}}</div>
                <div class="desc">{{item.description}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {getTopList, getRecommendSongRank} from 'api/axios'
import {all} from 'api/common'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  name: 'rank',
  mixins: [playListMixin],
  data() {
    return {
      topList: [],
      rankName: ['云音乐新歌榜', '云音乐热歌榜', '网易原创歌曲榜', '云音乐飙升榜', '云音乐电音榜', 'UK排行榜周榜', '美国Billboard周榜', 'KTV唛榜', 'iTunes榜', 'Hit FM Top榜', '日本Oricon周榜', '法国 NRJ EuroHot 30周榜', '台湾Hito排行榜', 'Beatport全球电子舞曲榜', '云音乐ACG音乐榜', '云音乐说唱榜', '云音乐古典音乐榜', '云音乐电音榜', '抖音排行榜', '新声榜', '云音乐韩语榜', '英国Q杂志中文版周榜', '电竞音乐榜', '云音乐欧美热歌榜', '云音乐欧美新歌榜'],
      rankNameObj: {},
      rankList: []
    }
  },
  created() {
    this._rankName()
    this._getData()
  },
  methods: {
    handlePlayList(playList) {
      if (!this.$refs.scroll) return
      const bottom = playList.length > 0 ? '45px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getData() {
      let reqList = []
      for (let i = 0; i < 5; i++) {
        reqList.push(getRecommendSongRank({
          idx: i === 4 ? 25 : i
        }))
      }
      all(reqList).then(res => {
        this.rankList = res
      }).then(() => {
        getTopList().then(res => {
          if (res.code === 200) {
            this.topList = res.list
          }
        })
      })
    },
    _rankName() {
      let step = 0
      for (let i = 0; i < 25; i++) {
        if (i === 11) {
          step += 8
        }
        this.rankNameObj[this.rankName[i]] = step
        step += 1
      }
    },
    selectItem(item) {
      this.$router.push({path: `/rank/${item.id}`})
      item['rankType'] = this.rankNameObj[item.name]
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  computed: {
    characteristicRank() {
      if (this.topList.length === 0) return []
      let res = []
      res.push(this.topList[6], this.topList[7], this.topList[8], this.topList[9], this.topList[13], this.topList[17])
      return res
    },
    globalRank() {
      if (this.topList.length === 0) return []
      let res = []
      res.push(this.topList[12], this.topList[14], this.topList[15], this.topList[16], this.topList[18], this.topList[19], this.topList[20], this.topList[21], this.topList[22], this.topList[23], this.topList[24], this.topList[10])
      return res
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
  .rank
    position fixed
    top 95px
    left 14px
    right 14px
    bottom 0
    .title
      margin-bottom 15px
      font-size $font-size-medium-x
      font-weight 800
    .rank-list
      ul
        position: relative
        display: inline-block
        width 100%
        li
          margin-bottom 10px
          padding 10px 0 10px 12px
          box-sizing border-box
          position: relative
          display flex
          flex-direction column
          justify-content space-around
          height 100px
          background-color rgba(0, 0, 0, 0.02)
          border-radius 5px
          .name
            margin-bottom 5px
            color $color-text
            font-size $font-size-small
            font-weight 800
          .data
            width 65%
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
            font-size $font-size-small-s
            color $color-text-ll
            .singer
              color $color-text-l
          .pic
            position absolute
            top 0
            right 0
            width 100px
            height 100px
            color $color-background
            img
              width 100%
              height 100%
              border-radius 0 5px 5px 0
    .characteristic-rank, .global-rank
      margin-top 20px
    .play-list
      display flex
      flex-wrap wrap
      justify-content space-between
      align-content center
      .list-item
        position relative
        flex 0 0 31%
        margin-bottom 20px
        max-width 107px
        .item-img
          position relative
          max-height  107px
          color $color-background
          img
            width 100%
            height 100%
            border-radius 8px
            box-shadow rgba(0,0,0,0.02) 4px 4px 0px 0px
        .item-introduce
          margin-top 10px
          .name
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
            font-size $font-size-medium
          .update
            margin-bottom  10px
            display flex
            justify-content space-between
            align-content center
            color $color-text-d
            font-size $font-size-small-ss
            .updateFrequency, .updateTime
              padding 5px
              border-radius 5px
              background-color rgba(0, 0, 0, 0.03)
          .desc
            margin-top 10px
            color $color-text-l
            display -webkit-box
            -webkit-box-orient vertical
            -webkit-line-clamp 2
            overflow hidden
            line-height 15px
            font-size $font-size-small-s
    .mask
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      background-color $color-text-d
      border-radius 0 5px 5px 0
    .label
      position absolute
      top 5px
      right 5px
      font-size $font-size-small-s
    .icon
      position absolute
      left  5px
      right 5px
      bottom 5px
      display flex
      justify-content space-between
      align-content center
      i
        font-weight 800
        font-size $font-size-small
      .play-count span
        font-size $font-size-small-s
</style>
