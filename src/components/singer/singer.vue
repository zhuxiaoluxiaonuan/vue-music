<template>
  <div class="singer">
    <tab-scroll :tabs="tabs" @questData="fetch"></tab-scroll>
    <div class="singer-list">
      <list-view :singers="singers" @select="selectSinger"></list-view>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import TabScroll from 'base/scroll/tab-scroll'
import ListView from 'base/list-view/list-view'
import {getSingerList, getSingerCategory} from 'api/axios'
import Singer from 'common/js/singer'
import {mapMutations} from 'vuex' // 用vuex提供的语法糖，更便捷的提交 mutation

const pinyin = require('pinyin')
const HOT_NAME = '热门'
const HOST_LEN = 10
export default {
  name: 'singer',
  data () {
    return {
      tabs: [
        {
          id: 0,
          name: '全部'
        },
        {
          id: 5001,
          name: '入驻'
        },
        {
          id: 1001,
          name: '华语男'
        },
        {
          id: 1002,
          name: '华语女'
        },
        {
          id: 1003,
          name: '华语组合/乐队'
        },
        {
          id: 2001,
          name: '欧美男'
        },
        {
          id: 2002,
          name: '欧美女'
        },
        {
          id: 2003,
          name: '欧美组合/乐队'
        },
        {
          id: 6001,
          name: '日本男'
        },
        {
          id: 6002,
          name: '日本女'
        },
        {
          id: 6003,
          name: '日本组合/乐队'
        },
        {
          id: 7001,
          name: '韩国男'
        },
        {
          id: 7002,
          name: '韩国女'
        },
        {
          id: 7003,
          name: '韩国组合/乐队'
        },
        {
          id: 4001,
          name: '其他男'
        },
        {
          id: 4002,
          name: '其他女'
        },
        {
          id: 4003,
          name: '其他组合/乐队'
        }
      ],
      singers: [],
      tabSinger: []
    }
  },
  methods: {
    fetch({index, id}) {
      if (this.tabSinger[index]) { // 当前项的数据已经被请求过
        this.singers = this.tabSinger[index]
      } else {
        if (id === 0) {
          getSingerList().then(res => {
            if (res.code === 200) {
              this.singers = this.getSingers(res.artists)
              this.tabSinger[index] = this.singers
            }
          })
        } else {
          getSingerCategory({
            cat: id
          }).then(res => {
            if (res.code === 200) {
              this.singers = this.getSingers(res.artists)
              this.tabSinger[index] = this.singers
            }
          })
        }
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
