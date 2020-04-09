<template>
  <div class="similar-playlist">
    <div class="container">
      <div class="header">
        <div class="tags">
          <label v-for="(tag, index) in tags" :key="index">{{tag}}</label>
        </div>
        <div class="order">
          <span class="new" :class="{'active': order === 'new'}" @click="changeOrder('new')">最新</span>
          <span class="gap">|</span>
          <span class="hot" :class="{'active': order === 'hot'}" @click="changeOrder('hot')">最热</span>
        </div>
      </div>
      <loading v-if="!isShow"></loading>
      <ul  v-else class="play-list">
        <li v-for="(item, index) in playlist" :key='index' @click="selectItem(item)">
          <div class="cover">
            <img v-lazy="item.coverImgUrl" alt="">
          </div>
          <div class="name">{{item.name}}</div>
          <div class="play-count">
            <i class="extend-bofangliang-"></i>
            <span>{{item.playCount | handleNum}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import {getSimilarPlayList} from 'api/axios'
import {all} from 'api/common'
import {mapMutations} from 'vuex'

export default {
  name: 'similar-play-list',
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isShow: false,
      tags: this.data.tags,
      playlist: [],
      order: 'new',
      flag: true
    }
  },
  methods: {
    fetch() {
      return this.getData()
    },
    getData() {
      // 存储所有http请求
      let reqList = []
      this.tags.forEach(item => {
        reqList.push(getSimilarPlayList({
          cat: item,
          order: this.order
        }))
      })
      return all(reqList).then(res => {
        this.playlist = this.setData(res)
        this.isShow = true
      })
    },
    setData(arr) {
      let resArr = []
      arr.forEach(item => {
        resArr.push(...item.playlists)
      })
      return resArr
    },
    changeOrder(val) {
      this.isShow = false
      this.order = val
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.id}`,
        query: {
          t: Date.now()
        },
        name: this.flag ? 'similar' : ''
      })
      this.flag = !this.flag
      this.setDisc(item) // 将选中的歌单保存到vuex中
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  watch: {
    order() {
      this.getData()
    }
  },
  components: {
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
.similar-playlist
  position relative
  .container
    margin 30px 14px
    .header
      display flex
      justify-content space-between
      font-size $font-size-small
      .tags label
        padding 5px 12px
        margin-right 10px
        background-color #f8f8f8
        border-radius 10px
        color $color-text-l
      .order
        display flex
        align-content center
        color $color-text-d
        .gap
          margin 0 8px
          font-size $font-size-small-s
          color $color-text-m
        .active
          color $color-text
    .play-list
      margin-top 30px
      display flex
      flex-wrap wrap
      justify-content space-between
      align-content center
      li
        position relative
        flex 0 0 30%
        margin-bottom 20px
        .cover
          img
            width 100%
            height 100%
            border-radius 10%
            box-shadow rgba(0,0,0,0.04) 5px 5px 0px 0px
        .name
          margin-top 10px
          padding 0 5px
          line-height 15px
          display -webkit-box
          -webkit-box-orient vertical
          -webkit-line-clamp 2
          overflow hidden
          font-size $font-size-small-s
        .play-count
          position absolute
          top 2px
          right 4px
          color $color-text-l
          span, i
            font-size $font-size-small-s
          i
            font-weight 600
</style>
