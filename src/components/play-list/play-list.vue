<template>
  <transition name="slide">
    <div class="play-list"  v-if="isShow">
      <music-list
        ref="musicList"
        @setMinHeight='setMinHeight'
        paddingTop="70%"
        :min-title="title"
        :min-tabs="minTabs"
        @back="back"
      >
        <template v-slot:descSlot>
          <div class="desc-content">
            <div class="bg-image" :style="{backgroundImage: `url(${coverUrlBlur})`}"></div>
            <div class="person-container">
              <div class="top">
                <div class="cover" @click="goToDetail">
                  <img :src="picture" alt="">
                  <div class="subscribers">
                    <span class="txt">{{playlist.subscribedCount | handleNum}}收藏</span>
                    <div class="left">
                      <div class="subscriber-pic" v-for="item in playlist.subscribers" :key="item.userId">
                        <img v-lazy="item.avatarUrl" alt="">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="introduce">
                  <div class="title">{{title}}</div>
                  <div class="author">
                    <img v-lazy="playlist.avatarUrl" class="author-pic" alt="">
                    <span class="author-name">{{playlist.nickname}}</span>
                  </div>
                  <div class="brief">{{playlist.description}}</div>
                </div>
              </div>
              <div class="bottom">
                <div class="icon playCount">
                  <i class="extend-bofangliang-"></i><span>{{playlist.playCount | handleNum}}</span>
                </div>
                <div class="icon comment">
                  <i class="extend-pinglun"></i><span>{{playlist.commentCount | handleNum}}</span>
                </div>
                <div class="icon download">
                  <i class="extend-xiazai"></i><span>下载</span>
                </div>
                <div class="icon share">
                  <i class="extend-fenxiang"></i><span>{{playlist.shareCount | handleNum}}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:songList>
          <div  class="tab-wrapper" >
            <tab :tabs="tabs" :min-height="minHeight"></tab>
          </div>
        </template>
      </music-list>
    </div>
  </transition>
</template>

<script>
import Tab from 'base/tab/tab'
import MusicList from 'components/music-list/music-list'
import Single from 'components/singer-detail/single'
import SimilarPlayList from 'components/play-list/similar-play-list'
import {getPlayListDetail} from 'api/axios'
import {mapGetters} from 'vuex'
import {imgToBlob} from 'common/js/util'
import {color} from 'common/js/background-color'

export default {
  name: 'play-list',
  created() {
    this.init()
  },
  data() {
    return {
      playlist: {},
      minHeight: 0,
      isShow: false,
      coverUrlBlur: color.black
    }
  },
  methods: {
    init() {
      if (Object.keys(this.disc).length === 0) { // 当用户直接进入歌单详情页面时，应该跳转到推荐页面
        this.$router.push('/recommend')
        return
      }
      // 处理背景图片
      imgToBlob(this.picture + '?imageView=1&thumbnail=225x0', blur => {
        this.coverUrlBlur = blur
      }, 100, -0.1)
      // 请求数据
      this._getData()
    },
    _getData() {
      getPlayListDetail({
        id: this.disc.id,
        s: 3
      }).then(res => {
        if (res.code === 200) {
          this.isShow = true
          const tempPlaylist = res.playlist
          this.playlist = {
            tracks: tempPlaylist.tracks, // 歌单歌曲列表
            description: tempPlaylist.description, // 歌单描述
            commentCount: tempPlaylist.commentCount, // 评论数
            shareCount: tempPlaylist.shareCount, // 分享数
            playCount: tempPlaylist.playCount, // 播放量
            size: tempPlaylist.trackCount, // 歌曲数量
            tags: tempPlaylist.tags, // 歌单标签
            subscribers: tempPlaylist.subscribers, // 收藏该歌单的用户列表
            subscribedCount: tempPlaylist.subscribedCount, // 收藏该歌单的用户数
            nickname: tempPlaylist.creator.nickname, // 创建该歌单的用户
            avatarUrl: tempPlaylist.creator.avatarUrl // 创建该歌单的用户的头像
          }
        }
      })
    },
    goToDetail() {
      // 显示歌单封面详情页面
      this.playListCoverComp = this.playListCoverComp || this.$createPlayListCover({
        $props: {
          brief: this.playlist.description,
          tags: this.playlist.tags
        }
      })
      this.playListCoverComp.show()
    },
    setMinHeight(minHeight) {
      this.minHeight = minHeight
    },
    back() {
      this.$router.back(-1)
    }
  },
  computed: {
    title() {
      return this.disc.name
    },
    picture() {
      return this.disc.picUrl || this.disc.coverImgUrl
    },
    tabs() {
      return [
        {
          label: '歌曲列表',
          component: Single,
          data: {
            songList: this.playlist.tracks,
            size: this.playlist.size
          }
        },
        {
          label: '相似歌单',
          component: SimilarPlayList,
          data: {
            tags: this.playlist.tags
          }
        }
      ]
    },
    minTabs() {
      return [
        {
          label: '歌曲列表',
          data: {
            size: this.playlist.size
          }
        },
        {
          label: '相似歌单',
          data: {}
        }
      ]
    },
    ...mapGetters(['disc'])
  },
  components: {
    MusicList,
    Tab,
    SimilarPlayList
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.play-list
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 100
  background-color $color-background
  opacity 1
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
              flex 0 0 45%
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
    transition: all 0.2s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
