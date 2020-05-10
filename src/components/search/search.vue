<template>
  <div class="search">
    <search-box
      :defaultSearch="defaultSearch"
      ref="searchBox"
      @del="del"
      @input="input"></search-box>
    <!--这里使用v-if，而不使用v-show，是为了防止切换页面之后，scroll无法滚动-->
    <scroll class="search-home" v-if="step===1" ref="scroll">
      <div class="scroll-content">
        <div class="history">
          <div class="title">历史记录</div>
        </div>
        <div class="hot-search-list">
          <div class="title">热搜榜</div>
          <div class="search-item" v-for="(item, index) in hotSearchList" :key="index" @click="addQuery(item.searchWord)">
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
    <ul class="search-suggest" v-show="searchSuggests.length">
      <li class="suggest-item" v-for="(item, index) in searchSuggests" :key="index" @click="addQuery(item.keyword)">
        <i class="icon-search"></i>
        <span>{{item.keyword}}</span>
      </li>
    </ul>
    <div class="search-result" v-show="step===2">
      <cube-tab-bar
        v-model="selectedLabel"
        show-slider
        ref="cubeTabBar"
        @change="changePage">
        <cube-tab v-for="item in categoryList" :label="item.label" :key="item.label">
        </cube-tab>
      </cube-tab-bar>
      <cube-tab-panels v-model="selectedLabel">
        <cube-tab-panel v-for="item in categoryList" :label="item.label" :key="item.label">
          <component :is="item.component" ref="component" @selectItem="selectItem"></component>
        </cube-tab-panel>
      </cube-tab-panels>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {getDefaultSearch, getSearchSuggest, getHotSearch} from 'api/axios'
import Scroll from 'base/scroll/scroll'
import Comprehensive from 'components/search/search-result/comprehensive'
import Single from 'components/search/search-result/single'
import PlayList from 'components/search/search-result/play-list'
import Singer from 'components/search/search-result/singer'
import Album from 'components/search/search-result/album'
import {mapMutations, mapActions} from 'vuex'

export default {
  name: 'search',
  data() {
    return {
      defaultSearch: {},
      hotSearchList: [],
      searchSuggests: [],
      selectedLabel: '单曲', // 这里设置的值不能是默认值，否则不会出现下划线
      step: 1,
      categoryList: [
        {
          label: '综合',
          component: Comprehensive
        },
        {
          label: '单曲',
          component: Single
        },
        {
          label: '歌单',
          component: PlayList
        },
        {
          label: '歌手',
          component: Singer
        },
        {
          label: '专辑',
          component: Album
        }
      ],
      keywords: ''
    }
  },
  created() {
    this._getDefaultSearch()
    this._getHotSearch()
  },
  methods: {
    input(keywords) {
      this.keywords = keywords
      if (keywords === '') {
        this.searchSuggests = []
        return
      }
      this._getSearchSuggest()
    },
    del() {
      this.step = 1
    },
    _getDefaultSearch() {
      getDefaultSearch().then(res => {
        if (res.code === 200) {
          this.defaultSearch = {
            showKeyword: res.data.showKeyword,
            realkeyword: res.data.realkeyword
          }
        }
      })
    },
    _getHotSearch() {
      getHotSearch().then(res => {
        if (res.code === 200) {
          this.hotSearchList = res.data
        }
      })
    },
    _getSearchSuggest() {
      getSearchSuggest({
        keywords: this.keywords,
        limit: 10,
        type: 'mobile'
      }).then(res => {
        if (res.code === 200) {
          this.searchSuggests = res.result.allMatch
        }
      })
    },
    addQuery(keywords) {
      this.keywords = keywords
      this.$refs.searchBox.setQuery(keywords)
      this.searchSuggests = []
      this.step = 2
      this.changePage('综合')
    },
    getCategoryListIndex(val) {
      return this.categoryList.findIndex(item => item.label === val)
    },
    changePage(label) {
      this.selectedLabel = label
      let index = this.getCategoryListIndex(label)
      // 调用子组件的fetch方法
      let component = this.$refs.component[index]
      component.fetch && component.fetch(this.keywords)
    },
    selectItem({type, item}) {
      if (type === 'playlist') {
        this.$router.push({
          path: '/search/playlist'
        })
        this.setDisc(item) // 将选中的歌单保存到vuex中
      }
      if (type === 'singer') {
        this.$router.push({
          path: '/search/singer'
        })
        // 将选中的歌手保存到vuex中
        this.setSinger(item)
      }
      if (type === 'single') {
        // 调用vuex中的action
        this.insertSong(item)
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC',
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertSong'])
  },
  components: {
    SearchBox,
    Scroll,
    Comprehensive,
    Single,
    PlayList,
    Album
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
.search
  position fixed
  top 95px
  left 14px
  right 14px
  bottom 0
  .search-suggest
    position absolute
    top 50px
    left 0
    right 0
    bottom 0
    padding 0 10px
    background-color $color-background
    z-index 2
    .suggest-item
      margin 30px 0
      display flex
      align-items center
      i
        margin-right 5px
        font-size $font-size-large-x
  .search-home
    position absolute
    top 56px
    left 0
    right 0
    bottom 0
    height auto
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
  .search-result
    position absolute
    top 56px
    left 0
    right 0
    bottom 0
    >>> .cube-tab-bar
      justify-content space-between
    >>> .cube-tab
      flex 0 30px
      font-size $font-size-small
      color $color-text-d
      &.cube-tab_active
        font-size $font-size-medium
        color $color-text
    >>> .cube-tab-bar-slider{
      background-color $color-text
    }
    >>> .cube-tab-panels
      position absolute
      top 45px
      left 0
      right 0
      bottom 0
    >>> .cube-tab-panels-group
      height 100%
</style>
