<template>
  <div class="recommend">
    <scroll :data="personalized" ref="scroll">
      <loading  v-if="!banners.length"></loading>
      <div v-else class="recommend-content">
        <div v-if="banners.length">
          <slider>
            <div v-for="item in banners" :key="item.pic">
              <img :src="item.pic" :data-id="item.targetId" @load="loadImage">
            </div>
          </slider>
        </div>
        <div v-if="personalized.length" class="personalized"  >
          <header class="title">推荐歌单</header>
          <swiper>
            <div v-for="item in personalized" :key="item.id">
              <div class="picture">
                <img v-lazy="item.picUrl" :data-id="item.id">
              </div>
              <p class="des">{{item.name}}</p>
              <div class="playCount">
                <i class="icon icon-play"></i>
                <span>{{item.playCount | setPlayCount}}</span>
              </div>
            </div>
          </swiper>
        </div>
        <div v-if="newSongs.length" class="newsong">
          <header class="title">新歌速递</header>
          <list-swiper>
            <ul v-for="(newsong, index) in updateNewSongs" :key="index">
              <li v-for="item in newsong" :key="item.id">
                <div class="icon">
                  <img v-lazy="item.picUrl">
                </div>
                <div class="text">
                  <h2 class="name">{{item.name}}</h2>
                  <p class="singer">{{item.song.artists | getSinger}}</p>
                </div>
                <div class="icon-right">
                  <i class="icon-mini icon-play-mini"></i>
                </div>
                <div class="mark"></div>
              </li>
            </ul>
          </list-swiper>
        </div>
        <div v-if="styleRecommend.length" class="styleRecommend">
          <header class="title">风格推荐</header>
          <div class="m-title">{{ getStyleDes }}</div>
          <style-swiper>
            <div v-for="item in styleRecommend" :key="item.id">
              <div class="picture">
                <img v-lazy="item.coverImgUrl" :data-id="item.coverImgId">
              </div>
              <p class="des">{{item.name}}</p>
              <div class="playCount">
                <i class="icon icon-play"></i>
                <span>{{item.playCount | setPlayCount}}</span>
              </div>
            </div>
          </style-swiper>
        </div>
        <div v-if="songRank.length" class="songRank">
          <header class="title">热歌排行</header>
          <rank-swiper @setRankType="setRankType">
            <ul v-for="(rank, index) in songRank" :key="index">
              <li>
                <div class="name">{{getRankName}}</div>
                <div class="data" v-for="(song, index) in rank" :key="song.id">
                  <span class="num">{{index + 1}}</span>
                  <span class="songName">{{song.name}}</span>
                  <span>&nbsp;-</span>
                  <span class="singer">{{song.ar[0].name}}</span>
                </div>
                <div class="pic">
                  <img v-lazy="rank[0].al.picUrl" data-id="rank[0].al.id">
                  <div class="icon">
                    <i class="icon icon-play"></i>
                  </div>
                </div>
              </li>
            </ul>
          </rank-swiper>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import Swiper from 'base/swiper/swiper'
import StyleSwiper from 'base/swiper/style-swiper'
import ListSwiper from 'base/swiper/list-swiper'
import RankSwiper from 'base/swiper/rank-swiper'
import {
  getRecommendBanner,
  getRecommendPersonalized,
  getRecommendNewSong,
  getRecommendSongSheet,
  getRecommendSongRank} from 'api/axios'
export default {
  name: 'recommend',
  data() {
    return {
      banners: {},
      personalized: [],
      newSongs: [],
      songRank: [],
      styleRecommend: [],
      count: Math.round(Math.random() * 10) % 3,
      rankType: 0, // 记录当前的排行榜类型，取值范围[0, 1, 2]
      tempNum: 0, // 记录当前更新过几个列表, 取值范围[0, 1, 2]
      direction: 'right'
    }
  },
  created() {
    this._getBannerData()
    this._getPersonalizedData()
    this._getRecommendNewSong()
    this._getRecommendSongSheet()
    this._getRecommendSongRank(true)
  },
  methods: {
    _getBannerData() {
      getRecommendBanner().then(data => {
        this.banners = data.banners
      })
    },
    _getPersonalizedData() {
      getRecommendPersonalized().then(data => {
        this.personalized = data.result
      })
    },
    _getRecommendNewSong() {
      getRecommendNewSong().then(data => {
        this.newSongs = data.result
      })
    },
    _getRecommendSongSheet() {
      getRecommendSongSheet({
        limit: 10,
        cat: ['华语', '古风', '民谣'][this.count]
      }).then(data => {
        this.styleRecommend = data.playlists.splice(1)
      })
    },
    _getRecommendSongRank(isFirst) {
      getRecommendSongRank({
        idx: isFirst ? this.rankType : this.rankType + 1
      }).then(data => {
        const result = data.playlist.tracks.splice(0, 3)
        if (isFirst) {
          this.songRank.push(result, result, result)
        } else {
          this.$forceUpdate() // 强制更新
          this.songRank[this.rankType] = result
        }
      })
    },
    setRankType(val) {
      if (this.direction === 'right' && val !== 2) this.rankType = val + 1
      if (this.direction === 'left' && val !== 0) this.rankType = val - 1
      this.direction = val === 2 ? 'left' : (val === 0 ? 'right' : 'right')
      if (this.tempNum === 2) return
      this.tempNum += 1
      this._getRecommendSongRank()
    },
    loadImage() {
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh()
      }
    }
  },
  filters: {
    setPlayCount(count) {
      let tempCount = count
      if (count / 100000000 >= 1) {
        tempCount = Number(parseFloat(count / 100000000).toFixed(2).slice(0, -1))
        tempCount += '亿'
      } else if (count / 10000 >= 1) {
        tempCount = Number(parseFloat(count / 10000).toFixed(2).slice(0, -1))
        tempCount += '万'
      }
      return tempCount
    },
    getSinger(artists) {
      let singer = []
      artists.forEach(item => {
        singer.push(item.name)
      })
      return singer.join('/')
    }
  },
  computed: {
    updateNewSongs() {
      let songArr = []
      let tempArr = []
      this.newSongs.forEach((item, index) => {
        if (index < (3 * (songArr.length + 1))) {
          tempArr.push(item)
        } else {
          songArr.push(tempArr)
          tempArr = [item]
        }
      })
      tempArr = null
      return songArr
    },
    getStyleDes() {
      return ['一秒沦陷 华语精选', '余音绕梁 惊艳古风', '诗意栖居 民谣精选'][this.count]
    },
    getRankName() {
      return ['Deer新歌榜', 'Deer热歌榜', 'Deer原创歌曲榜'][this.rankType]
    }
  },
  components: {
    Loading,
    Scroll,
    Slider,
    Swiper,
    ListSwiper,
    StyleSwiper,
    RankSwiper
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
.recommend
  position: fixed
  top: 95px
  left: 0
  right: 0
  bottom: 0
  width: 100%
  .title
    margin-bottom: 12px
    font-size: $font-size-medium
    color: $color-theme
    letter-spacing 4px
  .personalized, .newsong, .styleRecommend, .songRank
    margin 20px 14px
  .styleRecommend .m-title
    margin-bottom 15px
    font-size $font-size-medium
    color $color-text
  .songRank
    padding-bottom 20px
</style>
