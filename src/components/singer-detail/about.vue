<template>
  <div class="about-list">
    <loading v-if="Object.keys(baseData).length === 0"></loading>
    <div v-else>
      <div class="basic-data" v-show="baseData.briefDesc">
        <div class="title">
          <span>歌手资料</span>
          <div class="more" @click="loadMoreDesc">
            更多
            <i class="extend-you-"></i>
          </div>
        </div>
        <p class="txt" v-html="baseData.briefDesc"></p>
      </div>
      <div class="recent-hot-topics" v-show="hotSongs.length">
        <div class="title">
          <i class="icon-play"></i>
          <span>近期热门</span>
          <div class="more" @click="loadMoreSong">
            更多
            <i class="extend-you-"></i>
          </div>
        </div>
        <div class="hot-songs">
          <ul>
            <li v-for="(song, index) in hotSongs" :key="index">
              <div class="img">
                <img v-lazy="song.image" alt="">
              </div>
              <div class="container">
                <div class="song-name">{{song.name}}</div>
                <div class="desc">
                  <div class="label" v-show="song.fee !== 0">独家</div>
                  <div class="super-quality" v-show="!song.privilege.dl || song.privilege.pl !== song.privilege.dl">SQ</div>
                  <span class="singer">{{song.singer}}</span>-
                  <span class="album">{{song.album}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="similar-singer" v-show="similarSinger.length">
        <div class="title">
          <i class="icon-play"></i>
          <span>相似歌手</span>
          <div class="more">
            更多
            <i class="extend-you-"></i>
          </div>
        </div>
        <Scroll :data="similarSinger">
          <div class="similar-singer-list">
            <div class="similar-singer-item">
              <img src="" alt="" class="">
              <span class="name"></span>
            </div>
          </div>
        </Scroll>
      </div>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getSingerBaseData, getSimilarSinger} from '../../api/axios'
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'about',
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      singer: this.data.singer,
      baseData: {},
      similarSinger: []
    }
  },
  methods: {
    fetch() {
      return getSingerBaseData({
        id: this.singer.id
      }).then(baseData => {
        if (baseData && baseData.code === 200) {
          this.baseData = baseData
        }
        return getSimilarSinger({
          id: this.singer.id
        }).then(similarSinger => {
          if (similarSinger && similarSinger.code === 200) {
            this.similarSinger = similarSinger
          }
        })
      })
    },
    loadMoreSong() {
      this.setTabIndex(0)
    },
    loadMoreDesc() {
      // 显示歌手信息页面
      this.singerInformationComp = this.singerInformationComp || this.$createSingerInformation({
        $props: {
          singer: 'singer',
          baseData: 'baseData'
        }
      })
      this.singerInformationComp.show()
    },
    ...mapMutations({
      'setTabIndex': 'SET_TABINDEX'
    })
  },
  computed: {
    ...mapGetters([
      'hotSongs'
    ])
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.about-list
  padding 20px 14px
  background-color $color-background-l
  .basic-data,.recent-hot-topics,.similar-singer
    margin 20px 0
    .title
      position relative
      display flex
      align-items center
      margin-bottom 20px
      span
        font-size $font-size-medium-x
        font-weight 800
        color $color-text
      .more
        position absolute
        right 0
        display flex
        align-items center
        font-size $font-size-small
        color $color-text-l
        i
          margin-left 5px
  .recent-hot-topics, .similar-singer
    .icon-play
      font-size $font-size-large
      margin-right 8px
  .txt
    text-indent 2em // 设置首行缩进2个文字
    line-height 25px
    font-size $font-size-small
    color $color-text-ll
    white-space pre-wrap // 用于处理文字中的\n
  .recent-hot-topics
    .hot-songs li
      margin 10px 0
      display flex
      align-items center
      .img
        width 60px
        height 60px
        img
          width 100%
          height 100%
          border-radius 5px
      .container
        margin-left 25px
        display flex
        flex-direction column
        justify-content center
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
            padding 1px
            font-size $font-size-small-s
            -webkit-border-radius: 1px
            -moz-border-radius: 1px
            border-radius: 1px
          .label
            color $color-label
            border 1px solid $color-label
          .super-quality
            color $color-theme
            border 1px solid $color-theme
          .singer
            margin-left 5px
            margin-right 4px
          .album
            margin-left 4px
</style>
