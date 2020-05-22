<template>
 <transition name="slide">
   <div class="user-center">
     <div class="user-title">
       <i class="icon-delete" @click="back"></i>
     </div>
     <div class="header">
       <div class="user-avatar">
         <div class="left" v-if="!user.userId">
           <div class="img"></div>
           <div class="login-desc">点击登录，让音乐更懂你</div>
         </div>
         <div class="user-pic" v-else>
           <div class="img">
             <img :src="user.avatarUrl" alt="">
           </div>
           <div class="login-desc">{{user.nickname}}</div>
         </div>
         <div class="login-button" @click="goToLogin">{{loginText}}</div>
       </div>
       <div class="desc-list">
         <div class="list-item">
           <i class="extend-xihuan1"></i>
           <span>喜欢</span>
         </div>
         <div class="list-item">
           <i class="extend-zuijin1"></i>
           <span>最近</span>
         </div>
         <div class="list-item">
           <i class="extend-shoucang"></i>
           <span>收藏</span>
         </div>
         <div class="list-item">
           <i class="extend-xiazai2"></i>
           <span>下载</span>
         </div>
         <div class="list-item">
           <i class="extend-yigou-copy"></i>
           <span>已购</span>
         </div>
       </div>
     </div>
     <div class="center">
       <div class="center-wrapper">
         <div class="my-link">
           <div class="sub-title">我的喜欢</div>
           <div class="swiper">
             <div class="swiper-item" @click="showMyLike(0)">
               <div class="mask">
                 <div class="inner">
                   <i class="extend-xihuan1"></i>
                   <span>我喜欢的音乐</span>
                 </div>
               </div>
             </div>
             <div class="swiper-item" @click="showMyLike(1)">
               <div class="mask">
                 <div class="inner">
                   <i class="extend-guanzhu"></i>
                   <span>我关注的歌手</span>
                 </div>
               </div>
             </div>
             <div class="swiper-item" @click="showMyLike(2)">
               <div class="mask">
                 <div class="inner">
                   <i class="extend-shoucang"></i>
                   <span>我收藏的歌单</span>
                 </div>
               </div>
             </div>
           </div>
         </div>
         <div class="recently-played">
           <div class="sub-title">最近播放</div>
           <div class="play-history" @click.stop>
             <div class="title">
               <div class="left">
                 <i class="icon-play"></i>
                 <span class="text" @click="playAll">播放全部(共{{playHistory.length}}首)</span>
               </div>
               <div class="right">
                 <i class="icon-clear" @click="deleteAll"></i>
               </div>
             </div>
             <div class="no-history" v-if="!playHistory.length">暂无播放记录</div>
             <scroll class="play-list">
               <ul>
                 <li class="play-item" v-for="song in playHistory" :key="song.id" @click="selectItem(song)">
                   <div class="song-name">{{song.name}}</div>
                   <div class="desc">
                     <div class="label" v-show="song.fee !== 0">独家</div>
                     <div class="super-quality" v-show="song.privilege && (!song.privilege.dl || song.privilege.pl !== song.privilege.dl)">SQ</div>
                     <span class="singer">{{song.singer}}</span>-
                     <span class="album">{{song.album}}</span>
                   </div>
                 </li>
               </ul>
             </scroll>
           </div>
         </div>
       </div>
     </div>
     <my-like :initial-index="initialIndex" ref="myLike"></my-like>
   </div>
 </transition>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import Song from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import MyLike from './my-like'
import {exitLogin} from 'api/axios'
import {deleteUser} from 'common/js/cache'

export default {
  name: 'user-center',
  data() {
    return {
      initialIndex: 0
    }
  },
  methods: {
    back() {
      this.$router.push({
        path: '/recommend'
      })
    },
    goToLogin() {
      if (this.user.userId) {
        exitLogin().then(res => {
          if (res.code === 200) {
            this.showToastType('退出登录成功', 'correct', 800)
            this.setUser({isShow: false})
            deleteUser()
          }
        })
      } else {
        // 显示登录页面
        this.setUser({isShow: true})
      }
    },
    showToastType(txt, type, time) {
      const toast = this.$createToast({
        time: time,
        txt: txt,
        type: type
      })
      toast.show()
    },
    selectItem(item) {
      // 一定要注意把item装换为Song的实例，否则无法调取getLyric方法
      this.$emit('selectItem', new Song(item))
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        if (item.id) {
          ret.push(new Song(item))
        }
      })
      return ret
    },
    playAll() {
      this.$emit('playAll', this._normalizeSongs(this.playHistory))
    },
    deleteAll() {
      this.$emit('clearPlayHistory')
    },
    showMyLike(index) {
      this.initialIndex = index
      this.$refs.myLike.show()
    },
    ...mapMutations({
      'setUser': 'SET_USER'
    })
  },
  computed: {
    loginText() {
      return this.user.userId ? '退出登录' : '立即登录'
    },
    ...mapGetters([
      'playHistory',
      'user'
    ])
  },
  components: {
    Scroll,
    MyLike
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.user-center
  position fixed
  top 0
  left 0
  bottom 0
  right 0
  z-index 10
  background-color $color-background
  .user-title
    padding 15px 14px 5px 0
    text-align right
    background-color rgba(0, 0, 0, 0.87)
    color $color-background
    font-size $font-size-small
  .sub-title
    margin 20px 0
    font-size $font-size-medium-x
    font-weight 800
    color $color-background
  .header
    padding 0 14px 20px 14px
    background-color rgba(0, 0, 0, 0.87)
    color $color-background
    .user-avatar
      display flex
      justify-content space-between
      align-items center
      .left
        display flex
        align-items center
        .img
          margin-right 10px
          width 48px
          height 48px
          bg-image('./no-login')
          background-size 48px 48px
          border-radius 50%
        .login-desc
          font-size $font-size-small
      .user-pic
        display flex
        align-items center
        .img
          margin-right 10px
          width 48px
          height 48px
          border-radius 50%
          img
            width 100%
            height 100%
            border-radius 50%
        .login-desc
          font-size $font-size-small
      .login-button
        padding 5px 8px
        border 1px solid $color-background
        font-size $font-size-small
        border-radius 12px
    .desc-list
      margin 30px 10px
      display flex
      justify-content space-between
      align-items center
      .list-item
        position relative
        display flex
        flex-direction column
        justify-content space-between
        align-items center
        height 45px
        &:nth-child(1) i
          position relative
          top -6px
          font-size 26px
        &:nth-child(2) i, &:nth-child(3) i, &:nth-child(5) i
          position relative
          top -3px
        &:nth-child(4) i
          font-size $font-size-large
        i
          font-size $font-size-large-x
        span
          font-size $font-size-small-s
  .center
    position absolute
    top 170px
    bottom 0
    left 0
    right 0
    border-radius 18px 18px 0 0
    background-color $color-text
    .center-wrapper
      position absolute
      top 0
      bottom 0
      left 14px
      right 14px
      .my-link
        margin-bottom 10px
        .swiper
          display flex
          justify-content space-between
          align-items center
          .swiper-item
            position relative
            width 32%
            height 140px
            border-radius 8px
            background-position: 0 0 ;
            background-size 150% 150%
            background-repeat no-repeat
            animation bgAnimation 15s infinite alternate
            .mask
              position absolute
              top 0
              left 0
              right 0
              bottom 0
              background $color-text-d
              border-radius 8px
              .inner
                position absolute
                left 0
                top 0
                right 0
                bottom 0
                margin auto
                height 50px
                display flex
                flex-direction column
                justify-content space-around
                align-items center
                i
                  font-size 32px
                  color #e84b20
                span
                  color $color-background
                  font-size $font-size-small
            &:nth-child(1)
              background-image url("cover01.jpg")
            &:nth-child(2)
              background-image url("cover02.jpg")
              .mask .inner i
                font-size $font-size-large-x
            &:nth-child(3)
              background-image url("cover03.jpg")
              .mask .inner i
                font-size 28px

            @keyframes bgAnimation
              0%
                background-position: 0 0 ;
              100%
                background-position: 70% 70%;
      .recently-played
        .play-history
            position absolute
            top 252px
            bottom 0
            left 0
            right 0
          .title
            padding 0
            margin-bottom 20px
            display flex
            justify-content space-between
            align-items center
            font-size $font-size-medium
            color $color-background
            .left
              display flex
              align-items center
              i
                margin-right 10px
                font-size $font-size-large
            .right i
              font-size $font-size-medium
          .no-history
            height 60px
            line-height 60px
            text-align center
            font-size $font-size-medium
            color $color-text-d
          .play-list
            position absolute
            top 38px
            bottom 0
            left 0
            right 0
            color $color-background
            height auto
            .play-item
              position relative
              display flex
              flex-direction column
              justify-content center
              margin-bottom 25px
              .song-name, .album
                white-space nowrap
                overflow hidden
                text-overflow ellipsis
              .song-name
                margin-bottom 10px
                font-size $font-size-medium
              .desc
                display flex
                align-items center
                font-size $font-size-small
                color $color-background-l
                .label, .super-quality
                  margin-right 5px
                  height 14px
                  line-height 14px
                  text-align center
                  color $color-background-l
                  font-size $font-size-small-s
                  border-radius 1px
                  border 1px solid $color-background-l
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
&.slide-enter-active, &.slide-leave-active
  transition: all 0.3s
&.slide-enter, &.slide-leave-to
  transform: translate3d(-100%, 0, 0)
</style>
