<template>
  <div class="search-home">
    <scroll>
      <div class="scroll-content">
        <div class="history">
          <div class="title">历史记录</div>
        </div>
        <div class="hot-search-list">
          <div class="title">热搜榜</div>
          <div class="search-item" v-for="(item, index) in hotSearchList" :key="index">
            <span class="num" :class="index < 3 ? 'special' : ''">{{index + 1}}</span>
            <div class="container">
              <div class="name">
                <span class="txt">{{item.searchWord}}</span>
                <img :src="item.iconUrl" alt="" v-show="item.iconUrl">
              </div>
              <div class="content">{{item.content}}</div>
            </div>
            <div class="score">{{item.score}}</div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import {getHotSearch} from 'api/axios'
import Scroll from 'base/scroll/scroll'
export default {
  name: 'search-home',
  data() {
    return {
      hotSearchList: []
    }
  },
  created () {
    this._getHotSearch()
  },
  methods: {
    _getHotSearch() {
      getHotSearch().then(res => {
        if (res.code === 200) {
          this.hotSearchList = res.data
        }
      })
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.search-home
  position fixed
  top 150px
  left 14px
  right 14px
  bottom 0
  .title
    margin-bottom 20px
    font-size $font-size-medium
    font-weight 800
  .history
    padding-top 10px
  .search-item
    margin 20px 0 0 5px
    display flex
    justify-content space-between
    align-items center
    .num
      flex 0 30px
      font-size $font-size-medium
      color $color-text-m
      &.special
        color red
    .container
      flex 1
      display flex
      flex-direction column
      justify-content space-between
      height 35px
      .name
        font-size $font-size-medium
        .txt
          margin-right 10px
        img
          width auto
          height 12px
      .content
        font-size $font-size-small-s
        color $color-text-l
    .score
      flex 0 60px
      text-align right
      font-size $font-size-small
      color $color-text-l
</style>
