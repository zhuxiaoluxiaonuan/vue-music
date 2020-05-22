<template>
  <transition name="slide">
    <div class="add-song" v-show="visible" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">&#10005;</div>
      </div>
      <!--搜索框-->
      <div class="search-box-wrapper">
        <search-box
          placeholder="请输入歌曲"
          @del="del"
          @query="query"
          ref="searchBox"
        ></search-box>
      </div>
      <!--搜索建议页面-->
      <div class="search-suggest" v-show="step===2" ref="searchSuggest">
        <ul v-show="searchSuggests.length">
          <li class="suggest-item" v-for="(item, index) in searchSuggests" :key="index" @click="addQuery(item.keyword, 1, '在线歌曲')">
            <i class="icon-search"></i>
            <span>{{item.keyword}}</span>
          </li>
        </ul>
        <div v-show="isResult" class="no-result-wrapper">
          <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
      </div>
      <!--搜索结果页/默认展示页-->
      <div class="search-result" v-show="step===1">
        <cube-tab-bar
          v-model="selectedLabel"
          show-slider
          ref="cubeTabBar"
          @change="changePage">
          <cube-tab v-for="item in tabs" :label="item.label" :key="item.label">
          </cube-tab>
        </cube-tab-bar>
        <cube-tab-panels v-model="selectedLabel">
          <cube-tab-panel v-for="item in tabs" :label="item.label" :key="item.label">
            <component
              :is="item.component"
              :data="item.data"
              @selectItem="selectItem"
              @playAll="playAll"
              @clearPlayHistory="showConfirm"
              @addQuery="selectQuery"></component>
          </cube-tab-panel>
        </cube-tab-panels>
      </div>
      <confirm ref="confirm" @confirm="clearPlayHistory" text="是否确认清空播放列表？"></confirm>
    </div>
  </transition>
</template>

<script>
import Single from './single'
import PlayHistory from './play-history'
import Confirm from 'base/confirm/confirm'
import {getSearchResult} from 'api/axios'
import {searchMixin} from 'common/js/mixin'
import {mapActions} from 'vuex'
const SIZE = 20

export default {
  name: 'add-song',
  mixins: [searchMixin],
  data() {
    return {
      visible: false,
      page: 1,
      selectedLabel: '在线歌曲'
    }
  },
  methods: {
    show() {
      this.visible = true
      this._getHotSearch()
    },
    hide() {
      this.visible = false
    },
    _getSearchResult() {
      getSearchResult({
        keywords: this.keywords,
        type: 1,
        limit: SIZE,
        offset: this.page - 1
      }).then(res => {
        if (res.code === 200) {
          this.hotSearchList = res.result.songs
        }
      })
    },
    changePage(label) {
      this.selectedLabel = label
    },
    selectItem(song) {
      this.insertSong(song)
      this.showToastType()
    },
    showToastType() {
      const toast = this.$createToast({
        txt: '添加成功',
        type: 'correct'
      })
      toast.show()
    },
    selectQuery(keywords) {
      this.addQuery(keywords, 1, '在线歌曲')
      this._getSearchResult()
    },
    playAll(songList) {
      this.showToastType()
      this.randomPlay({
        list: songList
      })
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    ...mapActions([
      'randomPlay',
      'clearPlayHistory'
    ])
  },
  computed: {
    tabs() {
      return [
        {
          label: '在线歌曲',
          component: Single,
          data: {
            songList: this.hotSearchList
          }
        },
        {
          label: '播放记录',
          component: PlayHistory,
          data: {}
        }
      ]
    }
  },
  components: {
    Single,
    Confirm
  },
  watch: {
    step (newVal) {
      if (newVal === 1 && this.keywords !== '') {
        this._getSearchResult()
      }
    },
    keywords(newVal) {
      if (newVal === '') {
        this._getHotSearch()
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
.add-song
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color $color-background
  .header
    position relative
    height 40px
    line-height 40px
    text-align center
    color $color-background
    background-color $color-text
    .close
      position absolute
      top 0
      right 14px
      font-size $font-size-medium-x
      color $color-background
  .search-box-wrapper
    margin 20px 14px
  .search-suggest
    position absolute
    top 95px
    left 0
    right 0
    bottom 0
    padding 0 14px
    background-color $color-background
    z-index 2
    .suggest-item
      margin 30px 0
      display flex
      align-items center
      i
        margin-right 5px
        font-size $font-size-large-x
  .no-result-wrapper
    position absolute
    width 100%
    top 50%
    transform: translateY(-50%)
  >>> .cube-tab-bar
    justify-content center
  >>> .cube-tab
    flex 0 60px
    font-size $font-size-small
    color $color-text-d
    &:first-child
      margin-right 30px
    &.cube-tab_active
      font-size $font-size-medium
      color $color-text
  >>> .cube-tab-bar-slider{
    background-color $color-text
  }
  >>> .cube-tab-panels
    position absolute
    top 160px
    left 0
    right 0
    bottom 0
  >>> .cube-tab-panels-group
    height 100%
  &.slide-enter-active, &.slide-leave-active
    transition: all 0.3s
  &.slide-enter, &.slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
