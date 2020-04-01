<template>
  <div class="tab-view">
    <div class="tab-container">
      <div class="tab-scroll" ref="tabScroll">
        <div class="scroll-group" ref="scrollGroup">
          <div :class="{'scroll-item': true, active: index === tabNum}" v-for="(tab, index) in tabs" :key="tab.id" @click="changeActive(index)">{{tab.name}}</div>
        </div>
      </div>
      <div class="icon" @click="changeState">
        <i class="extend extend-you-" ref="foldIcon"></i>
      </div>
    </div>
    <div class="folding-panel" v-show="toggle">
      <div class="item" v-for="(tab, index) in tabSub" :key="tab.id" @click="changeActive(index)">{{tab.name}}</div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'tab-scroll',
  props: {
    tabs: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      tabSub: this.tabs.slice(5),
      tabNum: 0,
      preIndex: 0,
      toggle: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._setWidth()
      this._initScroll()
      this.$emit('questData', {
        index: 0,
        id: this.tabs[0].id
      })
    }, 20)
  },
  methods: {
    _setWidth() {
      let children = this.$refs.scrollGroup.children
      let width = 0
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        width += child.getBoundingClientRect().width + 20
        child.direction = width
      }
      this.$refs.scrollGroup.style.width = width + 'px'
    },
    _initScroll() {
      this.scroll = new BScroll(this.$refs.tabScroll, {
        startX: 0,
        click: true,
        scrollX: true,
        scrollY: false,
        eventPassthrough: 'vertical'
      })
    },
    changeActive(index) {
      if (this.toggle) {
        index += 5
      }
      if (this.preIndex === index) return
      this.tabNum = index
      this.preIndex = index
      if (this.toggle) {
        this.toggle = false
      }
    },
    changeState(e) {
      this.toggle = !this.toggle
      // 滚动条立即回到的第一条数据
      this.scroll.scrollToElement(this.$refs.scrollGroup.children[0], 0)
      this.tabNum = 0
    }
  },
  watch: {
    tabNum(newIndex) {
      this.scroll && this.scroll.scrollToElement(this.$refs.scrollGroup.children[newIndex], 300, true)
      this.$emit('questData', {
        index: newIndex,
        id: this.tabs[newIndex].id
      }) // 根据ID请求数据
    },
    toggle(newVal) {
      this.$refs.foldIcon.style.transform = `rotate(${newVal ? 90 : 0}deg)`
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  .tab-view
    width 100%
    .tab-container
      margin 10px 14px
      display flex
      align-items center
      .tab-scroll
        overflow hidden
        .scroll-group
          white-space: nowrap
          .scroll-item
            display: inline-block
            margin-right 20px
            height 24px
            line-height 24px
            font-size $font-size-small
            color $color-text-ll
            &:last-child
              margin-right 0
            &.active
              padding 0 10px
              border-radius 3px
              background-color $color-text-m
              color $color-text
      .icon
        margin 0 10px
        i
          display inline-block
          color $color-text-ll
          font-size $font-size-medium
          transition: All 0.3s ease-in-out
    .folding-panel
      position relative
      padding 0 14px 10px 14px
      display flex
      flex-wrap wrap
      z-index 10
      background-color $color-background
      border-radius 0 0 10px 10px
      -webkit-box-shadow: rgba(0,0,0,0.09) 0px 6px 9px 0px;
      box-shadow: rgba(0,0,0,0.09) 0px 6px 9px 0px;
      .item
        margin 10px 20px 10px 0
        font-size $font-size-small
        color $color-text-ll
</style>
