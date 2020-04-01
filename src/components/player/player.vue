<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal"
                      @enter="enter"
                      @after-enter="afterEnter"
                      @leave="leave"
                      @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen" :style="bgStyle">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image">
      </div>
      <div class="msk"></div>
      <div class="header">
        <span class="back" @click="back">
          <i class="extend-fanhui"></i>
        </span>
        <span class="label" :class="{'active':currentShow==='cover'}">歌曲</span>
        <span class="separator">|</span>
        <span class="label" :class="{'active':currentShow==='lyric'}">歌词</span>
      </div>
      <div class="play-main"
           @touchstart="mainTouchStart"
           @touchmove="mainTouchMove"
           @touchend="mainTouchEnd"
      >
        <div class="leftPage" ref="leftPage">
          <div class="container">
            <div class="img" ref="img">
              <img v-lazy="currentSong.image" alt="">
            </div>
            <div class="desc">
              <div class="left">
                <div class="song-name">{{currentSong.name}}</div>
                <div class="singer-name">{{currentSong.singer}}</div>
                <div class="songN-singerN">{{currentContent}}</div>
              </div>
              <div class="right">
                <i class="extend-extend-test"></i>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="progress-wrapper">
              <span class="time time-l">{{timeFormat(playTime)}}</span>
              <div class="progress-bar-wrapper">
                <progress-bar :percent="percent" @percentChange="onProgressBarChange" @percentChangeEnd="onProgressBarChangeEnd"></progress-bar>
              </div>
              <span class="time time-r">{{timeFormat(duration)}}</span>
            </div>
            <div class="operators">
              <div class="icon i-right i-fir i-light" >
                <i :class="iconMode" class="icon-mode" @click="changeMode"></i>
              </div>
              <div class="icon i-left i-sec" :class="disableCls">
                <i class="extend extend-shangyishou-" @click="prev"></i>
              </div>
              <div class="icon i-center" :class="disableCls">
                <i :class="playIcon" class="icon-play" @click="togglePlaying"></i>
              </div>
              <div class="icon i-right i-sec" :class="disableCls">
                <i class="extend extend-xiayishou-copy" @click="next"></i>
              </div>
              <div class="icon i-left i-fir i-last i-light">
                <i class="extend extend-bofangliebiao1"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="rightPage" ref="rightPage">
          <div class="title">
            <div class="name">{{currentSong.name}}</div>
            <div class="singer">{{currentSong.singer}}</div>
          </div>
          <scroll class="lyricList" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines"
                   :key="index">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
          <div class="bottom"></div>
        </div>
      </div>
    </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
      <div :class="miniPlay">
        <img :src="currentSong.image" alt="">
      </div>
      <div class="name">
        <div class="title">{{currentSong.name}}</div>
        <div class="singer">{{currentSong.singer}}</div>
      </div>
      <div class="play" @click.stop="togglePlaying">
        <progress-circle :radius="radius" :percent="percent">
          <i :class="miniIcon"></i>
        </progress-circle>
      </div>
      <div class="list">
        <i class="extend extend-bofangliebiao1"></i>
      </div>
    </div>
    </transition>
    <audio :src="url" ref="audio" autoplay @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import analyze from 'rgbaster'
import {prefixStyle} from 'common/js/dom'
import {getSongUrl} from 'api/axios'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  name: 'player',
  data() {
    return {
      color: '#3abdb1',
      url: '',
      songReady: false,
      currentTime: 0,
      duration: 0,
      playTime: 0,
      radius: 24, // 圆形进度条的半径
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cover', // 当前显示的是哪一个页面 cover: 封面 lyric: 歌词
      playingLyric: '' // 当前正在播放的歌词
    }
  },
  created() {
    this.progressChange = false
    this.touch = {}
  },
  methods: {
    showToastType() {
      const toast = this.$createToast({
        txt: this.modeTxt,
        type: 'correct'
      })
      toast.show()
    },
    async getBgColor() {
      if (this.currentSong.image) {
        const result = await analyze(this.currentSong.image, { scale: 0.6 })
        this.color = result[0].color
      }
    },
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.img, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.img.style.animation = ''
    },
    leave(el, done) {
      this.$refs.img.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.img.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.img.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.img.style.transition = ''
      this.$refs.img.style[transform] = ''
    },
    togglePlaying() {
      if (!this.songReady) { // 保证音频可以播放
        return
      }
      this.setPlaying(!this.playing)
      const audio = this.$refs.audio
      this.playing ? audio.play() : audio.pause()
      if (this.currentLyric) {
        this.currentLyric.togglePlay() // 当歌曲暂停的时候，歌词也应该跟随改变
      }
    },
    prev() {
      if (!this.songReady) { // 保证音频可以播放
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    next() {
      if (!this.songReady) { // 保证音频可以播放
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    ready() {
      this.songReady = true
    },
    error() {
      this.songReady = true
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    end() { // 当音乐播放完时调用
      if (this.mode === playMode.loop) { // 当前是循环播放
        this.loop()
      } else {
        this.next()
      }
    },
    loop() {
      // 设置已经播放的时间为0 <=> 重新播放
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlaying(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0) // 每次重新播放的时候，歌词切换到最顶部
      }
    },
    timeFormat(interval) {
      interval = interval | 0 // 向下取整
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    onProgressBarChange(percent) {
      this.progressChange = true
      this.playTime = this.duration * percent
    },
    onProgressBarChangeEnd(percent) {
      this.progressChange = false
      const currentTime = this.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000) // 将歌词定位到当前时间
      }
    },
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      this.showToastType()
      let list = this.sequenceList
      if (mode === playMode.random) {
        list = shuffle(list)
      }
      // 在打乱顺序的列表中找到与当前播放的音乐对应的index，并将它赋值到当前的index属性中
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(arr) {
      let index = arr.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getLyric() {
      this.currentSong.getLyric().then(res => {
        this.currentLyric = new Lyric(res, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play() // 调用封装好的play方法【这里的play方法就是回调函数handleLyric】，播放歌词
        }
      })
    },
    handleLyric({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    mainTouchStart(e) {
      if (e.target.tagName === 'I' || e.target.className === 'progress-btn') return
      this.touch.initialed = true
      // 用来判断是否是一次移动
      this.touch.moved = false
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    mainTouchMove(e) {
      if (e.target.tagName === 'I' || e.target.className === 'progress-btn') return
      if (!this.touch.initialed) return
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) - Math.abs(deltaX) > 10) { // 纵向滑动
        return
      }
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      const left = this.currentShow === 'cover' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.rightPage.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.rightPage.style[transitionDuration] = 0
      this.$refs.leftPage.style.opacity = 1 - this.touch.percent
      this.$refs.leftPage.style[transitionDuration] = 0
    },
    mainTouchEnd(e) {
      if (e.target.tagName === 'I' || e.target.className === 'progress-btn') return
      if (!this.touch.moved) {
        return
      }
      let offsetWidth
      let opacity
      if (this.currentShow === 'cover') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cover'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.rightPage.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.rightPage.style[transitionDuration] = `${time}ms`
      this.$refs.leftPage.style.opacity = opacity
      this.$refs.leftPage.style[transitionDuration] = `${time}ms`
      this.touch.initiated = false
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len += 1
      }
      return num
    },
    _getPosAndScale() {
      const targetWidth = 40
      const paddingLeft = 20
      const paddingBottom = 8
      const paddingTop = 70
      const width = window.innerWidth - 60
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    _getData() {
      getSongUrl({
        id: this.currentSong.id
      }).then(res => {
        if (res.code === 200) {
          this.url = res.data[0].url
        }
      })
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    })
  },
  computed: {
    ...mapGetters([
      'playList',
      'fullScreen',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    bgStyle() {
      return `background: ${this.color}`
    },
    playIcon() {
      return this.playing ? 'extend-zanting1' : 'extend-bofang1'
    },
    miniIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlay() {
      return this.playing ? 'img' : 'img paused'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    percent() {
      return this.currentTime / this.duration
    },
    iconMode() {
      return this.mode === playMode.loop ? 'extend-danquxunhuan1' : (this.mode === playMode.random ? 'extend-bofangye-caozuolan-suijibofang' : 'extend-xunhuanbofang')
    },
    modeTxt() {
      return this.mode === playMode.loop ? '单曲循环' : (this.mode === playMode.random ? '随机播放' : '顺序播放')
    },
    currentContent() {
      if (!this.playingLyric) {
        return `${this.currentSong.name} - ${this.currentSong.singer}`
      }
      return this.playingLyric
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }
      this._getData()
      this.getBgColor()
      this.getLyric()
      if (this.currentLyric) { // 结束上一首歌曲的歌词滚动定时器
        this.currentLyric.stop()
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
    },
    url(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.songReady = true
          this.next()
        }, 1000)
      }
      // 获取音乐的播放时间
      let timer = setInterval(() => {
        this.duration = this.$refs.audio.duration
        if (this.duration) {
          clearInterval(timer)
        }
      }, 150)
    },
    currentTime(newVal) {
      if (!this.progressChange) {
        this.playTime = newVal
      }
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.player
  .normal-player
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 150
    .background, .msk
      position absolute
      left 0
      top 0
      width 100%
      height 100%
    .background
      z-index -2
      opacity 0.6
      filter blur(40px)
      transform scale(1.2)
    .msk
      z-index -1
      background-color $color-background-d
    .header
      margin 0 14px 20px 14px
      height 50px
      line-height 50px
      text-align center
      .back
        float left
        i
          font-size $font-size-large-x
          color $color-text
      .label, .separator
        vertical-align top
        color $color-text-l
        &.active
          color $color-text
      .label
        margin 0 5px
        font-size $font-size-small
      .separator
        font-size $font-size-small-s
    .play-main
      position fixed
      top 70px
      left 30px
      right 30px
      bottom 20px
      white-space: nowrap
      .leftPage
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height 100%
        .container
          display flex
          flex-direction column
          justify-items center
          .img
            width 100%
            img
              width 100%
              height 100%
              border-radius 15px
          .desc
            position relative
            margin-top 40px
            display flex
            justify-content space-between
            .left
              flex 1
              .song-name, .singer-name, .songN-singerN
                margin-bottom 15px
              .song-name
                width 280px
                height 30px
                line-height 30px
                font-size $font-size-large-x
                font-weight 800
                white-space nowrap
                overflow hidden
                text-overflow ellipsis
              .singer-name, .songN-singerN
                color $color-text-l
                font-size $font-size-small
              .songN-singerN
                margin-top 20px
            .right
              position relative
              top -4px
              i
                font-size $font-size-large-xx
        .bottom
          position absolute
          bottom 0
          width 100%
          .progress-wrapper
            margin-bottom 20px
            display flex
            align-items center
            .time
              flex 1
              font-size $font-size-small
            .progress-bar-wrapper
              flex 8
            .time-l
              text-align left
            .time-r
              text-align right
          .operators
            display flex
            align-items center
            .icon
              &.disable
                color $color-text-l
            .i-fir
              flex 2
            .i-sec
              flex 1
            .i-left
              text-align right
            .i-center
              flex 2
              padding 0 20px
              text-align center
            .i-right
              text-align left
            .i-last
              position relative
              right -8px
            .i-light
              color $color-text-l
            .icon-mode
              font-size 20px
            .extend-shangyishou-
              font-size 22px
            .icon-play
              font-size 50px
            .extend-xiayishou-copy
              font-size 24px
            .extend-bofangliebiao1
              font-size 36px
      .rightPage
        display: inline-block
        vertical-align: top
        margin 0 20px 0 50px
        width: 100%
        height 100%
        color $color-text-l
        .title
          .name
            margin-bottom 10px
            font-size $font-size-large-x
          .singer
            font-size $font-size-medium
        .lyricList
          position absolute
          top 55px
          bottom 60px
          width: 100%
          height auto
          .lyric-wrapper
            overflow: hidden
            .text
              line-height 36px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                transform-origin left
                transition transform .3s
                transform scale(1.2)
                color: $color-text
        .bottom
          position absolute
          bottom 0
          width: 100%
          height 40px
          display flex
          align-items center
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
    .header, .bottom
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .header
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
  .mini-player
    position fixed
    left 0
    right 0
    bottom 0
    display flex
    align-content center
    padding 0 14px
    height 45px
    background $color-background
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .img
      padding 5px
      position relative
      top -8px
      width 40px
      height 40px
      border-radius 50%
      background $color-background
      animation rotate 10s linear infinite
      &.paused
        animation-play-state paused
      img
        width 100%
        height 100%
        border-radius 50%
    .name
      margin 8px 0 0 15px
      width 55%
      .title
        margin-bottom 5px
        font-size $font-size-medium
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
      .singer
        font-size $font-size-small-s
        color $color-text-l
    .play
      position absolute
      top 10px
      right 65px
      i
        position absolute
        top 0
        left 0
        font-size 24px
        z-index -1
    .list
      position absolute
      right 8px
      top 2px
      i
        font-size 40px
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
