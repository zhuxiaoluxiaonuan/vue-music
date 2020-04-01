<template>
  <transition name="slide">
    <!-- 这里一定要使用v-if，不能使用v-show，否则子组件也会被编译 -->
    <div class="singer-detail" v-if="isShow">
      <music-list :singer="singer" @setMinHeight='setMinHeight' ref="musicList">
        <div class="tab-wrapper" >
          <tab :tabs="tabs" :min-height="minHeight"></tab>
        </div>
      </music-list>
    </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import Single from 'components/singer-detail/single'
import Album from 'components/singer-detail/album'
import About from 'components/singer-detail/about'
import Tab from 'base/tab/tab'
import MusicList from 'components/music-list/music-list'
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
      this.isShow = true
    },
    setMinHeight(minHeight) {
      this.minHeight = minHeight
    }
  },
  computed: {
    ...mapGetters([ // 使用对象展开运算符将 getter 混入 computed 对象中
      'singer'
    ]),
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
    }
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
  &.slide-enter-active, &.slide-leave-active
    transition: all 0.4s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
