<template>
  <transition name="slide">
    <div class="top-list"  v-if="isShow">
      <music-list
        ref="musicList"
        @setMinHeight='setMinHeight'
        paddingTop="70%"
        :min-title="title"
        @back="back"
        @getHeight="getHeight"
      >
        <template v-slot:descSlot>
          <div class="desc-content">
            <div class="bg-image" :style="{backgroundImage: `url(${coverUrlBlur})`}"></div>
            <div class="person-container">
              <div v-if="rankList.creator">
                <div class="top">
                  <div class="cover" @click="goToDetail">
                    <img :src="picture" alt="">
                  </div>
                  <div class="introduce">
                    <div class="title">{{title}}</div>
                    <div class="author">
                      <img v-lazy="rankList.creator.avatarUrl" class="author-pic" alt="">
                      <span class="author-name">{{rankList.creator.nickname}}</span>
                    </div>
                    <div class="brief">{{rankList.description}}</div>
                  </div>
                </div>
                <div class="bottom">
                  <div class="icon playCount">
                    <i class="extend-bofangliang-"></i><span>{{rankList.playCount | handleNum}}</span>
                  </div>
                  <div class="icon comment">
                    <i class="extend-pinglun"></i><span>{{rankList.commentCount | handleNum}}</span>
                  </div>
                  <div class="icon download">
                    <i class="extend-xiazai"></i><span>下载</span>
                  </div>
                  <div class="icon share">
                    <i class="extend-fenxiang"></i><span>{{rankList.shareCount | handleNum}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:songList>
          <single ref="single"
                    :data="songList"
                    :rank="rank"
                    :single-height="singleHeight"
          ></single>
        </template>
      </music-list>
    </div>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import Single from 'components/singer-detail/single'
import {mapGetters, mapMutations} from 'vuex'
import {imgToBlob} from 'common/js/util'
import {color} from 'common/js/background-color'
import {getRecommendSongRank} from 'api/axios'

export default {
  name: 'top-list',
  created() {
    this.flag = !this.topList.updateFrequency
    if (this.topList.rankType === 0 || this.topList.rankType === 1 || this.topList.rankType === 2 || this.topList.rankType === 3 || this.topList.rankType === 25) {
      this.topListFlag = true // 标志当前点击的是哪种排行榜
    }
    this.init()
  },
  data() {
    return {
      rankList: {},
      minHeight: 0,
      singleHeight: 0,
      isShow: false,
      coverUrlBlur: color.black,
      rank: true,
      topListFlag: false
    }
  },
  mounted() {
  },
  methods: {
    init() {
      if (Object.keys(this.topList).length === 0) { // 当用户直接进入排行榜详情页面时，应该跳转到排行榜页面
        this.$router.push('/rank')
        return
      }
      imgToBlob(this.picture + '?imageView=1&thumbnail=225x0', blur => {
        this.coverUrlBlur = blur
      }, 100, -0.1)
      // 请求数据
      this._getData()
    },
    _getData() {
      if (this.flag) {
        this.rankList = this.topList
        this.setShow()
      } else {
        getRecommendSongRank({
          idx: this.topList.rankType
        }).then(res => {
          if (res.code === 200) {
            this.rankList = res.playlist
            this.setShow()
          }
        })
      }
    },
    goToDetail() {
      this.setDisc(this.topList)
      // 显示歌单封面详情页面
      this.playListCoverComp = this.playListCoverComp || this.$createPlayListCover({
        $props: {
          brief: this.topList.description,
          tags: this.topList.tags,
          topList: this.topListFlag
        }
      })
      this.playListCoverComp.show()
    },
    setShow() {
      setTimeout(() => {
        this.isShow = true
      }, 400)
    },
    getHeight(height) {
      this.singleHeight = height
    },
    setMinHeight(minHeight) {
      this.minHeight = minHeight
    },
    back() {
      this.$router.push('/rank')
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  computed: {
    title() {
      return this.topList.name
    },
    picture() {
      if (this.topListFlag) {
        return this.topList.tracks[0].al.picUrl
      }
      return this.topList.coverImgUrl
    },
    songList() {
      let res = {
        songList: this.flag ? this.topList.tracks : this.rankList.tracks || []
      }
      return res
    },
    ...mapGetters(['topList'])
  },
  watch: {
    songList() {
      setTimeout(() => {
        this.$refs.single && this.$refs.single.fetch()
      }, 800)
    }
  },
  components: {
    MusicList,
    Single
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.top-list
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 100
  background-color $color-background
  .desc-content
    .bg-image
      position relative
      padding-top: 70%
      transform-origin: top;
      background-size: cover;
    .person-container
      position absolute
      top 50px
      left 20px
      right 20px
      display flex
      flex-direction column
      justify-content center
      .top
        display: flex
        justify-content space-between
        .cover
          position relative
          margin-right 20px
          flex 0 0 112px
          height 112px
          img
            width 100%
            height 100%
            border-radius 5px
          .subscribers
            position absolute
            left 0
            right 0
            bottom 0
            display flex
            flex-direction row-reverse
            justify-content space-between
            align-items center
            padding 0 2px
            height 18px
            background-color $color-text-l
            border-radius 0 0 5px 5px
            .left
              flex 0 0 50%
              height 14px
              display flex
              align-content center
              .subscriber-pic
                position relative
                width 14px
                height 14px
                img
                  position absolute
                  width 100%
                  height 100%
                  border-radius 50%
                &:nth-child(1) img
                  left 0
                &:nth-child(2) img
                  left -2px
                &:nth-child(3) img
                  left -4px
                &:nth-child(4) img
                  left -6px
            .txt
              font-size $font-size-small-s
              color $color-background-ll
        .introduce
          flex 1
          overflow hidden
          display flex
          flex-direction column
          justify-content space-between
          color $color-background
          .title
            display -webkit-box
            -webkit-box-orient vertical
            -webkit-line-clamp 2
            overflow hidden
            line-height 22px
            font-size $font-size-medium-x
          .author
            display flex
            align-items center
            .author-pic
              margin-right 10px
              width 20px
              height 20px
              border-radius 50%
            .author-name
              color $color-background-l
              font-size $font-size-small-s
              white-space nowrap
              overflow hidden
              text-overflow ellipsis
          .brief
            white-space pre-wrap
            display -webkit-box
            -webkit-box-orient vertical
            -webkit-line-clamp 2
            overflow hidden
            font-size $font-size-small-s
            color $color-background-l
            line-height 14px
      .bottom
        margin-top 30px
        display: flex
        justify-content space-between
        .icon
          display flex
          flex-direction column
          justify-content space-between
          align-items center
          height 40px
          color $color-background
          i
            font-size $font-size-large
          span
            font-size $font-size-small
          &.playCount i
            font-weight 800
          &.download i, &.comment i
            font-weight 600
          &.download i
            position relative
            top -2px
            font-size $font-size-large-x
  &.slide-enter-active, &.slide-leave-active
    transition: all 0.4s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
