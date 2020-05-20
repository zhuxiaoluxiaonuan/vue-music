<template>
  <transition name="slide">
    <!-- 这里一定要使用v-if，不能使用v-show，否则子组件也会被编译 -->
    <div class="singer-detail" v-if="isShow">
      <music-list
        :singer="singer"
        @setMinHeight='setMinHeight'
        @back="back"
        paddingTop="75%"
        :min-title="singer.name"
        :min-tabs="minTabs"
        ref="musicList">
        <template v-slot:descSlot="props">
          <div class="desc-content">
            <div class="bg-image" :style="bgStyle">
              <div class="filter"></div>
            </div>
            <div v-show="!props.isScrollTop" class="person-container">
              <div class="introduce">
                <div class="name">{{singer.name}}</div>
                <div class="rank" v-show="props.rankNum !== 0">歌手热门榜华语地区&nbsp;NO.{{props.rankNum}}</div>
                <div class="topic">
                  <span>关注 0</span>
                  <span>|</span>
                  <span>话题 {{singer.topicPerson}}</span>
                </div>
                <div class="desc">Deer音乐人</div>
              </div>
              <div class="follow" v-show="!props.isScrollTop" @click="follow" v-html="followText"></div>
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
import {mapGetters, mapActions} from 'vuex'
import Single from 'components/singer-detail/single'
import Album from 'components/singer-detail/album'
import About from 'components/singer-detail/about'
import Tab from 'base/tab/tab'
import MusicList from 'components/music-list/music-list'

const LIKE_KEY = 'singer'
export default {
  name: 'singer-detail',
  created() {
    this._initPage()
  },
  data() {
    return {
      minHeight: 0,
      isShow: false
    }
  },
  methods: {
    _initPage() {
      // 判断对象是否为空对象: Object.keys(this.singer).length === 0
      if (Object.keys(this.singer).length === 0) { // 当用户直接进入歌手详情页面时，应该跳转到歌手列表页面
        this.$router.push('/singer')
        return
      }
      // 这里一定要加上延迟，否则没有出场动画，且延迟的时间必须 >= 出场动画的时间
      setTimeout(() => {
        this.isShow = true
      }, 400)
    },
    back() {
      this.$router.back()
    },
    follow() {
      if (!this.user.userId) {
        this.showToastType('请先登录', 'warn', 800)
        return
      }
      this.followed ? this.deleteLikeList({
        type: LIKE_KEY,
        list: this.singer,
        userId: this.user.userId
      }) : this.saveLikeList({
        type: LIKE_KEY,
        list: this.singer,
        userId: this.user.userId
      })
      this.showToastType(this.followed ? '关注成功' : '已取消关注', 'correct', 800)
    },
    showToastType(txt, type, time) {
      const toast = this.$createToast({
        time: time,
        txt: txt,
        type: type
      })
      toast.show()
    },
    setMinHeight(minHeight) {
      this.minHeight = minHeight
    },
    findIndex(list, like) {
      return list.findIndex((item) => {
        return item.id === like.id
      })
    },
    ...mapActions([
      'saveLikeList',
      'deleteLikeList'
    ])
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.singer.picUrl})`
    },
    tabs() {
      return [
        {
          label: '单曲',
          component: Single,
          data: {
            singer: this.singer,
            size: this.singer.musicSize
          }
        },
        {
          label: '专辑',
          component: Album,
          data: {
            singer: this.singer,
            size: this.singer.albumSize
          }
        },
        {
          label: '关于TA',
          component: About,
          data: {
            singer: this.singer
          }
        }
      ]
    },
    minTabs() {
      return [
        {
          label: '单曲',
          data: {
            size: this.singer.musicSize
          }
        },
        {
          label: '专辑',
          data: {
            size: this.singer.albumSize
          }
        },
        {
          label: '关于TA',
          data: {
            size: ''
          }
        }
      ]
    },
    followText() {
      return this.followed ? '&#10003&nbsp;已关注' : '＋&nbsp;关注'
    },
    followed() {
      return this.user.userId && this.likeList[this.user.userId] && this.likeList[this.user.userId][LIKE_KEY] && this.findIndex(this.likeList[this.user.userId][LIKE_KEY], this.singer) > -1
    },
    ...mapGetters([ // 使用对象展开运算符将 getter 混入 computed 对象中
      'singer',
      'user',
      'likeList'
    ])
  },
  components: {
    MusicList,
    Tab
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.singer-detail
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
      padding-top: 75%
      transform-origin: top
      background-size: cover
      background-color $color-background-l
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: $color-text-m
    .person-container
      position absolute
      top 150px
      left 14px
      z-index 2
      width 100%
      .introduce
        color $color-background
        .name, .rank, .topic
          margin-bottom: 15px
        .name
          font-size $font-size-large
          font-weight 800
        .rank, .topic, .desc
          font-size $font-size-small
      .follow
        position absolute
        right 28px
        bottom 0
        width 65px
        height 28px
        line-height 28px
        text-align center
        border-radius 15px
        background-color $color-background
        color $color-text
        font-size $font-size-small
        font-weight 800
        z-index 2
  &.slide-enter-active, &.slide-leave-active
    transition: all 0.4s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
