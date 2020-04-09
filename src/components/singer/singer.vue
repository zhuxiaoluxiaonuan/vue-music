<template>
  <div class="singer" ref="singer">
    <tab-scroll :tabs="tabs" @questData="fetch"></tab-scroll>
    <div class="singer-list">
      <list-view :singers="singers" @select="selectSinger" ref="list"></list-view>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import TabScroll from 'base/scroll/tab-scroll'
import ListView from 'base/list-view/list-view'
import {getSingerCategory} from 'api/axios'
import Singer from 'common/js/singer'
import {mapMutations} from 'vuex' // 用vuex提供的语法糖，更便捷的提交 mutation
import {playListMixin} from 'common/js/mixin'

const pinyin = require('pinyin')
const HOT_NAME = '热门'
const HOST_LEN = 10
export default {
  name: 'singer',
  data () {
    return {
      tabs: [
        {
          param: {area: -1, type: [1, 2, 3]},
          name: '全部'
        },
        {
          param: {area: 7, type: [1]},
          name: '华语男'
        },
        {
          param: {area: 7, type: [2]},
          name: '华语女'
        },
        {
          param: {area: 7, type: [3]},
          name: '华语组合/乐队'
        },
        {
          param: {area: 96, type: [1]},
          name: '欧美男'
        },
        {
          param: {area: 96, type: [2]},
          name: '欧美女'
        },
        {
          param: {area: 96, type: [3]},
          name: '欧美组合/乐队'
        },
        {
          param: {area: 8, type: [1]},
          name: '日本男'
        },
        {
          param: {area: 8, type: [2]},
          name: '日本女'
        },
        {
          param: {area: 8, type: [3]},
          name: '日本组合/乐队'
        },
        {
          param: {area: 16, type: [1]},
          name: '韩国男'
        },
        {
          param: {area: 16, type: [2]},
          name: '韩国女'
        },
        {
          param: {area: 16, type: [3]},
          name: '韩国组合/乐队'
        },
        {
          param: {area: 0, type: [1]},
          name: '其他男'
        },
        {
          param: {area: 0, type: [2]},
          name: '其他女'
        },
        {
          param: {area: 0, type: [3]},
          name: '其他组合/乐队'
        }
      ],
      singers: [],
      tabSinger: []
    }
  },
  mixins: [playListMixin],
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '45px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    fetch({index, param}) {
      if (this.tabSinger[index]) { // 当前项的数据已经被请求过
        this.singers = this.tabSinger[index]
        return
      }
      let type = param.type
      let area = param.area
      if (area === -1) { // 当前请求的是全部数据
        let tempArr = []
        getSingerCategory({
          type: type[0],
          area: area
        }).then(res => {
          if (res.code === 200) {
            tempArr.push(res.artists.slice(0, 20)) // 取前20条数据
            return getSingerCategory({
              type: type[1],
              area: area
            })
          }
        }).then(res => {
          if (res.code === 200) {
            tempArr.push(res.artists.slice(0, 20))
            return getSingerCategory({
              type: type[2],
              area: area
            })
          }
        }).then(res => {
          if (res.code === 200) {
            tempArr.push(res.artists.slice(0, 20))
            this.singers = this.getSingers(tempArr[0].concat(tempArr[1]).concat(tempArr[2]))
            this.tabSinger[index] = this.singers
            tempArr = null
          }
        })
      } else {
        getSingerCategory({
          type: type[0],
          area: area,
          limit: 50
        }).then(res => {
          if (res.code === 200) {
            this.singers = this.getSingers(res.artists)
            this.tabSinger[index] = this.singers
          }
        })
      }
    },
    getSingers(data) {
      const hotArr = [{
        title: HOT_NAME,
        items: []
      }]
      const singerArr = []
      data.forEach((item, index) => {
        if (index < HOST_LEN) {
          hotArr[0].items.push(new Singer({
            id: item.id,
            name: item.name,
            picUrl: item.img1v1Url,
            alias: item.alias,
            musicSize: item.musicSize,
            albumSize: item.albumSize,
            topicPerson: item.topicPerson
          }))
        }
        const key = pinyin(item.name[0], {
          style: pinyin.STYLE_FIRST_LETTER // 首字母风格，只返回拼音的首字母部分。
        })[0][0].toUpperCase()
        let flag = false
        for (let i = 0; i < singerArr.length; i++) {
          const singer = singerArr[i]
          if (singer.title === key) {
            singer.items.push(new Singer({
              id: item.id,
              name: item.name,
              picUrl: item.img1v1Url,
              alias: item.alias,
              musicSize: item.musicSize,
              albumSize: item.albumSize,
              topicPerson: item.topicPerson
            }))
            flag = true
            return
          }
        }
        if (singerArr.length === 0 || !flag) {
          singerArr.push({
            title: key,
            items: [new Singer({
              id: item.id,
              name: item.name,
              picUrl: item.img1v1Url,
              alias: item.alias,
              musicSize: item.musicSize,
              albumSize: item.albumSize
            })]
          })
        }
      })
      singerArr.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hotArr.concat(singerArr)
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      // 将需要传递的参数保存到state中
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    TabScroll,
    ListView
  }
}
</script>

<style scoped lang="stylus">
.singer
  position fixed
  top 95px
  bottom 0
  width 100%
  .singer-list
    position absolute
    top 50px
    bottom 0
    width 100%
    overflow-x hidden
</style>
